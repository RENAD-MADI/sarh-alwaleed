/**
 * Shared frontend configuration and helpers.
 *
 * Every API call in the site goes through `API.url()`. Endpoints used to be
 * hardcoded in a dozen files, which is how the site kept posting to a dead host
 * long after that backend disappeared. Change the base in one place now.
 */
(function initConfig(global) {
  'use strict';

  // Served by the API process in normal operation, so same-origin is correct.
  // A page opened straight from disk falls back to a local dev server.
  var API_BASE_URL =
    global.location.protocol === 'file:' ? 'http://localhost:5000' : '';

  var API = {
    baseUrl: API_BASE_URL,

    /** Builds an absolute URL for an API path. */
    url: function url(path) {
      var suffix = path.charAt(0) === '/' ? path : '/' + path;
      return API_BASE_URL + suffix;
    },

    /** Login page used whenever a protected call comes back 401. */
    loginPage: 'login.html',
  };


  /**
   * Bank details shown on the payment and confirmation pages.
   *
   * PLACEHOLDERS ONLY — this file is committed to a public repository, so no
   * real account number or IBAN may live here. Set the real values on the
   * deployed copy (or inject them at build/deploy time) before going live.
   * Until they are set, the pages show a "contact us" fallback instead of a
   * misleading number.
   */
  var BANK = {
    bankName: 'BANK_NAME_HERE',
    accountNumber: 'YOUR_ACCOUNT_NUMBER_HERE',
    iban: 'SA00 0000 0000 0000 0000 0000',
  };

  var BANK_PLACEHOLDERS = [
    'BANK_NAME_HERE',
    'YOUR_ACCOUNT_NUMBER_HERE',
    'SA00 0000 0000 0000 0000 0000',
  ];

  /**
   * Fills any `[data-bank]` element with the configured value.
   * While the placeholders are still in place the page tells the visitor to
   * contact the office rather than presenting a fake account number.
   */
  function renderBankDetails() {
    var nodes = document.querySelectorAll('[data-bank]');
    for (var i = 0; i < nodes.length; i += 1) {
      var key = nodes[i].getAttribute('data-bank');
      var value = BANK[key];
      var unset = !value || BANK_PLACEHOLDERS.indexOf(value) !== -1;
      nodes[i].textContent = unset ? 'يرجى التواصل معنا لطلب بيانات التحويل' : value;
      if (unset) nodes[i].classList.add('bank-unset');
    }
  }

  document.addEventListener('DOMContentLoaded', renderBankDetails);

  if (global.axios) {
    // The admin session is an httpOnly cookie; without this it is never sent.
    global.axios.defaults.withCredentials = true;
  }

  /**
   * Escapes text before it is placed into an innerHTML string.
   * Contract records are attacker-supplied: a tenant could put a <script> tag
   * in a name field and it would run in an admin's browser without this.
   */
  function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** Escapes a value for use inside a quoted HTML attribute such as src/href. */
  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
  }

  /** Blocks `javascript:` and other non-http(s) schemes in generated links. */
  function safeUrl(value) {
    var raw = String(value == null ? '' : value).trim();
    if (/^https?:\/\//i.test(raw) || raw.charAt(0) === '/') return raw;
    return '';
  }

  /** Shows an accessible status message in a page region. */
  function setStatus(container, kind, text) {
    if (!container) return;
    var classes = {
      loading: 'alert alert-info',
      empty: 'alert alert-secondary',
      error: 'alert alert-danger',
    };
    container.className = classes[kind] || 'alert alert-secondary';
    container.setAttribute('role', kind === 'error' ? 'alert' : 'status');
    container.textContent = text;
    container.hidden = false;
  }

  function clearStatus(container) {
    if (!container) return;
    container.hidden = true;
    container.textContent = '';
  }

  /**
   * Sends the visitor to the login page when a protected request is refused.
   * Returns true if it handled the error, so callers can stop.
   */
  function handleAuthError(error) {
    var status = error && error.response && error.response.status;
    if (status === 401) {
      global.location.href =
        API.loginPage + '?next=' + encodeURIComponent(global.location.pathname);
      return true;
    }
    return false;
  }

  /** Turns an axios failure into a message that is safe to show a visitor. */
  function errorMessage(error) {
    if (error && error.response && error.response.data && error.response.data.message) {
      return error.response.data.message;
    }
    if (error && error.request) {
      return 'تعذّر الاتصال بالخادم. تحقق من اتصالك بالإنترنت ثم أعد المحاولة.';
    }
    return 'حدث خطأ غير متوقع. يرجى إعادة المحاولة.';
  }

  /**
   * Guards a page that must not render for anonymous visitors.
   * Resolves with the signed-in user, or redirects and never resolves.
   */
  function requireAdmin() {
    return global.axios
      .get(API.url('/auth/me'))
      .then(function onSuccess(res) {
        return res.data.data;
      })
      .catch(function onFailure(error) {
        handleAuthError(error);
        return new Promise(function never() {});
      });
  }

  global.BANK = BANK;
  global.API = API;
  global.AppUtils = {
    escapeHtml: escapeHtml,
    escapeAttr: escapeAttr,
    safeUrl: safeUrl,
    setStatus: setStatus,
    clearStatus: clearStatus,
    handleAuthError: handleAuthError,
    errorMessage: errorMessage,
    requireAdmin: requireAdmin,
  };
})(window);
