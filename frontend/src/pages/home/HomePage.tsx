import { useEffect } from "react";
import type { CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import { REPLAY_CONFIG } from "../../replay/config";
import HomeScene from "./HomeScene";
import { SCENE_META } from "./scene";
import type { SceneKey } from "./scene";
import useReveal from "./useReveal";
import "./HomePage.css";

// 用户要求：首屏场景切换条整条移除，场景固定为智慧校园（插画与场景说明保留）。
// 需要恢复四项切换时，可从 backup/homepage-2026-11-24/ 或
// `git checkout e8ea01b -- frontend/src/pages/home/` 取回，scene.js 里的四套场景一直没动。
const scene: SceneKey = "campus";

const capabilities = [
  {
    kind: "observe",
    title: "观察与研判",
    description: "查看空间分布与趋势，固定时刻提问并核查证据。",
    tags: ["历史回放", "固定时刻", "证据核查"],
    // 锚点保留：工作台/预测弹窗/方案效果的跨页链接仍指向这里（说明入口已按用户要求从首页移除）。
    anchor: "replay-guide",
  },
  {
    kind: "forecast",
    title: "预测与预警",
    description: "查看未来频谱风险与区域态势，理解趋势变化。",
    tags: ["频谱风险", "区域态势", "未来时段"],
    anchor: "forecast-guide",
  },
  {
    kind: "plan",
    title: "方案与评估",
    description: "比较候选方案，调整参数并重新评估预计效果。",
    tags: ["候选方案", "参数调整", "效果对比"],
    anchor: "simulation-guide",
  },
  {
    kind: "record",
    title: "分析记录",
    description: "按问题回看研判、证据与评估，支持搜索导出。",
    tags: ["问题归档", "评估时间线", "导出备份"],
    anchor: "record-guide",
  },
] as const;

function FeatureIcon({ kind }: { kind: typeof capabilities[number]["kind"] }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    {kind === "observe" ? <>
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </> : kind === "forecast" ? <>
      <path d="M4 17.5 9.5 11l4 3.6L20 6" />
      <path d="M15 6h5v5" />
    </> : kind === "plan" ? <>
      <rect x="4" y="4" width="7" height="16" rx="2" />
      <rect x="13" y="9" width="7" height="11" rx="2" />
    </> : <>
      <rect x="5" y="3.5" width="14" height="17" rx="2.4" />
      <path d="M9 8.5h6M9 12h6M9 15.5h3.5" />
    </>}
  </svg>;
}

// 入场错峰延迟；用 CSS 变量把节奏交给样式层，逻辑里只声明序号。
const delay = (ms: number) => ({ "--d": `${ms}ms` } as CSSProperties);

export default function HomePage() {
  const { hash, key } = useLocation();
  useReveal();

  useEffect(() => {
    if (!hash) return;
    const frame = requestAnimationFrame(() => {
      // 卡片本身就是锚点（id 在 <article> 上），滚到卡片并聚焦即可。
      const target = document.getElementById(hash.slice(1));
      target?.scrollIntoView({ block: "start" });
      target?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [hash, key]);

  return <main className="ain-home">
    <section className="hp-hero" aria-labelledby="home-title">
      <div className="hp-hero-panel" aria-hidden="true" />
      <HomeScene scene={scene} fast={false} />
      <div className="hp-hero-veil" aria-hidden="true" />
      <span className="hp-hero-sweep" aria-hidden="true" />

      <div className="hp-wrap hp-hero-inner">
        <div className="hp-hero-copy">
          <p className="hp-eyebrow" data-reveal style={delay(120)}>
            <span className="hp-eyebrow-dot" aria-hidden="true" />无线网络诊断与仿真 · 意图驱动
          </p>

          <h1 id="home-title" data-reveal style={delay(200)}>
            看见网络变化，<br />
            <span className="hp-grad">让每个判断有据可循。</span>
          </h1>

          <p className="hp-lead" data-reveal style={delay(300)}>
            在工作台依次查看数据、研判问题、比较方案；右侧 AI 助手负责提问，分析记录保留每次结果。
          </p>

          <div className="hp-hero-actions" data-reveal style={delay(390)}>
            <Link className="hp-btn" to="/workbench">
              进入网络工作台
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </div>

          <p className="hp-hero-meta" data-reveal style={delay(470)}>
            <span>当前案例 · {REPLAY_CONFIG.scenario} · 七天历史回放</span>
            <span className="hp-meta-split" aria-hidden="true" />
            <span>{REPLAY_CONFIG.start.slice(0, 10)} — {REPLAY_CONFIG.end.slice(5, 10)}</span>
            <span className="hp-meta-split" aria-hidden="true" />
            <span>默认 {REPLAY_CONFIG.initialSpeed ?? 1}× 倍速</span>
          </p>
        </div>
      </div>

      <div className="hp-hero-dock" data-reveal style={delay(900)}>
        {/* 场景切换胶囊已按用户要求移除，只保留当前场景说明（插画仍是校园）。 */}
        <p key={scene} className="hp-scene-caption">{SCENE_META[scene].caption}</p>
      </div>
    </section>

    <section className="hp-caps" id="home-capabilities" tabIndex={-1} aria-labelledby="home-capabilities-title">
      <div className="hp-wrap">
        <div className="hp-caps-head">
          <h2 id="home-capabilities-title" data-reveal>从网络变化，到方案比较</h2>
          <p data-reveal style={delay(80)}>四项能力，串起一次完整分析</p>
        </div>

        <div className="hp-caps-grid">
          {capabilities.map((item, index) => <article className="hp-cap" key={item.kind} id={item.anchor} tabIndex={-1} data-reveal style={delay(index * 90)}>
            <span className="hp-cap-num">{String(index + 1).padStart(2, "0")}</span>
            <span className="hp-cap-icon"><FeatureIcon kind={item.kind} /></span>
            <h3>{item.title}</h3>
            <p className="hp-cap-desc">{item.description}</p>
            <div className="hp-cap-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
          </article>)}
        </div>
      </div>
    </section>
  </main>;
}
