/* ════════════════════════════════════════════════════════════
   qr.js — QR 코드 생성기 (바이트 모드, 오류정정 M/L, 버전 1~10)

   CDN 을 쓰지 않는다. 학교 망이 외부 호스트를 막는 일이 흔한데,
   하필 그때가 QR 이 제일 필요한 순간이다. vendor/katex 와 같은 방식으로
   저장소 안에 둔다.

   window.JPQR.matrix(text, {ec:'M'|'L'}) -> [[0|1, ...], ...]
   window.JPQR.svg(text, {size, margin, dark, light, ec}) -> SVG 문자열
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 갈루아 체 GF(256), 원시다항식 0x11d ── */
  const EXP = new Uint8Array(512), LOG = new Uint8Array(256);
  (function initGF() {
    let x = 1;
    for (let i = 0; i < 255; i += 1) {
      EXP[i] = x; LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11d;
    }
    for (let i = 255; i < 512; i += 1) EXP[i] = EXP[i - 255];
  }());
  const gmul = (a, b) => (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]];

  /* 생성다항식 g(x) = (x-a^0)(x-a^1)...(x-a^(n-1)) */
  function genPoly(n) {
    let g = [1];
    for (let i = 0; i < n; i += 1) {
      const next = new Array(g.length + 1).fill(0);
      for (let j = 0; j < g.length; j += 1) {
        next[j] ^= g[j];                      // g(x) * x   — 차수가 하나 올라간다
        next[j + 1] ^= gmul(g[j], EXP[i]);    // g(x) * a^i
      }
      g = next;
    }
    return g;
  }

  /* 데이터 코드워드에 대한 오류정정 코드워드 */
  function ecc(data, n) {
    const g = genPoly(n);
    const res = new Array(data.length + n).fill(0);
    for (let i = 0; i < data.length; i += 1) res[i] = data[i];
    for (let i = 0; i < data.length; i += 1) {
      const c = res[i];
      if (!c) continue;
      for (let j = 0; j < g.length; j += 1) res[i + j] ^= gmul(g[j], c);
    }
    return res.slice(data.length);
  }

  /* ── 버전별 표 (오류정정 M 과 L) ──
     [총 코드워드, 블록당 EC 코드워드, [그룹1 블록수, 그룹1 데이터cw], [그룹2...]] */
  const SPEC = {
    M: {
      1: [26, 10, [1, 16]], 2: [44, 16, [1, 28]], 3: [70, 26, [1, 44]],
      4: [100, 18, [2, 32]], 5: [134, 24, [2, 43]], 6: [172, 16, [4, 27]],
      7: [196, 18, [4, 31]], 8: [242, 22, [2, 38], [2, 39]],
      9: [292, 22, [3, 36], [2, 37]], 10: [346, 26, [4, 43], [1, 44]]
    },
    L: {
      1: [26, 7, [1, 19]], 2: [44, 10, [1, 34]], 3: [70, 15, [1, 55]],
      4: [100, 20, [1, 80]], 5: [134, 26, [1, 108]], 6: [172, 18, [2, 68]],
      7: [196, 20, [2, 78]], 8: [242, 24, [2, 97]], 9: [292, 30, [2, 116]],
      10: [346, 18, [2, 68], [2, 69]]
    }
  };
  const EC_BITS = { L: 1, M: 0 };                 // 형식정보용 2비트
  const ALIGN = {
    1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30],
    6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50]
  };
  const VERSION_INFO = { 7: 0x07C94, 8: 0x085BC, 9: 0x09A99, 10: 0x0A4D3 };

  function dataCodewords(ver, ec) {
    const s = SPEC[ec][ver];
    let n = 0;
    for (let i = 2; i < s.length; i += 1) n += s[i][0] * s[i][1];
    return n;
  }
  function capacityBytes(ver, ec) {
    const header = 4 + (ver >= 10 ? 16 : 8);       // 모드 4비트 + 문자수
    return dataCodewords(ver, ec) - Math.ceil(header / 8);
  }

  /* ── 비트 버퍼 ── */
  function Bits() { this.b = []; }
  Bits.prototype.put = function (val, len) {
    for (let i = len - 1; i >= 0; i -= 1) this.b.push((val >>> i) & 1);
  };

  /* ── 데이터 코드워드 만들기 ── */
  function encodeData(bytes, ver, ec) {
    const total = dataCodewords(ver, ec);
    const bits = new Bits();
    bits.put(4, 4);                                  // 바이트 모드
    bits.put(bytes.length, ver >= 10 ? 16 : 8);
    bytes.forEach(v => bits.put(v, 8));
    const cap = total * 8;
    for (let i = 0; i < 4 && bits.b.length < cap; i += 1) bits.b.push(0);   // 종단자
    while (bits.b.length % 8) bits.b.push(0);
    const cw = [];
    for (let i = 0; i < bits.b.length; i += 8) {
      let v = 0;
      for (let j = 0; j < 8; j += 1) v = (v << 1) | bits.b[i + j];
      cw.push(v);
    }
    const PAD = [0xEC, 0x11];
    for (let i = 0; cw.length < total; i += 1) cw.push(PAD[i % 2]);
    return cw;
  }

  /* 블록으로 나누고 규격대로 뒤섞는다 */
  function interleave(cw, ver, ec) {
    const s = SPEC[ec][ver], ecLen = s[1];
    const groups = [];
    let p = 0;
    for (let i = 2; i < s.length; i += 1) {
      const [cnt, len] = s[i];
      for (let k = 0; k < cnt; k += 1) { groups.push(cw.slice(p, p + len)); p += len; }
    }
    const eccs = groups.map(g => ecc(g, ecLen));
    const out = [];
    const maxData = Math.max(...groups.map(g => g.length));
    for (let i = 0; i < maxData; i += 1) groups.forEach(g => { if (i < g.length) out.push(g[i]); });
    for (let i = 0; i < ecLen; i += 1) eccs.forEach(e => out.push(e[i]));
    return out;
  }

  /* ── 매트릭스 ── */
  function newMatrix(size) {
    const m = [], r = [];
    for (let i = 0; i < size; i += 1) { m.push(new Int8Array(size).fill(-1)); r.push(new Uint8Array(size)); }
    return { m, reserved: r, size };
  }
  function setFn(M, x, y, v) { if (x < 0 || y < 0 || x >= M.size || y >= M.size) return; M.m[y][x] = v; M.reserved[y][x] = 1; }

  function placePatterns(M, ver) {
    const size = M.size;
    // 위치 찾기 무늬 + 분리자
    [[0, 0], [size - 7, 0], [0, size - 7]].forEach(([ox, oy]) => {
      for (let y = -1; y <= 7; y += 1) for (let x = -1; x <= 7; x += 1) {
        const inRing = (x >= 0 && x <= 6 && (y === 0 || y === 6)) || (y >= 0 && y <= 6 && (x === 0 || x === 6));
        const inCore = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        setFn(M, ox + x, oy + y, (inRing || inCore) ? 1 : 0);
      }
    });
    // 타이밍 무늬
    for (let i = 8; i < size - 8; i += 1) { setFn(M, i, 6, i % 2 === 0 ? 1 : 0); setFn(M, 6, i, i % 2 === 0 ? 1 : 0); }
    // 정렬 무늬
    const cs = ALIGN[ver];
    cs.forEach(cy => cs.forEach(cx => {
      const nearFinder = (cx <= 8 && cy <= 8) || (cx >= size - 9 && cy <= 8) || (cx <= 8 && cy >= size - 9);
      if (nearFinder) return;
      for (let y = -2; y <= 2; y += 1) for (let x = -2; x <= 2; x += 1) {
        const on = Math.max(Math.abs(x), Math.abs(y)) !== 1;
        setFn(M, cx + x, cy + y, on ? 1 : 0);
      }
    }));
    // 항상 검은 모듈
    setFn(M, 8, size - 8, 1);
    // 형식정보 자리 예약
    for (let i = 0; i <= 8; i += 1) { if (i !== 6) { M.reserved[8][i] = 1; M.reserved[i][8] = 1; } }
    for (let i = 0; i < 8; i += 1) { M.reserved[8][size - 1 - i] = 1; M.reserved[size - 1 - i][8] = 1; }
    // 버전정보 자리 (7 이상)
    if (ver >= 7) {
      for (let i = 0; i < 6; i += 1) for (let j = 0; j < 3; j += 1) {
        M.reserved[size - 11 + j][i] = 1; M.reserved[i][size - 11 + j] = 1;
      }
    }
  }

  function placeVersion(M, ver) {
    if (ver < 7) return;
    const bits = VERSION_INFO[ver], size = M.size;
    for (let i = 0; i < 18; i += 1) {
      const b = (bits >> i) & 1, a = Math.floor(i / 3), c = i % 3;
      M.m[size - 11 + c][a] = b;
      M.m[a][size - 11 + c] = b;
    }
  }

  function placeData(M, cw) {
    const size = M.size;
    let bit = 0, dir = -1, row = size - 1;
    const total = cw.length * 8;
    for (let col = size - 1; col > 0; col -= 2) {
      if (col === 6) col -= 1;                       // 세로 타이밍 열은 건너뛴다
      for (;;) {
        for (let c = 0; c < 2; c += 1) {
          const x = col - c;
          if (!M.reserved[row][x]) {
            let v = 0;
            if (bit < total) v = (cw[bit >> 3] >> (7 - (bit & 7))) & 1;
            M.m[row][x] = v;
            bit += 1;
          }
        }
        row += dir;
        if (row < 0 || row >= size) { row -= dir; dir = -dir; break; }
      }
    }
  }

  const MASKS = [
    (r, c) => (r + c) % 2 === 0,
    (r) => r % 2 === 0,
    (r, c) => c % 3 === 0,
    (r, c) => (r + c) % 3 === 0,
    (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
    (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
    (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
    (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0
  ];

  function applyMask(M, maskIdx) {
    const out = M.m.map(r => Array.from(r));
    for (let y = 0; y < M.size; y += 1) for (let x = 0; x < M.size; x += 1) {
      if (!M.reserved[y][x] && MASKS[maskIdx](y, x)) out[y][x] ^= 1;
    }
    return out;
  }

  /* 형식정보 15비트 (BCH(15,5) + 0x5412 마스크) */
  function formatBits(ec, mask) {
    const data = (EC_BITS[ec] << 3) | mask;
    let v = data << 10;
    for (let i = 4; i >= 0; i -= 1) if ((v >> (i + 10)) & 1) v ^= 0x537 << i;
    return ((data << 10) | v) ^ 0x5412;
  }
  /* 형식정보를 규격 자리에 놓는다. grid[행][열].

     예전에는 이 배치가 행과 열이 뒤바뀌어 있었다 — 비트 14 가 (8행,0열)이
     아니라 (0행,8열)에 갔다. 데이터는 규격 방향으로 깔고 형식정보만 뒤집혀
     있으니 카메라는 마스크와 오류정정 수준을 엉뚱한 자리에서 읽고 해독에
     실패한다. 같은 착각으로 짠 자체 해독기는 이것을 통과시켰다. 그래서
     tests/qr-share.test.js 는 이제 남이 만든 해독기(jsQR)로 읽는다.

     비트 번호는 최하위가 0. 첫 사본은 왼쪽 위를 ㄱ자로 감싸고(6열 타이밍은
     건너뛴다), 둘째 사본은 오른쪽 위 가로 8칸과 왼쪽 아래 세로 7칸이다. */
  function placeFormat(grid, size, ec, mask) {
    const bits = formatBits(ec, mask);
    for (let i = 0; i < 15; i += 1) {
      const b = (bits >> i) & 1;
      // 첫 번째 사본: 8열 위쪽 → (7,8) → (8,8) → (8,7) → 8행 왼쪽
      if (i < 6) grid[i][8] = b;
      else if (i === 6) grid[7][8] = b;
      else if (i === 7) grid[8][8] = b;
      else if (i === 8) grid[8][7] = b;
      else grid[8][14 - i] = b;
      // 두 번째 사본: 8행 오른쪽 끝에서 안쪽으로 8개, 8열 아래쪽 7개
      if (i < 8) grid[8][size - 1 - i] = b;
      else grid[size - 15 + i][8] = b;
    }
    grid[size - 8][8] = 1;                           // 고정 검은 모듈은 그대로 둔다
  }

  /* 규격의 감점 규칙 1~4 */
  function penalty(g) {
    const n = g.length;
    let p = 0;
    const runScore = line => {
      let s = 0, run = 1;
      for (let i = 1; i < n; i += 1) {
        if (line[i] === line[i - 1]) run += 1;
        else { if (run >= 5) s += 3 + (run - 5); run = 1; }
      }
      if (run >= 5) s += 3 + (run - 5);
      return s;
    };
    for (let y = 0; y < n; y += 1) p += runScore(g[y]);
    for (let x = 0; x < n; x += 1) p += runScore(g.map(r => r[x]));
    for (let y = 0; y < n - 1; y += 1) for (let x = 0; x < n - 1; x += 1) {
      const v = g[y][x];
      if (v === g[y][x + 1] && v === g[y + 1][x] && v === g[y + 1][x + 1]) p += 3;
    }
    const pat = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
    const rev = pat.slice().reverse();
    const hit = (arr, i, q) => q.every((v, k) => arr[i + k] === v);
    for (let y = 0; y < n; y += 1) {
      const row = g[y], col = g.map(r => r[y]);
      for (let i = 0; i + 11 <= n; i += 1) {
        if (hit(row, i, pat) || hit(row, i, rev)) p += 40;
        if (hit(col, i, pat) || hit(col, i, rev)) p += 40;
      }
    }
    let dark = 0;
    g.forEach(r => r.forEach(v => { if (v) dark += 1; }));
    p += Math.floor(Math.abs(dark * 100 / (n * n) - 50) / 5) * 10;
    return p;
  }

  function utf8(str) {
    const out = [];
    for (const ch of String(str)) {
      const c = ch.codePointAt(0);
      if (c < 0x80) out.push(c);
      else if (c < 0x800) out.push(0xC0 | (c >> 6), 0x80 | (c & 63));
      else if (c < 0x10000) out.push(0xE0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      else out.push(0xF0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
    return out;
  }

  function matrix(text, opts) {
    const o = opts || {};
    const ec = SPEC[o.ec] ? o.ec : 'M';
    const bytes = utf8(text);
    let ver = 0;
    for (let v = 1; v <= 10; v += 1) if (bytes.length <= capacityBytes(v, ec)) { ver = v; break; }
    if (!ver) {
      if (ec !== 'L') return matrix(text, Object.assign({}, o, { ec: 'L' }));   // 더 담아 본다
      throw new Error('qr-too-long');
    }
    const size = 17 + ver * 4;
    const M = newMatrix(size);
    placePatterns(M, ver);
    placeVersion(M, ver);
    placeData(M, interleave(encodeData(bytes, ver, ec), ver, ec));

    let best = null;
    for (let mk = 0; mk < 8; mk += 1) {
      const g = applyMask(M, mk);
      placeFormat(g, size, ec, mk);
      const p = penalty(g);
      if (!best || p < best.p) best = { p, g, mk };
    }
    best.g.version = ver; best.g.ec = ec; best.g.mask = best.mk;
    return best.g;
  }

  function svg(text, opts) {
    const o = opts || {};
    const g = matrix(text, o);
    const n = g.length, margin = o.margin == null ? 4 : o.margin;
    const total = n + margin * 2;
    const dark = o.dark || '#17231d', light = o.light || '#ffffff';
    let d = '';
    for (let y = 0; y < n; y += 1) {
      let x = 0;
      while (x < n) {
        if (!g[y][x]) { x += 1; continue; }
        let w = 1;
        while (x + w < n && g[y][x + w]) w += 1;
        d += `M${x + margin} ${y + margin}h${w}v1h-${w}z`;
        x += w;
      }
    }
    const size = o.size ? ` width="${o.size}" height="${o.size}"` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}"${size} shape-rendering="crispEdges" role="img" aria-label="QR 코드">`
      + `<rect width="${total}" height="${total}" fill="${light}"/>`
      + `<path d="${d}" fill="${dark}"/></svg>`;
  }

  window.JPQR = { matrix, svg, capacityBytes, _gf: { EXP, LOG, gmul, ecc, genPoly } };
}());
