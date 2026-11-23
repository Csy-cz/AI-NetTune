// 执行实际请求和配置解析函数，通过本地 HTTP 模拟后端验证回滚契约。
// 不启动正式服务、不修改 data/sim_config.json；也不把模拟契约测试等同于线上验收。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const vm = require('node:vm');
const ts = require('typescript');

const sourcePath = process.env.NETTUNE_BACKEND_SOURCE || path.resolve(__dirname, '../src/services/backend.ts');
const source = fs.readFileSync(sourcePath, 'utf8');
const parsed = ts.createSourceFile('backend.ts', source, ts.ScriptTarget.Latest, true);
const names = new Set(['obj', 'arr', 'str', 'strings', 'numeric', 'request', 'simParamValue',
  'parseSimStatus', 'fetchSimConfig', 'fetchSimVersions', 'applySimConfig', 'rollbackSimConfig', 'fetchSimCompare']);
const selected = parsed.statements.filter(s => {
  if (ts.isFunctionDeclaration(s)) return names.has(s.name?.text);
  return ts.isVariableStatement(s) && s.declarationList.declarations.some(d => names.has(d.name.getText(parsed)));
}).map(s => s.getText(parsed)).join('\n');
const exported = ['fetchSimConfig', 'fetchSimVersions', 'applySimConfig', 'rollbackSimConfig', 'fetchSimCompare'];
const code = ts.transpileModule(selected + '\n' + exported.map(n => `exports.${n} = ${n};`).join('\n'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2023 },
}).outputText;

let active = null, revision = 0, brokenStatus = false, failRollback = false;
const history = [], calls = [];
const describe = () => ({ active: brokenStatus ? { id: 'broken' } : active, revision, versions: history.length });
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  calls.push({ path: url.pathname, versionId: url.searchParams.get('versionId') });
  let data;
  if (url.pathname === '/api/sim/config') data = describe();
  else if (url.pathname === '/api/sim/versions') data = { versions: history };
  else if (url.pathname === '/api/sim/apply') {
    let body = ''; for await (const chunk of req) body += chunk;
    const payload = JSON.parse(body);
    active = { ...payload, id: `SIMCFG-${++revision}`, appliedAt: '2026-11-23 12:00:00' };
    history.unshift({ ...active, status: 'active' });
    data = { status: describe(), version: active, notice: '已应用到仿真网络' };
  } else if (url.pathname === '/api/sim/rollback') {
    if (failRollback) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ code: 40002, message: '没有可回滚的配置版本', data: null })); return;
    }
    history[0].status = 'rolled_back'; active = null; revision++;
    data = { status: describe(), notice: '已恢复原始历史', persistence: { persisted: true } };
  } else if (url.pathname === '/api/sim/compare') {
    data = { apId: 'AP-01', before: { means: { prb_usage: 44.17 } },
      after: { means: { prb_usage: 32.17 } }, delta: { prb_usage: -12 }, rows: 11, coveredRows: 11 };
  } else { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ code: 0, message: 'success', data }));
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const sandbox = { exports: {}, API_BASE: `http://127.0.0.1:${server.address().port}`,
      fetch, AbortController, DOMException, URLSearchParams, setTimeout, clearTimeout };
    vm.createContext(sandbox); vm.runInContext(code, sandbox);
    const api = sandbox.exports;
    const initial = await api.fetchSimConfig();
    assert.equal(initial.active, null); assert.equal(initial.versions, 0);
    console.log('PASS 从未应用：active=null 正常解析');
    const payload = { scenario: '校园', apIds: ['AP-01'], params: { offload_pct: 15, capacity: 'none' },
      baseline: { offload_pct: 0, capacity: 'none' }, effectiveFrom: '2026-01-01 22:00:00' };
    const applied = await api.applySimConfig(payload);
    assert.equal(applied.status.active.params.offload_pct, 15);
    assert.equal(applied.status.active.params.capacity, 'none');
    const compare = await api.fetchSimCompare({ scenario: '校园', apId: 'AP-01',
      windowStart: payload.effectiveFrom, windowEnd: '2026-01-01 22:10:00' });
    assert.equal(compare.delta.prb_usage, -12);
    const restored = await api.rollbackSimConfig(applied.status.active.id);
    assert.equal(restored.status.active, null); assert.equal(restored.status.revision, 2);
    assert.equal(restored.notice, '已恢复原始历史');
    assert.equal(calls.find(c => c.path.endsWith('/rollback')).versionId, applied.status.active.id);
    assert.equal((await api.fetchSimConfig()).active, null);
    const versions = await api.fetchSimVersions();
    assert.equal(versions.length, 1); assert.equal(versions[0].params.capacity, 'none');
    console.log('PASS AP-01 分流应用→同段对比→回滚→重读：空配置正常，历史与枚举保留');
    const again = await api.applySimConfig({ ...payload, params: { capacity: 'one_carrier' } });
    assert.equal(again.status.active.params.capacity, 'one_carrier');
    assert.equal((await api.fetchSimVersions())[0].params.capacity, 'one_carrier');
    console.log('PASS 回滚后再次应用；载波枚举不变成 NaN');
    brokenStatus = true;
    await assert.rejects(api.fetchSimConfig(), /接口数据结构不正确/);
    brokenStatus = false; failRollback = true;
    await assert.rejects(api.rollbackSimConfig(), /没有可回滚的配置版本/);
    console.log('PASS 真正缺少参数的活动配置及业务失败仍报错，未放宽结构校验');
  } finally { await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
