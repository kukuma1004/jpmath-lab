(function () {
  'use strict';

  var ACCESS_KEY = 'jp-classroom-access-v1';
  var PASSWORD_HASH = 'e0ad82bd71992decb0a4a4441fee75bd69b062d6b80de94435f3f665d43b1cdd';
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

  function matchesPassword(value) {
    if (!window.crypto || !window.crypto.subtle || !window.TextEncoder) return Promise.resolve(false);
    return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)).then(function (buffer) {
      return Array.prototype.map.call(new Uint8Array(buffer), function (byte) {
        return byte.toString(16).padStart(2, '0');
      }).join('') === PASSWORD_HASH;
    });
  }

  function announce(type, message) {
    document.dispatchEvent(new CustomEvent('jp:feedback', { detail: { type: type, message: message } }));
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
    var submit = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!input.value) {
        feedback.textContent = '비밀번호를 입력해 주세요.';
        input.focus();
        return;
      }
      feedback.textContent = '';
      submit.disabled = true;
      submit.setAttribute('aria-busy', 'true');
      submit.textContent = '확인 중…';
      matchesPassword(input.value).then(function (matched) {
        submit.disabled = false;
        submit.removeAttribute('aria-busy');
        submit.textContent = '입장하기';
        if (!matched) {
          feedback.textContent = '비밀번호가 맞지 않습니다. 대소문자를 확인해 주세요.';
          form.classList.remove('jp-error-shake');
          void form.offsetWidth;
          form.classList.add('jp-error-shake');
          input.select();
          announce('error', '비밀번호를 다시 확인해 주세요.');
          return;
        }

        grantAccess();
        form.classList.add('is-authenticated');
        feedback.textContent = '확인되었습니다. 수업창고를 엽니다.';
        announce('success', '수업창고 인증이 완료되었습니다.');
        var nextUrl = safeNextUrl();
        window.setTimeout(function () {
          if (nextUrl) window.location.replace(nextUrl);
          else showContent();
        }, 280);
      }).catch(function () {
        submit.disabled = false;
        submit.removeAttribute('aria-busy');
        submit.textContent = '입장하기';
        feedback.textContent = '브라우저에서 안전한 비밀번호 확인을 실행하지 못했습니다.';
        announce('error', '비밀번호 확인 중 문제가 발생했습니다.');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}());
