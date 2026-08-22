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

  function illustration(name) {
    var art = element('div', 'slide-art art-' + name);
    var drawings = {
      constellation: '<svg viewBox="0 0 800 800" role="img" aria-label="질문에서 퍼져 나가는 수학적 생각"><circle cx="410" cy="390" r="245"/><ellipse cx="410" cy="390" rx="330" ry="145" transform="rotate(-18 410 390)"/><ellipse cx="410" cy="390" rx="310" ry="118" transform="rotate(58 410 390)"/><path d="M145 570L276 462L410 390L554 258L690 180"/><g><circle cx="145" cy="570" r="14"/><circle cx="276" cy="462" r="10"/><circle cx="410" cy="390" r="34"/><circle cx="554" cy="258" r="12"/><circle cx="690" cy="180" r="18"/></g><text x="376" y="430">?</text></svg>',
      grid: '<svg viewBox="0 0 800 800" role="img" aria-label="좌표 격자와 함수 곡선"><defs><pattern id="g" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M64 0H0V64"/></pattern></defs><rect x="70" y="70" width="660" height="660" rx="42" fill="url(#g)"/><path class="strong" d="M90 610H720M190 730V80"/><path class="curve" d="M105 615C210 610 230 525 320 470S470 405 520 270S630 126 716 112"/><circle cx="520" cy="270" r="18"/><text x="230" y="188">f(x)</text></svg>',
      orbit: '<svg viewBox="0 0 800 800" role="img" aria-label="하나의 질문을 둘러싼 생각의 궤도"><circle cx="400" cy="400" r="96" class="filled"/><ellipse cx="400" cy="400" rx="330" ry="150" transform="rotate(-20 400 400)"/><ellipse cx="400" cy="400" rx="300" ry="124" transform="rotate(55 400 400)"/><circle cx="116" cy="332" r="18"/><circle cx="657" cy="238" r="13"/><circle cx="590" cy="626" r="20"/><text x="365" y="455">?</text></svg>',
      graph: '<svg viewBox="0 0 800 800" role="img" aria-label="함수 그래프와 넓이 분할"><path class="strong" d="M85 660H730M120 720V80"/><g class="bars"><rect x="165" y="490" width="62" height="170"/><rect x="227" y="420" width="62" height="240"/><rect x="289" y="350" width="62" height="310"/><rect x="351" y="286" width="62" height="374"/><rect x="413" y="230" width="62" height="430"/><rect x="475" y="185" width="62" height="475"/><rect x="537" y="150" width="62" height="510"/></g><path class="curve" d="M130 585C245 520 296 408 388 300S560 145 700 126"/><path d="M165 675V700M289 675V700M413 675V700M537 675V700"/></svg>',
      code: '<svg viewBox="0 0 800 800" role="img" aria-label="학생이 만드는 디지털 탐구 도구"><rect x="90" y="130" width="620" height="500" rx="42"/><path d="M90 230H710"/><circle cx="145" cy="182" r="13"/><circle cx="190" cy="182" r="13"/><circle cx="235" cy="182" r="13"/><path class="strong" d="M180 330L120 390L180 450M620 330L680 390L620 450M465 290L335 500"/><rect class="filled" x="204" y="556" width="392" height="20" rx="10"/></svg>',
      rays: '<svg viewBox="0 0 800 800" role="img" aria-label="초점으로 모이는 빛과 발견"><path class="curve" d="M170 90C560 165 645 390 170 710"/><circle cx="425" cy="400" r="26" class="filled"/><path d="M70 170L330 310L425 400L715 400M70 300L345 350L425 400L715 400M70 500L345 450L425 400L715 400M70 630L330 490L425 400L715 400"/><circle cx="425" cy="400" r="92"/><text x="452" y="367">발견</text></svg>',
      network: '<svg viewBox="0 0 800 800" role="img" aria-label="개념과 새로운 질문의 연결망"><path d="M135 210L330 320L510 160L680 300L548 500L690 650M330 320L245 585L548 500M135 210L245 585M330 320L548 500"/><g class="nodes"><circle cx="135" cy="210" r="46"/><circle cx="330" cy="320" r="68"/><circle cx="510" cy="160" r="34"/><circle cx="680" cy="300" r="52"/><circle cx="245" cy="585" r="42"/><circle cx="548" cy="500" r="74"/><circle cx="690" cy="650" r="30"/></g><text x="303" y="345">?</text><text x="520" y="525">→</text></svg>'
    };
    art.innerHTML = drawings[name] || drawings.constellation;
    art.setAttribute('aria-hidden', 'true');
    return art;
  }

  function storySlide(number, label, title, content, pending, visual, modifier) {
    var slide = element('section', 'deck-slide' + (modifier ? ' ' + modifier : ''));
    slide.setAttribute('data-slide-label', label);
    var copy = element('div', 'slide-copy');
    copy.appendChild(element('span', 'slide-kicker', String(number).padStart(2, '0') + ' · ' + label));
    copy.appendChild(element('h2', '', title));
    copy.appendChild(element('p', 'slide-body', content));
    if (pending) copy.appendChild(element('p', 'slide-note', pending));
    slide.appendChild(copy);
    slide.appendChild(illustration(visual));
    return slide;
  }

  function activateDeck(deck, slides) {
    var current = 0;
    var previous = element('button', 'deck-button deck-previous', '← 이전');
    var next = element('button', 'deck-button deck-next', '다음 →');
    var counter = element('span', 'deck-counter');
    var dots = element('div', 'deck-dots');
    var controls = element('nav', 'deck-controls');
    var progress = element('span', 'deck-progress');

    slides.forEach(function (slide, index) {
      var dot = element('button', 'deck-dot');
      dot.type = 'button';
      dot.setAttribute('aria-label', (index + 1) + '번 슬라이드: ' + slide.getAttribute('data-slide-label'));
      dot.addEventListener('click', function () { show(index); });
      dots.appendChild(dot);
    });

    controls.appendChild(previous);
    controls.appendChild(dots);
    controls.appendChild(counter);
    controls.appendChild(next);
    deck.appendChild(progress);
    deck.appendChild(controls);

    function show(index) {
      current = Math.max(0, Math.min(index, slides.length - 1));
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
        slide.classList.toggle('is-before', slideIndex < current);
        slide.classList.toggle('is-after', slideIndex > current);
        slide.setAttribute('aria-hidden', slideIndex === current ? 'false' : 'true');
      });
      Array.prototype.forEach.call(dots.children, function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
        dot.setAttribute('aria-current', dotIndex === current ? 'step' : 'false');
      });
      previous.disabled = current === 0;
      next.disabled = current === slides.length - 1;
      counter.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
      progress.style.setProperty('--deck-progress', ((current + 1) / slides.length * 100) + '%');
      history.replaceState(null, '', location.pathname + location.search + '#/' + (current + 1));
    }

    previous.addEventListener('click', function () { show(current - 1); });
    next.addEventListener('click', function () { show(current + 1); });

    document.addEventListener('keydown', function (event) {
      if (event.target && /input|textarea|select/i.test(event.target.tagName)) return;
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].indexOf(event.key) >= 0) {
        event.preventDefault(); show(current + 1);
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].indexOf(event.key) >= 0) {
        event.preventDefault(); show(current - 1);
      } else if (event.key === 'Home') show(0);
      else if (event.key === 'End') show(slides.length - 1);
    });

    var wheelLocked = false;
    deck.addEventListener('wheel', function (event) {
      event.preventDefault();
      if (wheelLocked || Math.abs(event.deltaY) < 18) return;
      wheelLocked = true;
      show(current + (event.deltaY > 0 ? 1 : -1));
      window.setTimeout(function () { wheelLocked = false; }, 650);
    }, { passive: false });

    var touchStart = 0;
    deck.addEventListener('touchstart', function (event) { touchStart = event.changedTouches[0].clientX; }, { passive: true });
    deck.addEventListener('touchend', function (event) {
      var distance = touchStart - event.changedTouches[0].clientX;
      if (Math.abs(distance) > 55) show(current + (distance > 0 ? 1 : -1));
    }, { passive: true });

    var hashMatch = location.hash.match(/^#\/(\d+)$/);
    show(hashMatch ? Number(hashMatch[1]) - 1 : 0);
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

    document.title = item.title + ' · 2026 수학 주제탐구';
    document.body.setAttribute('data-subject', item.subject);

    var itemIndex = inquiries.indexOf(item) + 1;
    document.body.classList.add('detail-deck-ready');
    var deck = element('div', 'inquiry-deck');
    var slides = [];
    var standards = item.curriculumStandards && item.curriculumStandards.length
      ? item.curriculumStandards.join(' · ')
      : '성취기준 코드 확인 중';
    var mappingNote = item.curriculumMapping === 'complete'
      ? ''
      : (item.curriculumMapping === 'review'
        ? '교과 경계를 넘는 질문이므로 주 성취기준과 확장 영역을 다시 검토합니다.'
        : '기존 마스터표를 바탕으로 한 1차 매핑입니다. 교육부 원문 대조 후 확정합니다.');

    var cover = element('section', 'deck-slide deck-cover');
    cover.setAttribute('data-slide-label', '표지');
    var coverCopy = element('div', 'slide-copy');
    coverCopy.appendChild(element('span', 'slide-kicker', '탐구 ' + String(itemIndex).padStart(2, '0') + ' / ' + String(inquiries.length).padStart(2, '0')));
    var coverMeta = element('div', 'cover-meta');
    coverMeta.appendChild(element('span', '', subjectLabels[item.subject] || item.subject));
    coverMeta.appendChild(element('span', '', item.displayName));
    coverMeta.appendChild(element('span', '', statusLabels[item.status] || item.status));
    coverCopy.appendChild(coverMeta);
    coverCopy.appendChild(element('h1', '', item.title));
    coverCopy.appendChild(element('p', 'cover-question', '“' + item.question + '”'));
    cover.appendChild(coverCopy);
    cover.appendChild(illustration('constellation'));
    slides.push(cover);

    slides.push(storySlide(
      1,
      '교육과정에서 출발',
      '수학의 어디에서 출발했는가?',
      standards + ' · ' + item.concepts.join(' · ') + '을 중심으로 교육과정과 학생의 최초 질문을 연결합니다.',
      mappingNote,
      'grid',
      'origin-slide'
    ));
    slides.push(storySlide(
      2,
      '호기심에서 질문으로',
      '이 학생이 붙잡은 질문',
      item.question,
      '현재는 학생의 최신 주제 제출 내용을 바탕으로 구성한 초안입니다.',
      'orbit',
      'question-slide'
    ));
    slides.push(storySlide(
      3,
      '탐구 계획',
      '어떻게 알아볼 것인가?',
      item.explorationPlan,
      '예상·수행·오류·수정 기록이 들어오면 실제 탐구 과정으로 교체됩니다.',
      'graph',
      'exploration-slide'
    ));

    var app = storySlide(4, '학생 웹앱', '질문을 직접 움직여 보는 도구', '', '', 'code', 'app-slide');
    var appCopy = app.querySelector('.slide-copy');
    appCopy.querySelector('.slide-body').remove();
    if (item.studentApp && item.studentApp.entry) {
      appCopy.appendChild(element('p', 'slide-body', '학생이 질문을 조작하고 검증하기 위해 제작한 웹앱입니다. 앞선 질문과 탐구 계획을 살펴본 뒤 실행해 보세요.'));
      var appLink = element('a', 'app-action', '웹앱 실행하기 →');
      appLink.href = item.studentApp.entry;
      appCopy.appendChild(appLink);
    } else {
      appCopy.appendChild(element('p', 'slide-body', '웹앱은 학생 제출 후 실행·수학적 정확성·개인정보를 검수하여 연결합니다.'));
      var pendingLink = element('span', 'app-action', '웹앱 제출 예정');
      pendingLink.setAttribute('aria-disabled', 'true');
      appCopy.appendChild(pendingLink);
    }
    slides.push(app);

    slides.push(storySlide(
      5,
      '발견과 설명',
      '무엇을 발견하고 어떻게 설명했는가?',
      '탐구 결과를 단순한 정답이 아니라 조건, 관계, 근거가 드러나는 학생의 언어로 기록합니다.',
      '아직 실제 발견 기록이 제출되지 않았습니다.',
      'rays',
      'discovery-slide'
    ));
    var connection = storySlide(
      6,
      '연결과 확장',
      '이 질문은 어디까지 이어지는가?',
      '다른 수학 개념이나 실제로 필요한 타 교과와 연결하고, 이번 발견에서 새롭게 생긴 질문을 남깁니다.',
      '연결과 새 질문은 탐구 과정에서 실제로 발생한 뒤에 공개합니다.',
      'network',
      'connection-slide'
    );

    slides.push(connection);

    slides.forEach(function (slide) { deck.appendChild(slide); });
    shell.appendChild(deck);
    activateDeck(deck, slides);
  }

  function fail(error) {
    var target = document.getElementById('inquiryGrid') || document.getElementById('inquiryDetail');
    if (!target) return;
    target.textContent = '';
    target.appendChild(element('p', 'error-message', error.message + ' 로컬에서는 간단한 웹 서버로 열어 주세요.'));
  }

  function init() {
    if (document.documentElement.classList.contains('exhibition-locked')) return;
    loadData().then(function (data) {
      if (document.body.getAttribute('data-page') === 'detail') renderDetail(data);
      else renderHome(data);
    }).catch(fail);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
}());
