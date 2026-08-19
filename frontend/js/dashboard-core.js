/**
 * Shared behaviour for the three contract dashboards.
 *
 * Each dashboard keeps its own column templates (they differ completely) but
 * gets auth, paging, attachment rendering and status messaging from here.
 */
(function initDashboardCore(global) {
  'use strict';

  var utils = global.AppUtils;

  /**
   * Renders uploaded attachments into a container.
   * URLs come from the database, so they are validated and escaped rather than
   * dropped straight into an `src` or an inline `onclick`.
   */
  function renderFiles(files, container) {
    if (!container) return;

    if (!files || files.length === 0) {
      container.textContent = 'لا يوجد ملف مرفق';
      return;
    }

    container.innerHTML = '';
    files.forEach(function renderOne(file) {
      var href = utils.safeUrl(file && file.secure_url);
      if (!href) return;

      if (/\.pdf($|\?)/i.test(href)) {
        var link = document.createElement('a');
        link.href = href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'btn btn-info p-3';
        link.textContent = 'فتح PDF';
        container.appendChild(link);
        return;
      }

      var img = document.createElement('img');
      img.src = href;
      img.alt = file.originalName ? 'مرفق: ' + file.originalName : 'مرفق العقد';
      img.loading = 'lazy';
      img.style.width = '100%';
      img.style.height = 'auto';
      container.appendChild(img);
    });
  }

  /**
   * Wires the previous/next buttons for a dashboard.
   *
   * The old version incremented the page with no upper bound and compared the
   * page number against the *record* count, so "next" stayed enabled forever
   * and paging past the end silently rendered an empty screen.
   */
  function createPager(options) {
    var state = { page: 1, totalPages: 1 };

    var prevButton = document.getElementById('prevButton');
    var nextButton = document.getElementById('nextButton1');
    var label = document.getElementById('objectNumber');
    var status = document.getElementById('dashboardStatus');

    function paint() {
      if (label) label.innerText = ' ' + state.page + ' / ' + state.totalPages;
      if (prevButton) prevButton.disabled = state.page <= 1;
      if (nextButton) nextButton.disabled = state.page >= state.totalPages;
    }

    function go(page) {
      utils.setStatus(status, 'loading', 'جارٍ تحميل البيانات…');
      if (prevButton) prevButton.disabled = true;
      if (nextButton) nextButton.disabled = true;

      return options
        .load(page)
        .then(function onLoaded(result) {
          state.page = page;
          state.totalPages = Math.max(1, result.totalPages || 1);

          if (!result.items || result.items.length === 0) {
            utils.setStatus(status, 'empty', 'لا توجد بيانات لعرضها حتى الآن.');
          } else {
            utils.clearStatus(status);
          }
          paint();
        })
        .catch(function onFailed(error) {
          if (utils.handleAuthError(error)) return;
          utils.setStatus(status, 'error', utils.errorMessage(error));
          paint();
        });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function onNext() {
        if (state.page < state.totalPages) go(state.page + 1);
      });
    }
    if (prevButton) {
      prevButton.addEventListener('click', function onPrev() {
        if (state.page > 1) go(state.page - 1);
      });
    }

    return { go: go, state: state };
  }

  /**
   * Boots a dashboard: confirms the visitor is signed in, then loads page 1.
   * Nothing renders until `/auth/me` succeeds.
   */
  function startDashboard(load) {
    document.addEventListener('DOMContentLoaded', function onReady() {
      var pager = createPager({ load: load });
      utils
        .requireAdmin()
        .then(function onAuthorised(user) {
          var slot = document.getElementById('currentUser');
          if (slot) slot.textContent = user.name + ' (' + user.role + ')';
          return pager.go(1);
        });
    });
  }

  /** Signs the current admin out and returns to the login page. */
  function bindLogout() {
    document.addEventListener('DOMContentLoaded', function onReady() {
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
  }

  bindLogout();

  global.DashboardCore = {
    esc: utils.escapeHtml,
    renderFiles: renderFiles,
    createPager: createPager,
    startDashboard: startDashboard,
  };
})(window);
