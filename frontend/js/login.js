/** Admin sign-in. The session is an httpOnly cookie set by the API. */
(function initLogin(global) {
  'use strict';

  var utils = global.AppUtils;

  /**
   * Where to go after a successful login. Only same-site paths are honoured,
   * so a crafted `?next=https://evil.example` cannot turn this into an open
   * redirect.
   */
  function nextPath() {
    var requested = new URLSearchParams(global.location.search).get('next');
    if (requested && /^\/[^/\\]/.test(requested)) return requested;
    return 'admin.html';
  }

  document.addEventListener('DOMContentLoaded', function onReady() {
    var form = document.getElementById('loginForm');
    var button = document.getElementById('loginButton');
    var status = document.getElementById('loginStatus');

    form.addEventListener('submit', function onSubmit(event) {
      event.preventDefault();

      var email = document.getElementById('email').value.trim();
      var password = document.getElementById('password').value;

      if (!email || !password) {
        utils.setStatus(status, 'error', 'يرجى إدخال البريد الإلكتروني وكلمة المرور.');
        return;
      }

      button.disabled = true;
      utils.setStatus(status, 'loading', 'جارٍ تسجيل الدخول…');

      global.axios
        .post(global.API.url('/auth/login'), { email: email, password: password })
        .then(function onSuccess() {
          global.location.href = nextPath();
        })
        .catch(function onFailure(error) {
          button.disabled = false;
          utils.setStatus(status, 'error', utils.errorMessage(error));
        });
    });
  });
})(window);
