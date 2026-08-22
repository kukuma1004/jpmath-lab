(function () {
  'use strict';

  var DATA_URL = 'data/inquiries.json';
  var subjectLabels = {
    'calculus-1': '미적분Ⅰ',
    geometry: '기하',
    'mathematical-inquiry': '통합·이론 탐구'
  };
  var statusLabels = {
    'topic-submitted': '주제 제출',
    questioning: '질문 정교화',
    exploring: '탐구 중',
    revising: '수정 중',
    complete: '전시 완료'
  };

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === 'string') node.textContent = text;
    return node;
  }

  function reveal(nodes) {
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(function (node) { node.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .08, rootMargin: '0px 0px -35px' });
    nodes.forEach(function (node) { observer.observe(node); });
  }

  function loadData() {
    return fetch(DATA_URL, { cache: 'no-store' }).then(function (response) {
      if (!response.ok) throw new Error('탐구 데이터를 불러오지 못했습니다.');
      return response.json();
    });
  }

  function renderHome(data) {
    var inquiries = data.inquiries || [];
    var students = {};
    var mapped = 0;
    var apps = 0;

    inquiries.forEach(function (item) {
      students[item.studentId] = true;
      if (item.curriculumMapping === 'draft' || item.curriculumMapping === 'complete') mapped += 1;
      if (item.studentApp && item.studentApp.entry) apps += 1;
    });

    document.getElementById('studentCount').textContent = Object.keys(students).length;
    document.getElementById('inquiryCount').textContent = inquiries.length;
    document.getElementById('mappedCount').textContent = mapped + ' / ' + inquiries.length;
    document.getElementById('appCount').textContent = apps + ' / ' + inquiries.length;

    var grid = document.getElementById('inquiryGrid');
    var filters = document.querySelectorAll('[data-filter]');

    function draw(filter) {
      grid.textContent = '';
      var shown = inquiries.filter(function (item) {
        return filter === 'all' || item.subject === filter;
      });

      shown.forEach(function (item, index) {
        var card = element('a', 'inquiry-card');
        card.href = 'inquiry.html?id=' + encodeURIComponent(item.id);
        card.setAttribute('data-subject', item.subject);
        card.style.setProperty('--delay', Math.min(index % 6, 5) * 55 + 'ms');

        var top = element('div', 'card-top');
        top.appendChild(element('span', '', subjectLabels[item.subject] || item.subject));
        top.appendChild(element('span', 'draft-badge', statusLabels[item.status] || item.status));

        var title = element('h3', '', item.title);
        var question = element('p', 'card-question', item.question);
        var bottom = element('div', 'card-bottom');
        bottom.appendChild(element('span', 'student-code', item.displayName));
        bottom.appendChild(element('span', 'card-arrow', '탐구 보기 →'));

        card.appendChild(top);
        card.appendChild(title);
        card.appendChild(question);
        card.appendChild(bottom);
        card.appendChild(element('span', 'card-index', String(index + 1).padStart(2, '0')));
        grid.appendChild(card);
      });
      reveal(Array.prototype.slice.call(grid.querySelectorAll('.inquiry-card')));
    }

    filters.forEach(function (button) {
      button.addEventListener('click', function () {
        filters.forEach(function (other) { other.classList.toggle('is-active', other === button); });
        draw(button.getAttribute('data-filter'));
      });
    });

    draw('all');
  }

  function storyBlock(number, label, title, content, pending) {
    var block = element('section', 'story-block');
    block.appendChild(element('span', 'story-number', String(number).padStart(2, '0')));
    block.appendChild(element('p', 'story-label', label));
    block.appendChild(element('h2', '', title));
    block.appendChild(element('p', '', content));
    if (pending) block.appendChild(element('p', 'pending-note', pending));
    return block;
  }

  function renderDetail(data) {
    var inquiries = data.inquiries || [];
    var id = new URLSearchParams(window.location.search).get('id');
    var item = inquiries.find(function (entry) { return entry.id === id; });
    var shell = document.getElementById('inquiryDetail');
    shell.textContent = '';

    if (!item) {
      shell.appendChild(element('p', 'error-message', '해당 탐구를 찾을 수 없습니다. 목록에서 다시 선택해 주세요.'));
      return;
    }

    document.title = item.title + ' · 2026 Mathematical Inquiry Project';
    document.body.setAttribute('data-subject', item.subject);

    var hero = element('header', 'detail-hero');
    var itemIndex = inquiries.indexOf(item) + 1;
    hero.appendChild(element('p', 'detail-index', 'QUESTION ' + String(itemIndex).padStart(2, '0') + ' / ' + String(inquiries.length).padStart(2, '0')));
    var meta = element('div', 'detail-meta');
    meta.appendChild(element('span', 'detail-chip', subjectLabels[item.subject] || item.subject));
    meta.appendChild(element('span', 'detail-chip orange', item.displayName));
    meta.appendChild(element('span', 'detail-chip', statusLabels[item.status] || item.status));
    hero.appendChild(meta);
    hero.appendChild(element('h1', '', item.title));
    hero.appendChild(element('p', 'big-question', '“' + item.question + '”'));
    shell.appendChild(hero);

    var flow = element('div', 'story-flow');
    var standards = item.curriculumStandards && item.curriculumStandards.length
      ? item.curriculumStandards.join(' · ')
      : '성취기준 코드 확인 중';
    var mappingNote = item.curriculumMapping === 'complete'
      ? ''
      : (item.curriculumMapping === 'review'
        ? '교과 경계를 넘는 질문이므로 주 성취기준과 확장 영역을 다시 검토합니다.'
        : '기존 마스터표를 바탕으로 한 1차 매핑입니다. 교육부 원문 대조 후 확정합니다.');

    flow.appendChild(storyBlock(
      1,
      'ORIGIN · CURRICULUM',
      '수학의 어디에서 출발했는가?',
      standards + ' · ' + item.concepts.join(' · ') + '을 중심으로 교육과정과 학생의 최초 질문을 연결합니다.',
      mappingNote
    ));
    flow.appendChild(storyBlock(
      2,
      'QUESTION · CURIOSITY',
      '모든 탐구는 하나의 질문에서 시작된다.',
      item.question,
      '현재는 학생의 최신 주제 제출 내용을 바탕으로 구성한 초안입니다.'
    ));
    flow.appendChild(storyBlock(
      3,
      'EXPLORATION',
      '어떻게 알아볼 것인가?',
      item.explorationPlan,
      '예상·수행·오류·수정 기록이 들어오면 실제 탐구 과정으로 교체됩니다.'
    ));

    var app = element('section', 'app-panel');
    app.appendChild(element('p', 'story-label', 'BUILD · STUDENT WEB APP'));
    app.appendChild(element('h2', '', '학생이 만든 탐구 도구'));
    if (item.studentApp && item.studentApp.entry) {
      app.appendChild(element('p', '', '학생이 질문을 조작하고 검증하기 위해 제작한 웹앱을 실행합니다.'));
      var appLink = element('a', 'app-action', '웹앱 실행하기 →');
      appLink.href = item.studentApp.entry;
      app.appendChild(appLink);
    } else {
      app.appendChild(element('p', '', '웹앱은 학생 제출 후 실행·수학적 정확성·개인정보를 검수하여 연결합니다.'));
      var pendingLink = element('span', 'app-action', '웹앱 제출 예정');
      pendingLink.setAttribute('aria-disabled', 'true');
      app.appendChild(pendingLink);
    }
    flow.appendChild(app);

    flow.appendChild(storyBlock(
      4,
      'DISCOVERY',
      '무엇을 발견하고 어떻게 설명했는가?',
      '탐구 결과를 단순한 정답이 아니라 조건, 관계, 근거가 드러나는 학생의 언어로 기록합니다.',
      '아직 실제 발견 기록이 제출되지 않았습니다.'
    ));
    flow.appendChild(storyBlock(
      5,
      'CONNECTION · NEW QUESTION',
      '이 질문은 어디까지 이어지는가?',
      '다른 수학 개념이나 실제로 필요한 타 교과와 연결하고, 이번 발견에서 새롭게 생긴 질문을 남깁니다.',
      '연결과 새 질문은 탐구 과정에서 실제로 발생한 뒤에 공개합니다.'
    ));
    shell.appendChild(flow);
    reveal(Array.prototype.slice.call(flow.querySelectorAll('.story-block')));

    var relatedItems = inquiries.filter(function (entry) {
      return entry.id !== item.id && (entry.studentId === item.studentId || entry.subject === item.subject);
    }).slice(0, 4);

    if (relatedItems.length) {
      var related = element('section', 'related');
      related.appendChild(element('h2', '', '이어지는 탐구'));
      var links = element('div', 'related-links');
      relatedItems.forEach(function (entry) {
        var link = element('a', 'related-link');
        link.href = 'inquiry.html?id=' + encodeURIComponent(entry.id);
        link.appendChild(element('strong', '', entry.title));
        link.appendChild(element('span', '', (subjectLabels[entry.subject] || entry.subject) + ' · ' + entry.displayName));
        links.appendChild(link);
      });
      related.appendChild(links);
      shell.appendChild(related);
    }
  }

  function fail(error) {
    var target = document.getElementById('inquiryGrid') || document.getElementById('inquiryDetail');
    if (!target) return;
    target.textContent = '';
    target.appendChild(element('p', 'error-message', error.message + ' 로컬에서는 간단한 웹 서버로 열어 주세요.'));
  }

  function init() {
    loadData().then(function (data) {
      if (document.body.getAttribute('data-page') === 'detail') renderDetail(data);
      else renderHome(data);
    }).catch(fail);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
}());
