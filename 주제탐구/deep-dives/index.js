/* 깊이 탐구 저장소.
   과목별 파일이 여기에 자기 것을 담는다. 이 파일이 가장 먼저 실려야 한다.

   잠금도 광고도 없다. 씨앗 108개 전부를 채우는 것이 먼저고,
   무엇을 잠글지는 다 만든 뒤에 정한다. */
(function () {
  'use strict';

  window.JPDeepDives = window.JPDeepDives || { version: 2, items: {} };

  // 과목 파일이 부른다. 씨앗 번호가 겹치면 먼저 담긴 것을 지키고 알린다.
  window.JPDeepDives.add = function (entries) {
    var items = window.JPDeepDives.items;
    Object.keys(entries).forEach(function (id) {
      if (items[id]) {
        if (window.console) console.warn('깊이 탐구가 겹친다: ' + id);
        return;
      }
      items[id] = entries[id];
    });
  };
}());
