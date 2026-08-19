/** Residential contract — final step: attachments and submission. */
function storeData() {
  ContractSubmit.submitContract({
    endpoint: '/realEsate/add',
    successPage: 'contract5.html',
    fileFields: [
      { name: 'owner', label: 'صورة هوية المالك' },
      { name: 'client', label: 'صورة هوية المستأجر' },
      { name: 'sak', label: 'صورة صك الملكية' },
      { name: 'family', label: 'صورة كرت العائلة أو المرافقين' },
      { name: 'agency', label: 'صورة الوكالة الشرعية' },
      { name: 'agent', label: 'صورة هوية الوكيل الشرعي' },
    ],
  });
}
