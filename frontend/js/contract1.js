document.getElementById('ownerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    sessionStorage.setItem('ownerFormData', JSON.stringify(formObject));

    window.location.href = 'contract2.html';
});

document.getElementById('name').addEventListener('input', function(event) {
    const nameRegex = /^[\u0621-\u064A\u0660-\u0669a-zA-Z\s]*$/;
    const value = event.target.value;
    const lastChar = value.slice(-1);
    if (!nameRegex.test(lastChar)) {
        alert('يجب أن يحتوي اسم المالك على حروف فقط (عربي أو إنجليزي).');
        event.target.value = value.slice(0, -1);
    }
});

document.getElementById('num').addEventListener('input', function(event) {
    const idRegex = /^1\d*$/;
    const value = event.target.value;
    const lastChar = value.slice(-1);
    if (!idRegex.test(value) || isNaN(lastChar)) {
        alert('يجب أن يبدأ رقم الهوية بـ 1 ويحتوي على أرقام فقط.');
        event.target.value = value.slice(0, -1);
    }
});

document.getElementById('IBAN').addEventListener('input', function(event) {
    const value = event.target.value;
    const ibanRegex = /^SA\d*$/;
    if (value.length > 1 && !ibanRegex.test(value)) {
        alert('يجب أن يبدأ رقم الايبان يبدء ب SA  ويحتوي على أرقام فقط.');
        event.target.value = value.slice(0, -1);
    }
});

document.getElementById('ownerPhone').addEventListener('input', function(event) {
    const value = event.target.value;
    const idRegex = /^05\d*$/;
    if (value.length > 1 && !idRegex.test(value)) {
        alert('يجب أن يبدأ رقم الجوال بـ 05 ويحتوي على أرقام فقط.');
        event.target.value = value.slice(0, -1);
    }
});

document.getElementById('ownerAgencyPhone').addEventListener('input', function(event) {
    const value = event.target.value;
    const idRegex = /^05\d*$/;
    if (value.length > 1 && !idRegex.test(value)) {
        alert('يجب أن يبدأ رقم الجوال بـ 05 ويحتوي على أرقام فقط.');
        event.target.value = value.slice(0, -1);
    }
});