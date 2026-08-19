/**
 * Final-step submission shared by the residential, commercial and sublease forms.
 *
 * The earlier version fired a bare async call from an inline `onclick` with no
 * disabled state and no visible failure path: a network error only reached the
 * console, so a customer saw nothing happen and clicked again, and every click
 * created another contract.
 */
(function initContractSubmit(global) {
  'use strict';

  var utils = global.AppUtils;
  var ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
  var MAX_FILE_BYTES = 5 * 1024 * 1024;

  function statusRegion(form) {
    var existing = document.getElementById('submitStatus');
    if (existing) return existing;

    var region = document.createElement('div');
    region.id = 'submitStatus';
    region.hidden = true;
    if (form && form.parentNode) form.parentNode.insertBefore(region, form.nextSibling);
    return region;
  }

  /**
   * Validates the chosen files for one field.
   * Returns an error message, or null when the selection is acceptable.
   */
  function validateFiles(field, files) {
    if (!files || files.length === 0) {
      return 'يرجى إرفاق جميع المستندات المطلوبة: ' + field.label;
    }
    for (var i = 0; i < files.length; i += 1) {
      if (ALLOWED_TYPES.indexOf(files[i].type) === -1) {
        return 'صيغة الملف غير مدعومة في "' + field.label + '". المسموح: JPG أو PNG أو PDF.';
      }
      if (files[i].size > MAX_FILE_BYTES) {
        return 'حجم الملف في "' + field.label + '" يتجاوز 5 ميجابايت.';
      }
    }
    return null;
  }

  /**
   * Builds and sends the multi-step payload.
   *
   * @param {object} options
   * @param {string} options.endpoint API path, e.g. '/realEsate/add'
   * @param {Array<{name: string, label: string}>} options.fileFields required attachments
   * @param {string} options.successPage page to show once the API confirms
   */
  function submitContract(options) {
    var form = document.getElementById('ownerForm');
    var button = document.getElementById('submitButton');
    var status = statusRegion(form);

    var storedData = sessionStorage.getItem('ownerFormData');
    if (!storedData) {
      utils.setStatus(
        status,
        'error',
        'لم يتم العثور على بيانات النموذج. يرجى البدء من الخطوة الأولى.'
      );
      return;
    }

    var payload = new FormData();

    for (var i = 0; i < options.fileFields.length; i += 1) {
      var field = options.fileFields[i];
      var input = document.getElementById(field.name);
      var files = input ? input.files : null;

      var problem = validateFiles(field, files);
      if (problem) {
        utils.setStatus(status, 'error', problem);
        return;
      }
      for (var f = 0; f < files.length; f += 1) {
        payload.append(field.name, files[f]);
      }
    }

    var data = JSON.parse(storedData);
    Object.keys(data).forEach(function appendField(key) {
      payload.append(key, data[key]);
    });

    if (button) {
      button.disabled = true;
      button.dataset.originalText = button.textContent;
      button.textContent = 'جارٍ الإرسال…';
    }
    utils.setStatus(status, 'loading', 'جارٍ رفع البيانات والمستندات، يرجى الانتظار…');

    global.axios
      .post(global.API.url(options.endpoint), payload)
      .then(function onSuccess() {
        // The submission is stored; clear the draft so a refresh cannot resend it.
        sessionStorage.removeItem('ownerFormData');
        global.location.href = options.successPage;
      })
      .catch(function onFailure(error) {
        if (button) {
          button.disabled = false;
          button.textContent = button.dataset.originalText || 'ارسل النموذج';
        }
        utils.setStatus(status, 'error', utils.errorMessage(error));
      });
  }

  global.ContractSubmit = { submitContract: submitContract };
})(window);
