(function () {
  'use strict';

  var ACCESS_KEY = 'jp-classroom-access-v1';
  var PASSWORD = 'jpmath';
  var script = document.currentScript;
  var isProtectedPage = script && script.hasAttribute('data-classroom-protected');

  function hasAccess() {
    try {
      return window.sessionStorage.getItem(ACCESS_KEY) === 'granted';
    } catch (error) {
      return false;
    }
  }

  function grantAccess() {
    try {
      window.sessionStorage.setItem(ACCESS_KEY, 'granted');
    } catch (error) {
      // 저장이 막힌 브라우저에서도 현재 페이지 입장은 허용합니다.
    }
  }

  if (isProtectedPage) {
    if (!hasAccess()) {
      var entryUrl = new URL('./', script.src);
      entryUrl.searchParams.set('next', window.location.href);
      window.location.replace(entryUrl.href);
    } else {
      var guardStyle = document.getElementById('classroomGuard');
      if (guardStyle) guardStyle.remove();
    }
    return;
  }

  document.documentElement.classList.add('classroom-auth-pending');

  function showContent() {
    var gate = document.getElementById('classroomGate');
    var content = document.getElementById('classroomContent');
    if (gate) gate.hidden = true;
    if (content) content.removeAttribute('inert');
    document.documentElement.classList.remove('classroom-auth-pending');
  }

  function showGate() {
    var gate = document.getElementById('classroomGate');
    var content = document.getElementById('classroomContent');
    var input = document.getElementById('classroomPassword');
    if (gate) gate.hidden = false;
    if (content) content.setAttribute('inert', '');
    document.documentElement.classList.remove('classroom-auth-pending');
    if (input) input.focus();
  }

  function safeNextUrl() {
    var value = new URLSearchParams(window.location.search).get('next');
    if (!value) return null;
    try {
      var target = new URL(value, window.location.href);
      var storageRoot = new URL('./', window.location.href).pathname;
      if (target.origin === window.location.origin && target.pathname.indexOf(storageRoot) === 0 && target.pathname !== storageRoot) {
        return target.href;
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  function init() {
    if (hasAccess()) {
      var nextUrl = safeNextUrl();
      if (nextUrl) {
        window.location.replace(nextUrl);
        return;
      }
      showContent();
      return;
    }

    showGate();
    var form = document.getElementById('classroomLogin');
    var input = document.getElementById('classroomPassword');
    var feedback = document.getElementById('classroomFeedback');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (input.value === PASSWORD) {
        grantAccess();
        var nextUrl = safeNextUrl();
        if (nextUrl) {
          window.location.replace(nextUrl);
        } else {
          showContent();
        }
        return;
      }

      feedback.textContent = '비밀번호가 맞지 않습니다. 다시 확인해 주세요.';
      input.select();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}());
