/* 씨앗밭 — 탐구 씨앗을 교과·급·분야로 걸러 본다.
   데이터는 seeds.js 한 곳에만 있다. 이 파일은 그리기만 한다. */
(function () {
  'use strict';

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function mount(root) {
    var DB = window.JPSeeds;
    if (!root || !DB) return null;

    var seeds = DB.seeds;
    var state = { subject: 'all', ceiling: 'all', domain: 'all' };

    function countBy(pick, value) {
      return seeds.filter(function (s) { return pick(s) === value; }).length;
    }

    // 급은 입구가 모두 고교라서 천장으로 나눈다. 낮은 천장부터.
    var ceilings = Object.keys(DB.LEVEL)
      .filter(function (k) { return seeds.some(function (s) { return s.ceiling === k; }); })
      .sort(function (a, b) { return DB.LEVEL[a].rank - DB.LEVEL[b].rank; });

    var domains = [];
    seeds.forEach(function (s) {
      s.domain.forEach(function (d) { if (domains.indexOf(d) < 0) domains.push(d); });
    });
    domains.sort(function (a, b) { return a.localeCompare(b, 'ko'); });

    function chip(group, value, label, n, on) {
      return '<button type="button" class="sd-chip' + (on ? ' on' : '') + '"' +
             ' data-group="' + group + '" data-value="' + esc(value) + '"' +
             ' aria-pressed="' + (on ? 'true' : 'false') + '">' +
             esc(label) + (n === null ? '' : '<i>' + n + '</i>') + '</button>';
    }

    root.innerHTML =
      '<div class="sd-controls">' +
        '<div class="sd-row"><span class="sd-row-label">교과</span><div class="sd-chips">' +
          chip('subject', 'all', '전체', seeds.length, true) +
          ['calc', 'geo', 'econ'].map(function (k) {
            return chip('subject', k, DB.SUBJECT[k].label,
              countBy(function (s) { return s.subject; }, k), false);
          }).join('') +
        '</div></div>' +
        '<div class="sd-row"><span class="sd-row-label">급</span><div class="sd-chips">' +
          chip('ceiling', 'all', '전체', null, true) +
          ceilings.map(function (k) {
            return chip('ceiling', k, '고교 → ' + DB.LEVEL[k].label,
              countBy(function (s) { return s.ceiling; }, k), false);
          }).join('') +
        '</div></div>' +
        '<div class="sd-row"><span class="sd-row-label">분야</span>' +
          '<select class="sd-select" aria-label="분야로 거르기">' +
            '<option value="all">전체 분야</option>' +
            domains.map(function (d) {
              var n = seeds.filter(function (s) { return s.domain.indexOf(d) > -1; }).length;
              return '<option value="' + esc(d) + '">' + esc(d) + ' (' + n + ')</option>';
            }).join('') +
          '</select>' +
        '</div>' +
      '</div>' +
      '<p class="sd-count" aria-live="polite"></p>' +
      '<div class="sd-list"></div>' +
      '<p class="sd-note">모든 씨앗은 <b>검증 전</b>이다. 수학·사실 검증과 선생님 검토를 지나야 확정된다. ' +
        '출처 · <code>' + esc(DB.source) + '</code></p>';

    var list = root.querySelector('.sd-list');
    var countEl = root.querySelector('.sd-count');

    function scoreBars(s) {
      if (!s.score) {
        return '<p class="sd-unscored">아직 평가 점수가 매겨지지 않았다.</p>';
      }
      return '<div class="sd-score">' +
        '<div class="sd-score-head"><b>제작 ' + s.score.rank + '순위</b>' +
          '<span>' + s.score.total + ' / 35</span></div>' +
        '<div class="sd-bars">' +
          DB.AXES.map(function (a) {
            var v = s.score[a.key];
            return '<div class="sd-bar" title="' + esc(a.label) + ' ' + v + '점">' +
              '<span class="sd-bar-key">' + a.key + '</span>' +
              '<span class="sd-bar-track"><span class="sd-bar-fill" style="width:' + (v / 5 * 100) + '%"></span></span>' +
              '<span class="sd-bar-val">' + v + '</span></div>';
          }).join('') +
        '</div></div>';
    }

    function row(term, value) {
      return '<dt>' + esc(term) + '</dt><dd>' + value + '</dd>';
    }

    function card(s) {
      var rel = DB.RELATION[s.relation];
      var tags = function (arr, cls) {
        return arr.map(function (x) { return '<span class="' + cls + '">' + esc(x) + '</span>'; }).join('');
      };
      return '<details class="sd-seed sd-' + s.subject + '">' +
        '<summary>' +
          '<span class="sd-line">' +
            '<span class="sd-subject">' + esc(DB.SUBJECT[s.subject].label) + '</span>' +
            '<span class="sd-rel" title="' + esc(rel.desc) + '">' + esc(rel.label) + '</span>' +
            '<span class="sd-grade">고교 → ' + esc(DB.LEVEL[s.ceiling].label) + '</span>' +
            (s.score ? '<span class="sd-rank">제작 ' + s.score.rank + '순위</span>' : '') +
          '</span>' +
          '<span class="sd-question">' + esc(s.question) + '</span>' +
          '<span class="sd-title">' + esc(s.title) + '</span>' +
        '</summary>' +
        '<div class="sd-body">' +
          '<p class="sd-phenom">' + esc(s.phenomenon) + '</p>' +
          '<dl class="sd-meta">' +
            row('해보는 것', esc(s.act)) +
            (s.misstep ? row('흔한 착각', esc(s.misstep)) : '') +
            row('다음 질문', esc(s.next)) +
            row('수학 개념', '<span class="sd-tags">' + tags(s.concepts, 'sd-tag') + '</span>') +
            row('분야', '<span class="sd-tags">' + tags(s.domain, 'sd-tag sd-tag-domain') + '</span>') +
            (s.caution ? row('확인 필요', '<b class="sd-caution">' + esc(s.caution) + '</b>') : '') +
          '</dl>' +
          scoreBars(s) +
          '<div class="sd-foot">' +
            '<a class="sd-go" href="' + esc(s.asset.href) + '">' + esc(s.asset.label) + '에서 해보기 →</a>' +
            '<code class="sd-id">' + esc(s.id) + '</code>' +
          '</div>' +
        '</div>' +
      '</details>';
    }

    function matches(s) {
      if (state.subject !== 'all' && s.subject !== state.subject) return false;
      if (state.ceiling !== 'all' && s.ceiling !== state.ceiling) return false;
      if (state.domain !== 'all' && s.domain.indexOf(state.domain) < 0) return false;
      return true;
    }

    function render() {
      var shown = seeds.filter(matches);
      countEl.textContent = shown.length
        ? '씨앗 ' + shown.length + '개'
        : '조건에 맞는 씨앗이 없다. 거르개를 하나 풀어 보자.';
      list.innerHTML = shown.map(card).join('');
    }

    root.querySelectorAll('.sd-chip').forEach(function (b) {
      b.addEventListener('click', function () {
        var g = b.dataset.group;
        state[g] = b.dataset.value;
        root.querySelectorAll('.sd-chip[data-group="' + g + '"]').forEach(function (x) {
          var on = x === b;
          x.classList.toggle('on', on);
          x.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        render();
      });
    });

    root.querySelector('.sd-select').addEventListener('change', function (e) {
      state.domain = e.target.value;
      render();
    });

    render();
    return { render: render };
  }

  window.JPSeedField = { mount: mount };

  document.addEventListener('DOMContentLoaded', function () {
    var el = document.querySelector('[data-seed-field]');
    if (el) mount(el);
  });
}());
