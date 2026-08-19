/** Admin landing page. Renders only for a signed-in staff member. */
(function initAdminHome(global) {
  'use strict';

  document.addEventListener('DOMContentLoaded', function onReady() {
    global.AppUtils.requireAdmin().then(function onAuthorised(user) {
      var slot = document.getElementById('currentUser');
      if (slot) slot.textContent = 'مرحبًا ' + user.name + ' (' + user.role + ')';
    });

    var button = document.getElementById('logoutButton');
    if (!button) return;

    button.addEventListener('click', function onLogout() {
      button.disabled = true;
      global.axios
        .post(global.API.url('/auth/logout'))
        .catch(function ignore() {})
        .then(function done() {
          global.location.href = global.API.loginPage;
        });
    });
  });
})(window);
