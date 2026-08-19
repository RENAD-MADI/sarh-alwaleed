/** Sublease contract — final step: attachments and submission. */
function storeData() {
  ContractSubmit.submitContract({
    endpoint: '/elbaten/add',
    successPage: 'subcontract5.html',
    fileFields: [
      { name: 'owner', label: 'صورة هوية المؤجر' },
      { name: 'client', label: 'صورة هوية المستأجر' },
      { name: 'agent', label: 'صورة هوية الوكيل' },
    ],
  });
}
