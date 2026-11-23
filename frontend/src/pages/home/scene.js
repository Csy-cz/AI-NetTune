/* ==========================================================
   AI-NetTune · 等距智能城市场景（纯 SVG 程序化生成）
   楼型：办公 / 玻璃塔 / 坡屋顶 / 厂房仓库 / 商场
   素材：卡车 / 公交 / 叉车 / 货柜 / 托盘 / 广告牌 / 候车亭 / 绿化 / 喷泉
   ----------------------------------------------------------
   来源：首页设计稿 assets/js/scene.js（2026-11 版），生成逻辑未改，
   仅把 IIFE + window 挂载调整为 ESM 导出，供首页 React 组件使用；
   本文件保持纯字符串生成、不依赖 DOM，可用 Node 直接冒烟。
   ========================================================== */

  var S = 18, U = 30, OX = 530, OY = 210;
  var COS = Math.cos(Math.PI / 6);

  function iso(x, y, z) { return [OX + (x - y) * COS * U, OY + (x + y) * 0.5 * U - (z || 0) * U]; }
  function nn(v) { return Math.round(v * 10) / 10; }
  function P(p) { return iso(p[0], p[1], p[2] || 0); }
  function pts(arr) {
    return arr.map(function (p) { var q = P(p); return nn(q[0]) + ',' + nn(q[1]); }).join(' ');
  }
  function poly(arr, attr) { return '<polygon points="' + pts(arr) + '" ' + (attr || '') + '/>'; }
  function seg(a, b, attr) {
    var p = P(a), q = P(b);
    return '<line x1="' + nn(p[0]) + '" y1="' + nn(p[1]) + '" x2="' + nn(q[0]) + '" y2="' + nn(q[1]) + '" ' + (attr || '') + '/>';
  }

  /* ---------------- 颜色 ---------------- */
  function parseColor(c) {
    if (Array.isArray(c)) return c;
    if (typeof c !== 'string') return [200, 200, 200];
    if (c.charAt(0) === '#') {
      var h = c.slice(1);
      if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); });
    }
    var m = c.match(/rgba?\(([^)]+)\)/);
    if (m) return m[1].split(',').slice(0, 3).map(function (v) { return parseFloat(v); });
    return [200, 200, 200];
  }
  function rgb(a) { return 'rgb(' + a.map(function (v) { return Math.max(0, Math.min(255, Math.round(v))); }).join(',') + ')'; }
  function mix(c, t, k) {
    var a = parseColor(c), b = parseColor(t);
    return rgb(a.map(function (v, i) { return v + (b[i] - v) * k; }));
  }
  function lite(c, k) { return mix(c, [255, 255, 255], k); }
  function dim(c, k) { return mix(c, [9, 21, 46], k); }

  /* ---------------- 几何 ---------------- */
  function slab(x, y, w, d, cut) {
    return [[x + cut, y], [x + w - cut, y], [x + w, y + cut], [x + w, y + d - cut],
            [x + w - cut, y + d], [x + cut, y + d], [x, y + d - cut], [x, y + cut]];
  }

  function box3(x, y, w, d, h, c, z0) {
    z0 = z0 || 0;
    var hz = z0 + h;
    var top = [[x, y, hz], [x + w, y, hz], [x + w, y + d, hz], [x, y + d, hz]];
    var left = [[x, y + d, z0], [x + w, y + d, z0], [x + w, y + d, hz], [x, y + d, hz]];
    var right = [[x + w, y + d, z0], [x + w, y, z0], [x + w, y, hz], [x + w, y + d, hz]];
    var edge = 'stroke="' + dim(c, 0.42) + '" stroke-width=".6" stroke-opacity=".32"';
    return poly(left, 'fill="' + dim(c, 0.19) + '" ' + edge) +
           poly(right, 'fill="' + dim(c, 0.35) + '" ' + edge) +
           poly(top, 'fill="' + lite(c, 0.14) + '" stroke="' + lite(c, 0.72) + '" stroke-width=".7"');
  }

  function winY(b, color, z0) {
    z0 = z0 || 0;
    var s = '', pad = 0.22, ww = 0.32, wh = 0.28;
    var span = b.w - pad * 2;
    if (span <= 0.4) return '';
    var cols = Math.max(1, Math.round(span / (ww * 1.8)));
    var step = span / cols;
    var h = b.h - z0;
    var rows = Math.max(1, Math.floor((h - 0.45) / (wh * 1.95)));
    var zstep = (h - 0.45) / rows;
    for (var r = 0; r < rows; r++) {
      var z = z0 + 0.3 + r * zstep;
      for (var c = 0; c < cols; c++) {
        var x0 = b.x + pad + c * step + step * 0.14, x1 = x0 + ww;
        s += poly([[x0, b.y + b.d, z], [x1, b.y + b.d, z], [x1, b.y + b.d, z + wh], [x0, b.y + b.d, z + wh]],
          'fill="' + color + '" opacity=".95"');
      }
    }
    return s;
  }

  function winX(b, color, z0) {
    z0 = z0 || 0;
    var s = '', pad = 0.22, ww = 0.32, wh = 0.28;
    var span = b.d - pad * 2;
    if (span <= 0.4) return '';
    var cols = Math.max(1, Math.round(span / (ww * 1.8)));
    var step = span / cols;
    var h = b.h - z0;
    var rows = Math.max(1, Math.floor((h - 0.45) / (wh * 1.95)));
    var zstep = (h - 0.45) / rows;
    for (var r = 0; r < rows; r++) {
      var z = z0 + 0.3 + r * zstep;
      for (var c = 0; c < cols; c++) {
        var y0 = b.y + pad + c * step + step * 0.14, y1 = y0 + ww;
        s += poly([[b.x + b.w, y0, z], [b.x + b.w, y1, z], [b.x + b.w, y1, z + wh], [b.x + b.w, y0, z + wh]],
          'fill="' + color + '" opacity=".88"');
      }
    }
    return s;
  }

  function bands(b, gap) {
    gap = gap || 0.42;
    var s = '';
    for (var z = gap; z < b.h - 0.08; z += gap) {
      s += seg([b.x + 0.08, b.y + b.d, z], [b.x + b.w - 0.08, b.y + b.d, z],
        'stroke="rgba(255,255,255,.6)" stroke-width=".85"');
      s += seg([b.x + b.w, b.y + b.d - 0.08, z], [b.x + b.w, b.y + 0.08, z],
        'stroke="rgba(255,255,255,.32)" stroke-width=".85"');
    }
    return s;
  }

  /* 坡屋顶 */
  function gableRoof(b, c) {
    var r = b.rise || 0.85, yMid = b.y + b.d / 2, hz = b.h;
    var ridgeA = [b.x, yMid, hz + r], ridgeB = [b.x + b.w, yMid, hz + r];
    var front = [[b.x, b.y + b.d, hz], [b.x + b.w, b.y + b.d, hz], ridgeB, ridgeA];
    var back = [[b.x, b.y, hz], [b.x + b.w, b.y, hz], ridgeB, ridgeA];
    var end = [[b.x + b.w, b.y, hz], [b.x + b.w, b.y + b.d, hz], [b.x + b.w, yMid, hz + r]];
    return poly(back, 'fill="' + dim(c, 0.34) + '"') +
           poly(front, 'fill="' + dim(c, 0.12) + '"') +
           poly(end, 'fill="' + dim(c, 0.24) + '"') +
           seg([b.x + 0.05, yMid, hz + r], [b.x + b.w - 0.05, yMid, hz + r], 'stroke="' + lite(c, 0.4) + '" stroke-width="1.2"');
  }

  /* ---------------- 楼型 ---------------- */
  function building(b) {
    var s = '', x = b.x, y = b.y, w = b.w, d = b.d, h = b.h;
    if (b.podium) {
      s += box3(x - 0.16, y - 0.16, w + 0.32, d + 0.32, 0.28, lite(b.c, 0.02));
      x += 0.14; y += 0.14; w -= 0.28; d -= 0.28;
    }
    var bb = { x: x, y: y, w: w, d: d, h: h };

    if (b.type === 'gable') {
      s += box3(x, y, w, d, h, b.c);
      s += winY(bb, b.win || '#A8C8F0');
      s += winX(bb, b.win || '#A8C8F0');
      s += box3(x + w * 0.62, y + d * 0.22, 0.42, 0.42, 0.5, dim(b.c, 0.06), h); // 烟囱
      s += gableRoof({ x: x, y: y, w: w, d: d, h: h, rise: b.rise === undefined ? Math.min(0.9, w * 0.16) : b.rise }, b.roofC || '#C0665A');
      return s;
    }

    if (b.type === 'warehouse') {
      s += box3(x, y, w, d, h, b.c);
      // 卷帘门（正面 y+d）
      var dw = Math.min(w * 0.34, 1.1), dh = Math.min(h * 0.72, 1.5);
      var dx = x + w * 0.14;
      s += poly([[dx, y + d, 0.05], [dx + dw, y + d, 0.05], [dx + dw, y + d, dh], [dx, y + d, dh]],
        'fill="' + dim(b.c, 0.42) + '" stroke="' + dim(b.c, 0.6) + '" stroke-width=".8"');
      for (var z = 0.22; z < dh; z += 0.2) {
        s += seg([dx + 0.05, y + d, z], [dx + dw - 0.05, y + d, z], 'stroke="rgba(255,255,255,.16)" stroke-width=".8"');
      }
      // 雨棚
      s += box3(dx - 0.12, y + d - 0.34, dw + 0.24, 0.4, 0.07, lite(b.c, 0.3), dh + 0.16);
      // 屋脊通风
      s += box3(x + w * 0.55, y + d * 0.3, w * 0.3, d * 0.28, 0.2, lite(b.c, 0.34), h);
      return s;
    }

    if (b.type === 'mall') {
      s += box3(x, y, w, d, h, b.c);
      s += bands(bb, 0.5);
      // 入口玻璃
      var ew = Math.min(w * 0.42, 1.5);
      s += poly([[x + w / 2 - ew / 2, y + d, 0.12], [x + w / 2 + ew / 2, y + d, 0.12],
                 [x + w / 2 + ew / 2, y + d, 1.15], [x + w / 2 - ew / 2, y + d, 1.15]],
        'fill="rgba(214,236,255,.85)" stroke="#8FB6E4" stroke-width=".8"');
      // 雨棚
      s += box3(x + w / 2 - ew / 2 - 0.12, y + d - 0.34, ew + 0.24, 0.38, 0.07, lite(b.c, 0.32), 1.2);
      // 屋顶招牌（贴前檐的立牌）
      s += box3(x + w * 0.1, y + d - 0.14, w * 0.46, 0.12, 0.46, '#2E6BE6', h + 0.06);
      s += box3(x + w * 0.52, y + d - 0.3, 0.34, 0.28, 0.18, lite(b.c, 0.3), h);
      return s;
    }

    // office / glass
    s += box3(x, y, w, d, h, b.c);
    if (b.type === 'glass') s += bands(bb, b.band || 0.42);
    else { s += winY(bb, b.win || '#A8C8F0'); s += winX(bb, b.win || '#A8C8F0'); }
    if (b.roof !== false) {
      var rc = lite(b.c, 0.34);
      s += box3(x + w * 0.55, y + d * 0.16, Math.min(0.64, w * 0.26), Math.min(0.52, d * 0.28), 0.22, rc, h);
      if (h > 2.4) s += box3(x + w * 0.14, y + d * 0.6, 0.1, 0.1, 0.66, '#D3E0F3', h);
      if (b.tank) {
        s += '<ellipse cx="' + nn(iso(x + w * 0.3, y + d * 0.7, h + 0.42)[0]) + '" cy="' + nn(iso(x + w * 0.3, y + d * 0.7, h + 0.42)[1]) + '" rx="6" ry="9" fill="#DCE7F6" stroke="#C0D0E6"/>';
      }
    }
    return s;
  }

  function shadow(b) {
    return poly(slab(b.x + 0.08, b.y + 0.14, b.w, b.d, 0.18), 'fill="rgba(22,48,92,.16)" filter="url(#blur6)"');
  }

  /* ---------------- 树木 / 绿化 ---------------- */
  function tree(x, y, k) {
    k = k || 1;
    var p = iso(x, y, 0), r = 14 * k;
    return '<g>' +
      '<ellipse cx="' + nn(p[0]) + '" cy="' + nn(p[1] + 1) + '" rx="' + nn(r * 0.6) + '" ry="' + nn(r * 0.28) + '" fill="rgba(22,48,92,.15)"/>' +
      '<rect x="' + nn(p[0] - 1.6) + '" y="' + nn(p[1] - r * 0.62) + '" width="3.2" height="' + nn(r * 0.62) + '" rx="1.2" fill="#A08E7D"/>' +
      '<circle cx="' + nn(p[0]) + '" cy="' + nn(p[1] - r * 1.05) + '" r="' + nn(r * 0.62) + '" fill="#6FC08E"/>' +
      '<circle cx="' + nn(p[0] - r * 0.2) + '" cy="' + nn(p[1] - r * 1.28) + '" r="' + nn(r * 0.46) + '" fill="#8ED6A9"/>' +
      '<circle cx="' + nn(p[0] + r * 0.24) + '" cy="' + nn(p[1] - r * 1.0) + '" r="' + nn(r * 0.34) + '" fill="#5FB681" opacity=".8"/>' +
      '</g>';
  }

  function conifer(x, y, k) {
    k = k || 1;
    var p = iso(x, y, 0), r = 11 * k;
    return '<g>' +
      '<ellipse cx="' + nn(p[0]) + '" cy="' + nn(p[1] + 1) + '" rx="' + nn(r * 0.5) + '" ry="' + nn(r * 0.24) + '" fill="rgba(22,48,92,.15)"/>' +
      '<rect x="' + nn(p[0] - 1.4) + '" y="' + nn(p[1] - r * 0.5) + '" width="2.8" height="' + nn(r * 0.5) + '" fill="#9A8877"/>' +
      '<path d="M' + nn(p[0]) + ' ' + nn(p[1] - r * 2.5) + ' L' + nn(p[0] + r * 0.72) + ' ' + nn(p[1] - r * 0.5) + ' L' + nn(p[0] - r * 0.72) + ' ' + nn(p[1] - r * 0.5) + ' Z" fill="#4FA97A"/>' +
      '<path d="M' + nn(p[0]) + ' ' + nn(p[1] - r * 2.1) + ' L' + nn(p[0] + r * 0.55) + ' ' + nn(p[1] - r * 0.8) + ' L' + nn(p[0] - r * 0.55) + ' ' + nn(p[1] - r * 0.8) + ' Z" fill="#63BE8C" opacity=".85"/>' +
      '</g>';
  }

  function hedge(x, y, w, d) {
    return box3(x, y, w, d, 0.26, '#79C79B');
  }

  /* ---------------- 车辆 ---------------- */
  function car(x, y, along, c) {
    var w = along ? 0.9 : 0.46, d = along ? 0.46 : 0.9;
    var s = box3(x, y, w, d, 0.17, c);
    s += box3(x + (along ? 0.22 : 0.07), y + (along ? 0.07 : 0.22),
      along ? 0.46 : 0.32, along ? 0.32 : 0.46, 0.16, lite(c, 0.62), 0.17);
    return s;
  }

  function truck(x, y, along, c) {
    var w = along ? 1.75 : 0.72, d = along ? 0.72 : 1.75;
    var s = '';
    if (along) {
      s += box3(x, y, 1.28, d, 0.62, c);                       // 厢体
      s += box3(x + 1.28, y, 0.5, d, 0.5, '#F2F6FC');          // 车头
      s += box3(x + 1.34, y + 0.06, 0.34, d - 0.12, 0.2, '#8FD3F2', 0.28);
      s += box3(x - 0.02, y + 0.06, 1.3, d - 0.12, 0.05, dim(c, 0.5));
    } else {
      s += box3(x, y, w, 1.28, 0.62, c);
      s += box3(x, y + 1.28, w, 0.5, 0.5, '#F2F6FC');
      s += box3(x + 0.06, y + 1.34, w - 0.12, 0.34, 0.2, '#8FD3F2', 0.28);
      s += box3(x + 0.06, y - 0.02, w - 0.12, 1.3, 0.05, dim(c, 0.5));
    }
    return s;
  }

  function bus(x, y, along, c) {
    var w = along ? 1.55 : 0.66, d = along ? 0.66 : 1.55;
    var s = box3(x, y, w, d, 0.52, c);
    s += box3(x, y, w, d, 0.16, lite(c, 0.16), 0.52);
    // 侧窗
    if (along) {
      for (var i = 0; i < 4; i++) {
        var wx = x + 0.16 + i * 0.33;
        s += poly([[wx, y + d, 0.3], [wx + 0.24, y + d, 0.3], [wx + 0.24, y + d, 0.46], [wx, y + d, 0.46]], 'fill="rgba(220,240,255,.9)"');
      }
    } else {
      for (var j = 0; j < 4; j++) {
        var wy = y + 0.16 + j * 0.33;
        s += poly([[x + w, wy, 0.3], [x + w, wy + 0.24, 0.3], [x + w, wy + 0.24, 0.46], [x + w, wy, 0.46]], 'fill="rgba(220,240,255,.9)"');
      }
    }
    return s;
  }

  function forklift(x, y, c) {
    var p = iso(x, y, 0);
    var s = box3(x, y, 0.42, 0.42, 0.3, c || '#E8B23C');
    s += box3(x + 0.06, y + 0.06, 0.3, 0.3, 0.16, 'rgba(30,50,80,.55)', 0.3);
    s += box3(x + 0.46, y + 0.12, 0.06, 0.06, 0.62, '#B9C6DA');
    s += box3(x + 0.46, y + 0.26, 0.06, 0.06, 0.62, '#B9C6DA');
    s += box3(x + 0.5, y + 0.1, 0.16, 0.08, 0.03, '#8A97AB', 0.06);
    return s;
  }

  /* ---------------- 道具 ---------------- */
  function containers(x, y, n) {
    var cols = ['#3A6EA8', '#C4574A', '#3F7F63', '#D08A44'];
    var s = '';
    n = n || 2;
    for (var i = 0; i < n; i++) {
      var c = cols[i % cols.length];
      var yy = y + i * 0.72;
      s += box3(x, yy, 1.5, 0.62, 0.6, c);
      for (var k = 1; k < 5; k++) {
        s += seg([x + k * 0.3, yy + 0.62, 0.06], [x + k * 0.3, yy + 0.62, 0.56], 'stroke="rgba(255,255,255,.18)" stroke-width=".7"');
      }
    }
    return s;
  }

  function crates(x, y) {
    var s = box3(x, y, 0.52, 0.52, 0.34, '#D8A96A');
    s += box3(x + 0.58, y + 0.1, 0.4, 0.4, 0.26, '#E2B87E');
    s += box3(x + 0.1, y + 0.6, 0.44, 0.36, 0.22, '#C99A5C');
    return s;
  }

  function billboard(x, y) {
    var s = '';
    s += box3(x + 0.14, y + 0.08, 0.08, 0.08, 1.24, '#B7C6DA');
    s += box3(x + 1.06, y + 0.08, 0.08, 0.08, 1.24, '#B7C6DA');
    var bx = x - 0.08, by = y + 0.1, bw = 1.44, bh = 0.7, bz = 1.18;
    s += box3(bx, by, bw, 0.1, bh, '#2C4B7E', bz);
    s += poly([[bx + 0.07, by + 0.1, bz + 0.09], [bx + bw - 0.07, by + 0.1, bz + 0.09],
               [bx + bw - 0.07, by + 0.1, bz + bh - 0.09], [bx + 0.07, by + 0.1, bz + bh - 0.09]],
      'fill="#EAF3FF" opacity=".92"');
    s += poly([[bx + 0.07, by + 0.1, bz + 0.09], [bx + bw * 0.5, by + 0.1, bz + 0.09],
               [bx + bw * 0.5, by + 0.1, bz + bh - 0.09], [bx + 0.07, by + 0.1, bz + bh - 0.09]],
      'fill="#5FA8FF" opacity=".55"');
    return s;
  }

  function busStop(x, y) {
    var s = box3(x, y, 1.3, 0.08, 0.9, '#C3D1E5');
    s += box3(x + 0.06, y + 0.46, 0.08, 0.08, 0.9, '#B0C0D8');
    s += box3(x + 1.16, y + 0.46, 0.08, 0.08, 0.9, '#B0C0D8');
    s += box3(x, y, 1.3, 0.5, 0.06, '#D7E3F4', 0.92);
    s += box3(x + 0.16, y + 0.2, 0.9, 0.2, 0.08, '#9FB4CF', 0.32);
    return s;
  }

  function person(x, y, c) {
    var p = iso(x, y, 0);
    return '<g><ellipse cx="' + nn(p[0]) + '" cy="' + nn(p[1]) + '" rx="4.4" ry="2.2" fill="rgba(22,48,92,.2)"/>' +
      '<rect x="' + nn(p[0] - 2) + '" y="' + nn(p[1] - 9) + '" width="4" height="8.5" rx="2" fill="' + c + '"/>' +
      '<circle cx="' + nn(p[0]) + '" cy="' + nn(p[1] - 11) + '" r="2.5" fill="#F0D8C4"/></g>';
  }

  function lamp(x, y) {
    var p = iso(x, y, 0), t = iso(x, y, 1.25);
    return '<g><line x1="' + nn(p[0]) + '" y1="' + nn(p[1]) + '" x2="' + nn(t[0]) + '" y2="' + nn(t[1]) +
      '" stroke="#BACBE4" stroke-width="1.6" stroke-linecap="round"/>' +
      '<circle cx="' + nn(t[0]) + '" cy="' + nn(t[1]) + '" r="6" fill="rgba(120,225,255,.3)"/>' +
      '<circle cx="' + nn(t[0]) + '" cy="' + nn(t[1]) + '" r="1.9" fill="#9CF0FF"/></g>';
  }

  /* ---------------- 基站 ---------------- */
  function tower(x, y, h, z0) {
    h = h || 5.0; z0 = z0 || 0;
    var top = iso(x, y, z0 + h);
    var s = '';
    s += '<circle cx="' + nn(top[0]) + '" cy="' + nn(top[1] + 10) + '" r="58" fill="url(#towerGlow)"/>';
    s += box3(x - 0.5, y - 0.5, 1.0, 1.0, 0.16, '#D3E1F6', z0);
    s += box3(x + 0.26, y - 0.7, 0.36, 0.3, 0.3, '#E2EBF9', z0);
    s += box3(x - 0.15, y - 0.15, 0.3, 0.3, h * 0.44, '#EFF5FE', z0);
    s += box3(x - 0.11, y - 0.11, 0.22, 0.22, h * 0.32, '#EAF2FD', z0 + h * 0.44);
    s += box3(x - 0.08, y - 0.08, 0.16, 0.16, h * 0.26, '#E6EFFC', z0 + h * 0.76);
    s += box3(x - 0.15, y - 0.15, 0.3, 0.3, 0.2, '#DDE9F9', z0 + h - 0.22);

    s += '<g transform="translate(' + nn(top[0]) + ',' + nn(top[1]) + ')">' +
      '<rect x="-8.5" y="-17" width="17" height="2" rx="1" fill="#D4E3F7"/>' +
      '<rect x="-7.6" y="-15.6" width="3.2" height="13.6" rx="1.6" fill="url(#antG)"/>' +
      '<rect x="-1.6" y="-17.4" width="3.2" height="15.4" rx="1.6" fill="url(#antG)"/>' +
      '<rect x="4.4" y="-15.6" width="3.2" height="13.6" rx="1.6" fill="url(#antG)"/>' +
      '<circle cx="0" cy="-22" r="3.2" fill="#8CF4FF" opacity=".95">' +
      '<animate attributeName="opacity" values=".3;1;.3" dur="2.4s" repeatCount="indefinite"/></circle>' +
      '<path d="M-11 -18 Q0 -28 11 -18" fill="none" stroke="#8DEBFF" stroke-width="1.3" opacity=".45"/>' +
      '<path d="M-16 -14 Q0 -29 16 -14" fill="none" stroke="#8DEBFF" stroke-width="1.1" opacity=".24"/>' +
      '</g>';

    var g = iso(x, y, z0);
    [0, 1.7].forEach(function (d) {
      s += '<ellipse cx="' + nn(g[0]) + '" cy="' + nn(g[1]) + '" rx="20" ry="12" fill="none" stroke="#63DFFF" stroke-width="1.3" opacity="0">' +
        '<animate attributeName="rx" values="14;78" dur="4.4s" begin="' + d + 's" repeatCount="indefinite"/>' +
        '<animate attributeName="ry" values="8;45" dur="4.4s" begin="' + d + 's" repeatCount="indefinite"/>' +
        '<animate attributeName="opacity" values=".5;0" dur="4.4s" begin="' + d + 's" repeatCount="indefinite"/>' +
        '</ellipse>';
    });
    return s;
  }

  /* ---------------- UE ---------------- */
  function ueNode(x, y) {
    var p = iso(x, y, 0);
    return '<g>' +
      '<ellipse cx="' + nn(p[0]) + '" cy="' + nn(p[1]) + '" rx="14" ry="8" fill="none" stroke="rgba(86,222,255,.55)" stroke-width="1.2"/>' +
      '<ellipse cx="' + nn(p[0]) + '" cy="' + nn(p[1]) + '" rx="5.6" ry="3.2" fill="rgba(86,222,255,.22)"/>' +
      '<rect x="' + nn(p[0] - 3.8) + '" y="' + nn(p[1] - 16) + '" width="7.6" height="14.5" rx="2.2" fill="#F4F9FF" stroke="rgba(46,107,255,.55)" stroke-width="1"/>' +
      '<circle cx="' + nn(p[0]) + '" cy="' + nn(p[1] - 8.8) + '" r="5" fill="rgba(70,200,255,.22)"/>' +
      '<circle cx="' + nn(p[0]) + '" cy="' + nn(p[1] - 8.8) + '" r="2" fill="#2BB7FF"/>' +
      '</g>';
  }

  /* ---------------- 悬浮底座（p5 风格：无岛面，只有柔和投影） ---------------- */
  function plateSvg() {
    var c0 = iso(S / 2, S / 2, 0);
    var s = '';
    // 整组建筑 + 道路下方的柔和投影，营造“悬浮”
    s += '<ellipse cx="' + nn(c0[0]) + '" cy="' + nn(c0[1] + 74) + '" rx="352" ry="118" fill="rgba(30,70,140,.16)" filter="url(#blur26)"/>';
    s += '<ellipse cx="' + nn(c0[0]) + '" cy="' + nn(c0[1] + 40) + '" rx="300" ry="96" fill="rgba(30,70,140,.10)" filter="url(#blur26)"/>';
    return s;
  }

  /* 漂浮装饰：圆点与细环，呼应 p5 的散点 */
  function gridSvg() {
    var s = '';
    var dots = [[186, 168, 9, .18], [742, 96, 6, .2], [846, 250, 11, .14],
                [128, 470, 6, .16], [700, 706, 14, .12], [258, 700, 5, .18]];
    dots.forEach(function (d) {
      s += '<circle cx="' + d[0] + '" cy="' + d[1] + '" r="' + d[2] + '" fill="rgba(64,132,240,' + d[3] + ')"/>';
    });
    s += '<circle cx="880" cy="560" r="26" fill="none" stroke="rgba(64,132,240,.16)" stroke-width="2"/>';
    s += '<circle cx="120" cy="300" r="18" fill="none" stroke="rgba(64,132,240,.14)" stroke-width="2"/>';
    return s;
  }

  function smooth(list, segn) {
    var Q = [list[0]].concat(list, [list[list.length - 1]]);
    var out = [];
    for (var i = 1; i < Q.length - 2; i++) {
      var p0 = Q[i - 1], p1 = Q[i], p2 = Q[i + 1], p3 = Q[i + 2];
      for (var t = 0; t < segn; t++) {
        var s = t / segn, s2 = s * s, s3 = s2 * s;
        out.push([
          0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * s + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * s2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * s3),
          0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * s + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * s2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * s3)
        ]);
      }
    }
    out.push(list[list.length - 1]);
    return out;
  }

  function ribbon(line, w) {
    var L = [], R = [];
    for (var i = 0; i < line.length; i++) {
      var a = line[Math.max(0, i - 1)], b = line[Math.min(line.length - 1, i + 1)];
      var tx = b[0] - a[0], ty = b[1] - a[1], m = Math.hypot(tx, ty) || 1;
      tx /= m; ty /= m;
      L.push([line[i][0] - ty * w / 2, line[i][1] + tx * w / 2]);
      R.push([line[i][0] + ty * w / 2, line[i][1] - tx * w / 2]);
    }
    return L.concat(R.reverse());
  }

  var ROADS = [
    { w: 2.5, pts: [[-1.8, 14.4], [4.6, 13.2], [9.8, 12.2], [19.8, 10.2]] },
    { w: 2.1, pts: [[12.8, -1.8], [12.0, 5.2], [11.4, 11.9], [10.2, 19.8]] }
  ];

  function roadsSvg(sc) {
    var s = '';
    (sc.roads || ROADS).forEach(function (r) {
      var line = smooth(r.pts, 22);
      s += poly(ribbon(line, r.w + 0.7), 'fill="#E7EFFA"');
      s += poly(ribbon(line, r.w), 'fill="' + (sc.road || '#B7C9E4') + '" stroke="rgba(255,255,255,.8)" stroke-width="1.1"');
      var d = 'M' + line.map(function (p) { var q = iso(p[0], p[1], 0.06); return nn(q[0]) + ' ' + nn(q[1]); }).join('L');
      s += '<path d="' + d + '" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="1.7" stroke-dasharray="13 12" stroke-linecap="round"/>';
    });
    return s;
  }

  /* 路面流动光点 */
  function roadFlow(sc) {
    var s = '', idx = 0;
    (sc.roads || ROADS).forEach(function (r) {
      var line = smooth(r.pts, 22);
      var d = 'M' + line.map(function (p) { var q = iso(p[0], p[1], 0.1); return nn(q[0]) + ' ' + nn(q[1]); }).join('L');
      s += '<path id="rf' + idx + '" d="' + d + '" fill="none"/>';
      for (var k = 0; k < 3; k++) {
        s += '<circle r="2.6" fill="#BFF6FF" opacity="0">' +
          '<animateMotion dur="' + (16 + k * 5) + 's" begin="' + (k * 5) + 's" repeatCount="indefinite">' +
          '<mpath href="#rf' + idx + '" xlink:href="#rf' + idx + '"/></animateMotion>' +
          '<animate attributeName="opacity" values="0;.9;.9;0" dur="' + (16 + k * 5) + 's" begin="' + (k * 5) + 's" repeatCount="indefinite"/>' +
          '</circle>';
      }
      idx++;
    });
    return s;
  }

  /* 场地 */
  function decoSvg(d) {
    var s = '';
    if (!d) return s;
    if (d.type === 'field') {
      s += poly(slab(d.x, d.y, d.w, d.d, 0.6), 'fill="#8ACEA4"');
      s += poly(slab(d.x + 0.28, d.y + 0.28, d.w - 0.56, d.d - 0.56, 0.45), 'fill="none" stroke="rgba(255,255,255,.9)" stroke-width="1.4"');
      s += poly(slab(d.x + 0.5, d.y + 0.5, d.w - 1.0, d.d - 1.0, 0.3), 'fill="#79C79B"');
      var mid = iso(d.x + d.w / 2, d.y + d.d / 2, 0.06);
      s += '<line x1="' + nn(mid[0]) + '" y1="' + nn(mid[1] - 18) + '" x2="' + nn(mid[0]) + '" y2="' + nn(mid[1] + 18) + '" stroke="rgba(255,255,255,.8)" stroke-width="1.2"/>';
      s += '<ellipse cx="' + nn(mid[0]) + '" cy="' + nn(mid[1]) + '" rx="15" ry="8.6" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="1.2"/>';
    }
    if (d.type === 'parking') {
      s += poly(slab(d.x, d.y, d.w, d.d, 0.45), 'fill="#A8BCD9"');
      s += poly(slab(d.x + 0.22, d.y + 0.22, d.w - 0.44, d.d - 0.44, 0.3), 'fill="#BCCBE2"');
      for (var i = 1; i < 4; i++) {
        var x = d.x + 0.28 + (d.w - 0.56) * i / 4;
        s += seg([x, d.y + 0.32, 0.06], [x, d.y + d.d - 0.32, 0.06], 'stroke="rgba(255,255,255,.9)" stroke-width="1.1"');
      }
      s += car(d.x + 0.42, d.y + 0.42, false, '#E8705F');
      s += car(d.x + 1.22, d.y + 1.15, false, '#3F6FD6');
      s += car(d.x + 2.02, d.y + 0.48, false, '#EDC15C');
      s += car(d.x + 2.82, d.y + 1.2, false, '#7AC7A0');
    }
    if (d.type === 'plaza') {
      s += poly(slab(d.x, d.y, d.w, d.d, 0.6), 'fill="#C6D5EC"');
      s += poly(slab(d.x + 0.26, d.y + 0.26, d.w - 0.52, d.d - 0.52, 0.4), 'fill="#D8E4F5"');
      var c = iso(d.x + d.w / 2, d.y + d.d / 2, 0.07);
      s += '<ellipse cx="' + nn(c[0]) + '" cy="' + nn(c[1]) + '" rx="34" ry="19" fill="#AFC9E9" stroke="rgba(255,255,255,.9)" stroke-width="1.4"/>';
      s += '<ellipse cx="' + nn(c[0]) + '" cy="' + nn(c[1]) + '" rx="24" ry="13.5" fill="#8FB9E6"/>';
      s += '<ellipse cx="' + nn(c[0]) + '" cy="' + nn(c[1] - 1) + '" rx="11" ry="6" fill="#6FA8DE"/>';
      s += '<ellipse cx="' + nn(c[0]) + '" cy="' + nn(c[1] - 10) + '" rx="3" ry="9" fill="rgba(200,240,255,.7)"/>';
    }
    if (d.type === 'solar') {
      s += poly(slab(d.x, d.y, d.w, d.d, 0.5), 'fill="#B6C8E0"');
      for (var r2 = 0; r2 < 3; r2++) {
        for (var k = 0; k < 4; k++) {
          var px = d.x + 0.3 + k * (d.w - 0.6) / 4, py = d.y + 0.32 + r2 * (d.d - 0.64) / 3;
          var panel = [[px, py, 0.28], [px + 0.7, py, 0.28], [px + 0.7, py + 0.52, 0.28], [px, py + 0.52, 0.28]];
          s += poly(panel, 'fill="#2C4C86" stroke="#7FA8E0" stroke-width=".8"');
        }
      }
    }
    return s;
  }

  /* ---------------- 标签 ---------------- */
  function textW(s, size) {
    var w = 0;
    for (var i = 0; i < s.length; i++) w += /[\u4e00-\u9fa5]/.test(s[i]) ? size : size * 0.56;
    return w;
  }
  function chip(cx, cy, label) {
    var size = 10.5, w = textW(label, size) + 26, x = cx - w / 2, y = cy - 9.5;
    return '<g>' +
      '<rect x="' + nn(x) + '" y="' + nn(y) + '" width="' + nn(w) + '" height="19" rx="9.5" fill="rgba(5,17,38,.84)" stroke="rgba(120,205,255,.4)" stroke-width=".9"/>' +
      '<circle cx="' + nn(x + 10) + '" cy="' + nn(cy) + '" r="2.2" fill="#5CE6FF"/>' +
      '<text x="' + nn(x + 17) + '" y="' + nn(cy + 3.6) + '" font-size="' + size + '" fill="#CFE9FF">' + label + '</text>' +
      '</g>';
  }
  function chipLead(tx, ty, cx, cy, label) {
    return '<line x1="' + nn(tx) + '" y1="' + nn(ty) + '" x2="' + nn(cx) + '" y2="' + nn(cy) + '" stroke="rgba(125,210,255,.45)" stroke-width="1" stroke-dasharray="2 3"/>' +
      '<circle cx="' + nn(tx) + '" cy="' + nn(ty) + '" r="2.8" fill="none" stroke="rgba(140,220,255,.8)" stroke-width="1"/>' +
      chip(cx, cy, label);
  }

  /* 小标签：AP / UE 编号 */
  function chipSmall(cx, cy, label, tone) {
    var size = 9.5, w = textW(label, size) + 17, x = cx - w / 2, y = cy - 8;
    var dot = tone === 'ue' ? '#5CEBC0' : '#5CE6FF';
    var brd = tone === 'ue' ? 'rgba(110,235,205,.5)' : 'rgba(120,205,255,.55)';
    return '<g>' +
      '<rect x="' + nn(x) + '" y="' + nn(y) + '" width="' + nn(w) + '" height="16.5" rx="8.2" fill="rgba(8,26,58,.86)" stroke="' + brd + '" stroke-width=".9"/>' +
      '<circle cx="' + nn(x + 8.5) + '" cy="' + nn(cy) + '" r="1.9" fill="' + dot + '"/>' +
      '<text x="' + nn(x + 14) + '" y="' + nn(cy + 3.3) + '" font-size="' + size + '" fill="#DCEFFF" letter-spacing=".2">' + label + '</text>' +
      '</g>';
  }

  /* ================= 各场景特色构件 ================= */

  /* 操场跑道 */
  function trackProp(x, y, rx, ry) {
    var c = iso(x, y, 0.05);
    var ex = rx * 1.2247 * U, ey = ry * 0.7071 * U;
    var s = '';
    s += '<ellipse cx="' + nn(c[0]) + '" cy="' + nn(c[1]) + '" rx="' + nn(ex) + '" ry="' + nn(ey) + '" fill="#D98F6E" stroke="rgba(255,255,255,.9)" stroke-width="1.5"/>';
    s += '<ellipse cx="' + nn(c[0]) + '" cy="' + nn(c[1]) + '" rx="' + nn(ex * 0.9) + '" ry="' + nn(ey * 0.9) + '" fill="#E5A182"/>';
    s += '<ellipse cx="' + nn(c[0]) + '" cy="' + nn(c[1]) + '" rx="' + nn(ex * 0.7) + '" ry="' + nn(ey * 0.7) + '" fill="#7FC79B" stroke="rgba(255,255,255,.95)" stroke-width="1.3"/>';
    s += '<line x1="' + nn(c[0] - ex * 0.66) + '" y1="' + nn(c[1]) + '" x2="' + nn(c[0] + ex * 0.66) + '" y2="' + nn(c[1]) + '" stroke="rgba(255,255,255,.8)" stroke-width="1.2"/>';
    s += '<ellipse cx="' + nn(c[0]) + '" cy="' + nn(c[1]) + '" rx="' + nn(ex * 0.17) + '" ry="' + nn(ey * 0.17) + '" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="1.2"/>';
    return s;
  }

  /* 看台 */
  function grandstand(x, y, w, d) {
    var s = '';
    for (var i = 0; i < 3; i++) {
      s += box3(x, y + i * (d / 3), w, d / 3 - 0.04, 0.26 + i * 0.2, i % 2 ? '#D7E2F3' : '#E3EBF7');
    }
    s += box3(x + 0.1, y - 0.1, w + 0.2, 0.12, 0.1, '#C6D5EA', 0.86);
    return s;
  }

  /* 立体停车楼 */
  function garage(x, y, w, d, h) {
    var s = '';
    [0.6, 0.4, 0.2].forEach(function (t) {
      var z = h * t;
      s += box3(x, y, w, d, 0.1, '#E8EFF9', z);
      s += poly(slab(x + 0.1, y + 0.1, w - 0.2, d - 0.2, 0.1), 'fill="rgba(40,70,120,.16)" transform="translate(0,' + nn(-z * U - 1) + ')"');
    });
    [[x + 0.14, y + 0.14], [x + w - 0.26, y + 0.14], [x + 0.14, y + d - 0.26], [x + w - 0.26, y + d - 0.26]].forEach(function (p) {
      s += box3(p[0], p[1], 0.12, 0.12, h, '#C7D6EA');
    });
    s += box3(x, y, w, d, 0.14, '#D5E1F1');
    return s;
  }

  /* 高架桥 */
  function ribbonZ(line, w, z) {
    var L = [], R = [];
    for (var i = 0; i < line.length; i++) {
      var a = line[Math.max(0, i - 1)], b = line[Math.min(line.length - 1, i + 1)];
      var tx = b[0] - a[0], ty = b[1] - a[1], m = Math.hypot(tx, ty) || 1;
      tx /= m; ty /= m;
      L.push([line[i][0] - ty * w / 2, line[i][1] + tx * w / 2, z]);
      R.push([line[i][0] + ty * w / 2, line[i][1] - tx * w / 2, z]);
    }
    return L.concat(R.reverse());
  }

  function viaductSegs(pts, z, w) {
    var line = smooth(pts, 16), out = [], step = 4;
    for (var i = 0; i < line.length - 1; i += step) {
      var seg = line.slice(i, Math.min(i + step + 2, line.length));
      if (seg.length < 2) break;
      var k = 0;
      seg.forEach(function (q) { k = Math.max(k, q[0] + q[1]); });
      var s = '';
      s += poly(ribbonZ(seg, w + 0.3, z - 0.06), 'fill="rgba(40,70,120,.14)"');
      s += poly(ribbonZ(seg, w, z), 'fill="#B7C7DC" stroke="rgba(255,255,255,.9)" stroke-width="1"');
      s += poly(ribbonZ(seg, w - 0.34, z + 0.02), 'fill="#D3DEEC"');
      if (i % (step * 2) === 0) {
        var mid = seg[Math.floor(seg.length / 2)];
        s += box3(mid[0] - 0.2, mid[1] - 0.2, 0.4, 0.4, z - 0.1, '#AFC0D8');
      }
      out.push({ k: k + 1.6, s: s });
    }
    return out;
  }

  /* 站台雨棚 */
  function canopy(x, y, w, d, z) {
    var s = '';
    [[x + 0.22, y + 0.22], [x + w - 0.34, y + 0.22], [x + 0.22, y + d - 0.34], [x + w - 0.34, y + d - 0.34]].forEach(function (p) {
      s += box3(p[0], p[1], 0.12, 0.12, z, '#CBD9EC');
    });
    s += box3(x - 0.1, y - 0.1, w + 0.2, d + 0.2, 0.1, '#E4EDF9', z);
    s += box3(x + 0.05, y + 0.05, w - 0.1, d - 0.1, 0.07, '#F7FBFF', z + 0.1);
    return s;
  }

  /* 水景 */
  function pond(x, y, rx, ry) {
    var c = iso(x, y, 0.03);
    var ex = rx * 1.2247 * U, ey = ry * 0.7071 * U;
    return '<ellipse cx="' + nn(c[0]) + '" cy="' + nn(c[1]) + '" rx="' + nn(ex + 5) + '" ry="' + nn(ey + 3) + '" fill="#DCE9F8"/>' +
      '<ellipse cx="' + nn(c[0]) + '" cy="' + nn(c[1]) + '" rx="' + nn(ex) + '" ry="' + nn(ey) + '" fill="#A9D6F2" stroke="#8CC2E6" stroke-width="1"/>' +
      '<ellipse cx="' + nn(c[0] - ex * 0.2) + '" cy="' + nn(c[1] - ey * 0.2) + '" rx="' + nn(ex * 0.45) + '" ry="' + nn(ey * 0.45) + '" fill="rgba(255,255,255,.35)"/>';
  }

  /* ================= 场景数据 ================= */
  var B = function (x, y, w, d, h, c, type, extra) {
    var o = { x: x, y: y, w: w, d: d, h: h, c: c, type: type || 'office' };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  };

  var SCENES = {
    /* ================= 智慧校园：十字路网 · 教学区 / 宿舍区 / 操场 ================= */
    campus: {
      caption: '校园场景 · 教学楼 / 图书馆 / 操场 / 宿舍',
      road: '#B7C9E4',
      roads: [
        { w: 2.2, pts: [[-1.5, 12.8], [6, 12.6], [12, 12.4], [19.5, 12.2]] },
        { w: 1.8, pts: [[9.6, -1.5], [9.4, 5], [9.2, 11.5], [9.0, 19.5]] }
      ],
      deco: null,
      buildings: [
        B(1.2, 1.4, 5.4, 2.4, 3.4, '#F3E9D8', 'office', { win: '#9BC2EF' }),
        B(7.2, 1.2, 1.8, 2.2, 2.8, '#FFFFFF', 'office', { win: '#9BC2EF' }),
        B(1.4, 4.8, 3.2, 2.4, 3.6, '#D9E7FA', 'glass'),
        B(5.2, 5.0, 2.2, 2.2, 2.2, '#F3E9D8', 'gable', { win: '#9BC2EF', roofC: '#C0665A' }),
        B(10.4, 1.2, 1.6, 3.0, 3.6, '#F6EFE4', 'office', { win: '#9BC2EF' }),
        B(12.3, 1.2, 1.6, 3.0, 3.6, '#F6EFE4', 'office', { win: '#9BC2EF' }),
        B(14.2, 1.2, 1.6, 3.0, 3.6, '#F6EFE4', 'office', { win: '#9BC2EF' }),
        B(10.4, 5.2, 3.2, 2.2, 2.4, '#F3DCC0', 'office', { win: '#C98A5E' }),
        B(1.4, 14.4, 3.6, 2.4, 2.8, '#E9EFF8', 'warehouse'),
        B(6.2, 14.6, 3.0, 2.2, 2.6, '#F3E9D8', 'gable', { win: '#9BC2EF', roofC: '#C0665A' }),
        B(10.4, 14.4, 2.6, 2.0, 2.0, '#FFFFFF', 'office', { win: '#9BC2EF' }),
        B(14.0, 14.4, 2.2, 2.0, 2.2, '#E9EEF7', 'office', { win: '#9BC2EF' })
      ],
      props: [
        { t: 'track', x: 3.0, y: 9.6, rx: 2.4, ry: 1.3 },
        { t: 'grandstand', x: 5.4, y: 9.2, w: 0.9, d: 2.2 },
        { t: 'billboard', x: 7.0, y: 10.4 },
        { t: 'busStop', x: 4.0, y: 11.6 },
        { t: 'hedge', x: 6.6, y: 8.4, w: 2.2, d: 0.4 },
        { t: 'plaza', x: 9.8, y: 8.8, w: 2.0, d: 2.0 }
      ],
      vehicles: [
        { t: 'bus', x: 2.4, y: 13.4, a: true, c: '#E9A93C' },
        { t: 'car', x: 7.0, y: 12.8, a: true, c: '#4C7BD9' },
        { t: 'car', x: 11.0, y: 12.5, a: true, c: '#E05B4C' },
        { t: 'truck', x: 9.6, y: 7.2, a: false, c: '#3E7FB8' }
      ],
      people: [[2.6, 11.2, '#3F6FD6'], [4.9, 11.4, '#E08A5A'], [6.4, 11.2, '#5AAE8C'], [8.6, 11.0, '#C2574C']],
      trees: [[0.6, 7.6, 1], [2.0, 7.4, .9], [8.2, 9.6, .85], [11.0, 8.8, .9], [13.4, 9.4, .85],
              [1.0, 12.4, .8], [16.8, 8.6, .85], [4.6, 17.0, .8], [9.2, 16.8, .85], [15.8, 12.6, .8]],
      conifers: [[8.4, 4.2, 1], [16.2, 12.8, .85]],
      towers: [[6.8, 11.2, 5.0, 0], [11.4, 8.6, 4.6, 0], [16.4, 9.2, 4.2, 0]],
      ues: [[6.4, 10.9], [11.2, 4.4], [15.6, 7.6]]
    },

    /* ================= 智慧商场：购物中心 / 酒店 / 停车楼 / 广场 ================= */
    mall: {
      caption: '商场场景 · 购物中心 / 酒店 / 停车楼 / 广场',
      road: '#AFC3E2',
      roads: [
        { w: 2.4, pts: [[-1.5, 13.4], [5, 13.0], [11, 12.2], [19.5, 11.2]] },
        { w: 2.0, pts: [[13.0, -1.5], [12.4, 5], [11.6, 11.8], [10.6, 19.5]] }
      ],
      deco: { type: 'parking', x: 1.2, y: 15.0, w: 4.6, d: 2.4 },
      buildings: [
        B(1.2, 1.2, 5.4, 3.4, 3.2, '#FFFFFF', 'mall'),
        B(6.9, 1.2, 2.2, 2.4, 2.8, '#3C6FD8', 'glass'),
        B(9.5, 1.2, 2.0, 2.4, 6.2, '#CFE1FA', 'glass'),
        B(1.4, 5.2, 2.6, 2.6, 3.4, '#F3D8B8', 'office', { win: '#C98A5E', podium: true }),
        B(4.6, 5.0, 2.6, 2.2, 2.2, '#F7F2E9', 'gable', { win: '#9BC2EF', roofC: '#8A6B5E' }),
        B(13.4, 1.0, 2.6, 2.4, 6.4, '#DCE8F8', 'glass'),
        B(13.2, 4.6, 3.4, 2.4, 3.4, '#FFFFFF', 'mall'),
        B(9.8, 5.2, 1.8, 2.0, 2.6, '#F7F2E9', 'office', { win: '#9BC2EF' }),
        B(13.2, 12.8, 3.4, 2.2, 2.2, '#E9EEF7', 'warehouse'),
        B(1.4, 12.0, 2.8, 1.6, 1.8, '#FFFFFF', 'office', { win: '#9BC2EF' })
      ],
      props: [
        { t: 'garage', x: 1.4, y: 8.6, w: 2.4, d: 2.0, h: 3.0 },
        { t: 'plaza', x: 4.6, y: 8.4, w: 2.2, d: 2.2 },
        { t: 'billboard', x: 9.6, y: 9.0 },
        { t: 'busStop', x: 3.2, y: 11.8 },
        { t: 'containers', x: 13.4, y: 16.0 },
        { t: 'forklift', x: 16.4, y: 15.4 },
        { t: 'crates', x: 16.0, y: 12.4 }
      ],
      vehicles: [
        { t: 'car', x: 2.6, y: 13.6, a: true, c: '#E8705F' },
        { t: 'car', x: 6.4, y: 12.9, a: true, c: '#3F6FD6' },
        { t: 'car', x: 9.8, y: 12.3, a: true, c: '#EDC15C' },
        { t: 'car', x: 12.6, y: 4.4, a: false, c: '#E05B4C' },
        { t: 'truck', x: 12.1, y: 8.4, a: false, c: '#7AC7A0' }
      ],
      people: [[3.0, 11.6, '#C2574C'], [5.2, 11.4, '#3F6FD6'], [8.2, 11.0, '#E0A05A'], [11.4, 10.4, '#5AAE8C']],
      trees: [[0.6, 7.4, 1], [4.0, 7.4, .9], [7.2, 8.6, .9], [10.4, 8.2, .85], [12.4, 9.8, .85],
              [1.0, 12.8, .8], [16.6, 8.8, .9], [9.6, 15.0, .85], [5.6, 15.2, .8]],
      conifers: [[11.2, 9.6, 1]],
      towers: [[6.6, 9.4, 5.0, 0], [11.2, 8.0, 4.6, 0], [16.2, 8.6, 4.2, 0]],
      ues: [[2.6, 10.6], [8.4, 10.4], [13.6, 9.4]]
    },

    /* ================= 智慧交通：枢纽站 / 站台雨棚 / 高架 / 公交场 ================= */
    traffic: {
      caption: '交通场景 · 枢纽站 / 高架 / 换乘广场 / 公交场',
      road: '#A7BCDD',
      roads: [
        { w: 2.5, pts: [[-1.6, 14.2], [4.6, 13.2], [9.8, 12.2], [19.6, 10.6]] },
        { w: 2.1, pts: [[12.6, -1.6], [12.0, 5.2], [11.4, 11.9], [10.4, 19.6]] }
      ],
      deco: { type: 'plaza', x: 1.2, y: 15.2, w: 4.4, d: 2.2 },
      buildings: [
        B(1.4, 1.2, 4.6, 2.8, 2.2, '#E4EDF9', 'glass'),
        B(1.4, 7.2, 2.4, 2.0, 1.8, '#EFF4FC', 'office', { win: '#9BC2EF' }),
        B(7.0, 1.2, 2.0, 2.2, 3.6, '#FFFFFF', 'office', { win: '#9BC2EF', podium: true }),
        B(9.6, 1.2, 1.6, 2.2, 2.6, '#D2E3F8', 'office', { win: '#7FB2E8' }),
        B(13.4, 1.2, 2.4, 2.4, 5.4, '#C2D8F2', 'glass'),
        B(13.2, 4.6, 3.4, 2.2, 2.6, '#DCE8F8', 'mall'),
        B(13.2, 12.8, 3.6, 2.2, 2.6, '#E4EBF6', 'warehouse'),
        B(1.4, 12.2, 2.8, 1.8, 1.8, '#FFFFFF', 'office', { win: '#9BC2EF' }),
        B(6.6, 14.6, 2.6, 2.0, 2.0, '#F2EADF', 'office', { win: '#9BC2EF' })
      ],
      props: [
        { t: 'canopy', x: 1.6, y: 4.6, w: 4.4, d: 1.9, z: 2.0 },
        { t: 'viaduct', pts: [[0.2, 9.6], [4.4, 9.1], [8.6, 8.4], [11.4, 7.9]], z: 1.5, w: 1.25 },
        { t: 'plaza', x: 6.0, y: 8.6, w: 2.2, d: 2.0 },
        { t: 'billboard', x: 9.8, y: 9.6 },
        { t: 'containers', x: 13.4, y: 16.0 },
        { t: 'containers', x: 15.6, y: 16.2 },
        { t: 'forklift', x: 14.8, y: 15.0 },
        { t: 'busStop', x: 5.2, y: 10.6 }
      ],
      vehicles: [
        { t: 'bus', x: 2.2, y: 13.8, a: true, c: '#E9A93C' },
        { t: 'bus', x: 8.6, y: 12.4, a: true, c: '#3F6FD6' },
        { t: 'car', x: 11.4, y: 11.8, a: true, c: '#E05B4C' },
        { t: 'truck', x: 12.0, y: 4.2, a: false, c: '#D2603F' },
        { t: 'car', x: 11.75, y: 8.8, a: false, c: '#4C7BD9' },
        { t: 'bus', x: 3.0, y: 6.0, a: true, c: '#5FA8E0' }
      ],
      people: [[3.4, 11.2, '#3F6FD6'], [5.6, 11.2, '#C2574C'], [7.8, 10.8, '#5AAE8C'], [9.4, 10.4, '#E0A05A']],
      trees: [[0.6, 7.2, 1], [6.2, 11.4, .85], [9.0, 10.2, .9], [12.4, 10.2, .85], [1.0, 12.2, .8],
              [16.6, 8.4, .85], [4.4, 16.6, .8], [9.4, 14.4, .85]],
      conifers: [[8.4, 10.8, 1], [15.8, 10.4, .85]],
      towers: [[5.2, 10.4, 5.2, 0], [10.2, 9.2, 4.6, 0], [15.8, 9.4, 4.2, 0]],
      ues: [[2.8, 10.9], [7.8, 10.6], [13.2, 9.8]]
    },

    /* ================= 智慧园区：研发塔 / 数据中心 / 水景 / 光伏 ================= */
    park: {
      caption: '园区场景 · 研发楼 / 数据中心 / 水景 / 光伏',
      road: '#B7C9E5',
      roads: [
        { w: 2.2, pts: [[-1.5, 11.8], [5, 10.8], [10.5, 9.8], [19.5, 8.4]] },
        { w: 1.6, pts: [[13.8, -1.5], [13.4, 4], [12.6, 9.0], [11.4, 19.5]] }
      ],
      deco: { type: 'solar', x: 1.2, y: 15.0, w: 4.6, d: 2.2 },
      buildings: [
        B(1.2, 1.2, 3.2, 2.6, 5.8, '#C6DBF6', 'glass'),
        B(5.2, 1.2, 2.8, 2.4, 4.6, '#DCE9FA', 'glass'),
        B(8.6, 1.2, 2.0, 2.2, 3.4, '#E9F1FB', 'glass'),
        B(1.4, 5.0, 3.0, 2.0, 2.8, '#FFFFFF', 'office', { win: '#9BC2EF', tank: true }),
        B(5.2, 4.8, 2.4, 2.0, 2.4, '#E9EFF8', 'warehouse'),
        B(13.4, 1.0, 2.6, 2.6, 6.8, '#D9E8FA', 'glass'),
        B(13.2, 4.8, 3.4, 2.2, 2.6, '#FFFFFF', 'mall'),
        B(13.2, 12.8, 3.6, 2.4, 2.8, '#E9EEF7', 'warehouse'),
        B(1.4, 12.0, 2.8, 1.8, 2.0, '#F4EEE3', 'office', { win: '#9BC2EF' }),
        B(6.4, 14.4, 2.6, 2.0, 2.2, '#FFFFFF', 'office', { win: '#9BC2EF' })
      ],
      props: [
        { t: 'pond', x: 8.4, y: 5.6, rx: 1.5, ry: 1.0 },
        { t: 'billboard', x: 9.8, y: 9.4 },
        { t: 'busStop', x: 4.0, y: 11.8 },
        { t: 'hedge', x: 6.6, y: 9.8, w: 2.4, d: 0.4 },
        { t: 'containers', x: 13.4, y: 16.0 },
        { t: 'forklift', x: 16.4, y: 15.2 }
      ],
      vehicles: [
        { t: 'truck', x: 2.6, y: 13.6, a: true, c: '#3E7FB8' },
        { t: 'car', x: 7.2, y: 12.8, a: true, c: '#E8705F' },
        { t: 'car', x: 10.6, y: 12.4, a: true, c: '#4C7BD9' },
        { t: 'truck', x: 12.2, y: 4.4, a: false, c: '#7AC7A0' },
        { t: 'car', x: 12.0, y: 8.6, a: false, c: '#EDC15C' }
      ],
      people: [[3.2, 11.4, '#3F6FD6'], [5.6, 11.2, '#E08A5A'], [8.0, 10.8, '#5AAE8C'], [11.4, 10.2, '#C2574C']],
      trees: [[0.6, 7.2, 1], [6.2, 8.2, .9], [9.4, 7.4, .9], [10.8, 10.6, .85], [12.4, 9.8, .8],
              [1.0, 12.4, .8], [16.6, 8.4, .85], [4.6, 16.8, .8], [9.6, 14.2, .85]],
      conifers: [[7.4, 7.6, 1], [11.8, 9.0, .9]],
      towers: [[6.4, 9.6, 5.0, 0], [11.0, 8.2, 4.6, 0], [16.0, 9.0, 4.2, 0]],
      ues: [[2.6, 10.8], [8.6, 10.2], [13.8, 9.4]]
    }
  };

  /* ---------------- 组装 ---------------- */
  function defsSvg() {
    return '<defs>' +
      '<linearGradient id="plateG" x1="0" y1="0" x2="0.5" y2="1">' +
      '<stop offset="0" stop-color="#FFFFFF"/><stop offset="0.55" stop-color="#F3F8FF"/><stop offset="1" stop-color="#E0EDFF"/>' +
      '</linearGradient>' +
      '<radialGradient id="auraG">' +
      '<stop offset="0" stop-color="#FFFFFF" stop-opacity="0.92"/>' +
      '<stop offset="0.55" stop-color="#FFFFFF" stop-opacity="0.45"/>' +
      '<stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>' +
      '</radialGradient>' +
      '<linearGradient id="antG" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#A6ECFF"/><stop offset="1" stop-color="#3E8BFF"/>' +
      '</linearGradient>' +
      '<radialGradient id="towerGlow">' +
      '<stop offset="0" stop-color="#7FE6FF" stop-opacity="0.5"/>' +
      '<stop offset="0.55" stop-color="#4FA8FF" stop-opacity="0.16"/>' +
      '<stop offset="1" stop-color="#4FA8FF" stop-opacity="0"/>' +
      '</radialGradient>' +
      '<linearGradient id="linkG" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#B4F6FF" stop-opacity="0.95"/>' +
      '<stop offset="1" stop-color="#3E8BFF" stop-opacity="0.45"/>' +
      '</linearGradient>' +
      '<filter id="blur26" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="22"/></filter>' +
      '<filter id="blur6" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="4.5"/></filter>' +
      '</defs>';
  }

  function linksSvg(sc) {
    var s = '', i;
    var tps = sc.towers.map(function (t) { return [t[0], t[1], t[2] || 5, t[3] || 0]; });

    // —— AP 之间的回传链路 ——
    for (i = 0; i < tps.length - 1; i++) {
      var a0 = iso(tps[i][0], tps[i][1], tps[i][3] + tps[i][2] - 0.5);
      var b0 = iso(tps[i + 1][0], tps[i + 1][1], tps[i + 1][3] + tps[i + 1][2] - 0.5);
      var c0x = (a0[0] + b0[0]) / 2, c0y = Math.min(a0[1], b0[1]) - 60;
      var d0 = 'M' + nn(a0[0]) + ' ' + nn(a0[1]) + 'Q' + nn(c0x) + ' ' + nn(c0y) + ' ' + nn(b0[0]) + ' ' + nn(b0[1]);
      s += '<path d="' + d0 + '" fill="none" stroke="rgba(200,240,255,.28)" stroke-width="4" stroke-linecap="round"/>';
      s += '<path class="lnk bh" d="' + d0 + '" fill="none" stroke="rgba(232,248,255,.9)" stroke-width="1.4" ' +
        'stroke-dasharray="2 7" stroke-linecap="round" style="animation-delay:' + (i * 0.3).toFixed(2) + 's"/>';
    }

    // —— 3 个 UE 接入最近的 AP ——
    sc.ues.forEach(function (u, idx) {
      var best = tps[0], bd = 1e9;
      tps.forEach(function (t) {
        var dd = Math.hypot(t[0] - u[0], t[1] - u[1]);
        if (dd < bd) { bd = dd; best = t; }
      });
      var a = iso(best[0], best[1], (best[3] || 0) + best[2] - 0.55), b = iso(u[0], u[1], 0.12);
      var cx = (a[0] + b[0]) / 2 + (idx % 2 ? 14 : -14);
      var cy = Math.min(a[1], b[1]) - 34;
      var d = 'M' + nn(a[0]) + ' ' + nn(a[1]) + 'Q' + nn(cx) + ' ' + nn(cy) + ' ' + nn(b[0]) + ' ' + nn(b[1]);
      s += '<path d="' + d + '" fill="none" stroke="rgba(110,225,255,.3)" stroke-width="5.5" stroke-linecap="round"/>';
      s += '<path class="lnk" d="' + d + '" fill="none" stroke="url(#linkG)" stroke-width="2.1" ' +
        'stroke-dasharray="5 6" stroke-linecap="round" style="animation-delay:' + (idx * 0.22).toFixed(2) + 's"/>';
      s += '<path id="lp' + idx + '" d="' + d + '" fill="none"/>';
      s += '<circle r="2.9" fill="#BFF7FF">' +
        '<animateMotion dur="' + (2.2 + idx * 0.5).toFixed(1) + 's" begin="' + (idx * 0.55).toFixed(2) + 's" repeatCount="indefinite">' +
        '<mpath href="#lp' + idx + '" xlink:href="#lp' + idx + '"/></animateMotion></circle>';
    });
    return s;
  }

  function propsSvg(sc) {
    var s = '';
    (sc.props || []).forEach(function (p) {
      if (p.t === 'plaza') s += decoSvg(p);
      else if (p.t === 'containers') s += containers(p.x, p.y, 2);
      else if (p.t === 'crates') s += crates(p.x, p.y);
      else if (p.t === 'forklift') s += forklift(p.x, p.y, '#E8B23C');
      else if (p.t === 'billboard') s += billboard(p.x, p.y);
      else if (p.t === 'busStop') s += busStop(p.x, p.y);
      else if (p.t === 'hedge') s += hedge(p.x, p.y, p.w, p.d);
    });
    return s;
  }

  function vehiclesSvg(sc) {
    var s = '';
    (sc.vehicles || []).forEach(function (v) {
      if (v.t === 'truck') s += truck(v.x, v.y, v.a, v.c);
      else if (v.t === 'bus') s += bus(v.x, v.y, v.a, v.c);
      else if (v.t === 'car') s += car(v.x, v.y, v.a, v.c);
      else if (v.t === 'forklift') s += forklift(v.x, v.y, v.c);
    });
    return s;
  }

  function chipsSvg(sc) {
    var s = '';
    sc.towers.forEach(function (t, i) {
      var p = iso(t[0], t[1], (t[3] || 0) + t[2] + 0.1);
      s += chipSmall(p[0] + (i % 2 ? 44 : -44), p[1] - 14, 'AP-0' + (i + 1), 'ap');
    });
    sc.ues.forEach(function (u, i) {
      var q = iso(u[0], u[1], 0.55);
      s += chipSmall(q[0] + (i % 2 ? 38 : -38), q[1] - 16, 'UE-0' + (i + 1), 'ue');
    });
    return s;
  }

  var PROP_FLAT = { track: 1, pond: 1, plaza: 1, hedge: 1 };

  function buildProp(p) {
    if (p.t === 'containers') return containers(p.x, p.y, 2);
    if (p.t === 'crates') return crates(p.x, p.y);
    if (p.t === 'forklift') return forklift(p.x, p.y, '#E8B23C');
    if (p.t === 'billboard') return billboard(p.x, p.y);
    if (p.t === 'busStop') return busStop(p.x, p.y);
    if (p.t === 'canopy') return canopy(p.x, p.y, p.w, p.d, p.z);
    if (p.t === 'garage') return garage(p.x, p.y, p.w, p.d, p.h);
    if (p.t === 'grandstand') return grandstand(p.x, p.y, p.w, p.d);
    if (p.t === 'viaduct') return viaduct(p.pts, p.z, p.w);
    if (p.t === 'track') return trackProp(p.x, p.y, p.rx, p.ry);
    if (p.t === 'pond') return pond(p.x, p.y, p.rx, p.ry);
    if (p.t === 'hedge') return hedge(p.x, p.y, p.w, p.d);
    if (p.t === 'plaza') return decoSvg(p);
    return '';
  }

  function buildScene(key) {
    var sc = SCENES[key] || SCENES.campus;
    var sprites = [];
    var flat = '';

    sc.buildings.forEach(function (b) {
      sprites.push({ k: b.x + b.w + b.y + b.d, s: building(b) });
    });
    (sc.trees || []).forEach(function (t) {
      sprites.push({ k: t[0] + t[1], s: tree(t[0], t[1], t[2]) });
    });
    (sc.conifers || []).forEach(function (t) {
      sprites.push({ k: t[0] + t[1], s: conifer(t[0], t[1], t[2]) });
    });
    sc.towers.forEach(function (t) {
      sprites.push({ k: t[0] + t[1], s: tower(t[0], t[1], t[2], t[3]) });
    });
    sc.ues.forEach(function (u) {
      sprites.push({ k: u[0] + u[1] + 0.05, s: ueNode(u[0], u[1]) });
    });
    (sc.people || []).forEach(function (p) {
      sprites.push({ k: p[0] + p[1] + 0.03, s: person(p[0], p[1], p[2]) });
    });
    (sc.vehicles || []).forEach(function (v) {
      var g = '';
      if (v.t === 'truck') g = truck(v.x, v.y, v.a, v.c);
      else if (v.t === 'bus') g = bus(v.x, v.y, v.a, v.c);
      else if (v.t === 'car') g = car(v.x, v.y, v.a, v.c);
      else if (v.t === 'forklift') g = forklift(v.x, v.y, v.c);
      sprites.push({ k: v.x + v.y + (v.a ? 1.0 : 0.2), s: g });
    });
    (sc.props || []).forEach(function (p) {
      if (PROP_FLAT[p.t]) { flat += buildProp(p); return; }
      if (p.t === 'viaduct') {
        viaductSegs(p.pts, p.z, p.w).forEach(function (sg) { sprites.push(sg); });
        return;
      }
      sprites.push({ k: p.x + p.y + (p.d || 0.4), s: buildProp(p) });
    });
    [[3.2, 12.6], [9.0, 11.6], [12.2, 6.2], [5.8, 13.4]].forEach(function (l) {
      sprites.push({ k: l[0] + l[1], s: lamp(l[0], l[1]) });
    });

    sprites.sort(function (a, b) { return a.k - b.k; });

    var kmin = sprites[0].k, kmax = sprites[sprites.length - 1].k;
    var body = sprites.map(function (x) {
      var d = 0.15 + ((x.k - kmin) / (kmax - kmin)) * 2.1;
      return '<g class="spr" style="--sd:' + d.toFixed(2) + 's">' + x.s + '</g>';
    }).join('');

    return defsSvg() +
      '<g class="scene-base">' + plateSvg() + gridSvg() + roadsSvg(sc) + decoSvg(sc.deco) + roadFlow(sc) +
        sc.buildings.map(shadow).join('') + flat + '</g>' +
      body +
      '<g class="spr" style="--sd:2.3s">' + linksSvg(sc) + '</g>' +
      '<g class="spr" style="--sd:2.5s">' + chipsSvg(sc) + '</g>';
  }

  var SCENE_META = {};
  Object.keys(SCENES).forEach(function (k) { SCENE_META[k] = { caption: SCENES[k].caption }; });

  function renderScene(key) { return buildScene(key); }

  export { SCENE_META, renderScene };
