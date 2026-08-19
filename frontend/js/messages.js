/** Contact-enquiry inbox. Staff only — the API refuses anonymous reads. */
(function initMessages(global) {
  'use strict';

  var utils = global.AppUtils;
  var esc = utils.escapeHtml;

  function formatDate(value) {
    if (!value) return '';
    var parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? '' : parsed.toLocaleString('ar-SA');
  }

  function render(messages) {
    var body = document.querySelector('#data');
    if (!body) return;

    body.innerHTML = messages
      .map(function toRow(item) {
        return (
          '<tr>' +
          '<td>' + esc(item.name) + '</td>' +
          '<td>' + esc(item.phone) + '</td>' +
          '<td>' + esc(item.email) + '</td>' +
          '<td>' + esc(item.subject) + '</td>' +
          '<td class="text-end">' + esc(item.message) + '</td>' +
          '<td>' + esc(formatDate(item.createdAt)) + '</td>' +
          '</tr>'
        );
      })
      .join('');
  }

  function load() {
    var status = document.getElementById('dashboardStatus');
    utils.setStatus(status, 'loading', 'جارٍ تحميل الرسائل…');

    return global.axios
      .get(global.API.url('/message'))
      .then(function onSuccess(res) {
        var messages = res.data.messages || [];
        render(messages);

        if (messages.length === 0) {
          utils.setStatus(status, 'empty', 'لا توجد رسائل واردة حتى الآن.');
        } else {
          utils.clearStatus(status);
        }
      })
      .catch(function onFailure(error) {
        if (utils.handleAuthError(error)) return;
        utils.setStatus(status, 'error', utils.errorMessage(error));
      });
  }

  document.addEventListener('DOMContentLoaded', function onReady() {
    utils.requireAdmin().then(function onAuthorised(user) {
      var slot = document.getElementById('currentUser');
      if (slot) slot.textContent = user.name + ' (' + user.role + ')';
      return load();
    });
  });
})(window);
