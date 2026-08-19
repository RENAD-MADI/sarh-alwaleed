



document.getElementById('ownerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    console.log('Form Data:', formObject);
    const existingData = JSON.parse(sessionStorage.getItem('ownerFormData')) || {};

    const mergedData = { ...existingData, ...formObject };
    console.log('Merged Data:', mergedData);

    sessionStorage.setItem('ownerFormData', JSON.stringify(mergedData));

    window.location.href = 'subcontract2.html';

});





document.getElementById('agentPhone').addEventListener('input', function(event) {
    const value = event.target.value;
    const idRegex = /^05\d*$/;
    if (value.length > 1 && !idRegex.test(value)) {
        alert('يجب أن يبدأ رقم الجوال بـ 05 ويحتوي على أرقام فقط.');
        event.target.value = value.slice(0, -1);
    }
});


document.getElementById('agentName').addEventListener('input', function(event) {
    const nameRegex = /^[\u0621-\u064A\u0660-\u0669a-zA-Z\s]*$/;
    const value = event.target.value;
    const lastChar = value.slice(-1);
    if (!nameRegex.test(lastChar)) {
        alert('يجب أن يحتوي اسم المالك على حروف فقط (عربي أو إنجليزي).');
        event.target.value = value.slice(0, -1);
    }
});



document.getElementById('agentID').addEventListener('input', function(event) {
    const idRegex = /^1\d*$/;
    const value = event.target.value;
    const lastChar = value.slice(-1);
    if (!idRegex.test(value) || isNaN(lastChar)) {
        alert('يجب أن يبدأ رقم الهوية بـ 1 ويحتوي على أرقام فقط.');
        event.target.value = value.slice(0, -1);
    }
});