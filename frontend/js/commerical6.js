/** Commercial contract — final step: attachments and submission. */
function storeData() {
  ContractSubmit.submitContract({
    endpoint: '/commercial/add',
    successPage: 'commerical7.html',
    fileFields: [
      { name: 'owner', label: 'صورة هوية المالك' },
      { name: 'client', label: 'صورة هوية المستأجر' },
      { name: 'sak', label: 'صورة صك الملكية' },
      { name: 'commercialImage', label: 'صورة السجل التجاري' },
      { name: 'agency', label: 'صورة الوكالة الشرعية' },
      { name: 'agent', label: 'صورة هوية الوكيل الشرعي' },
    ],
  });
}
