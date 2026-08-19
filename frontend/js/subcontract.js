

document.getElementById('ownerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    sessionStorage.setItem('ownerFormData', JSON.stringify(formObject));

    window.location.href = 'subcontract1.html';
});

document.getElementById('ownerID').addEventListener('input', function(event) {
    const idRegex = /^1\d*$/;
    const value = event.target.value;
    const lastChar = value.slice(-1);
    if (!idRegex.test(value) || isNaN(lastChar)) {
        alert('يجب أن يبدأ رقم الهوية بـ 1 ويحتوي على أرقام فقط.');
        event.target.value = value.slice(0, -1);
    }
});



document.getElementById('ownerPhone').addEventListener('input', function(event) {
    const value = event.target.value;
    const phoneRegex = /^05\d*$/;
    if (value.length > 1 && !phoneRegex.test(value)) {
        alert('يجب أن يبدأ رقم الجوال بـ 05 ويحتوي على أرقام فقط.');
        event.target.value = value.slice(0, -1);
    }
});

document.getElementById('ownerName').addEventListener('input', function(event) {
    const value = event.target.value;
    const nameRegex = /^[a-zA-Z\u0600-\u06FF\s]*$/;
    if (!nameRegex.test(value)) {
        alert('يمكنك إدخال الاسم باللغة العربية أو الإنجليزية فقط.');
        event.target.value = value.slice(0, -1);
    }
});




document.getElementById('clientID').addEventListener('input', function(event) {
    const idRegex = /^1\d*$/;
    const value = event.target.value;
    const lastChar = value.slice(-1);
    if (!idRegex.test(value) || isNaN(lastChar)) {
        alert('يجب أن يبدأ رقم الهوية بـ 1 ويحتوي على أرقام فقط.');
        event.target.value = value.slice(0, -1);
    }
});



document.getElementById('clientPhone').addEventListener('input', function(event) {
    const value = event.target.value;
    const phoneRegex = /^05\d*$/;
    if (value.length > 1 && !phoneRegex.test(value)) {
        alert('يجب أن يبدأ رقم الجوال بـ 05 ويحتوي على أرقام فقط.');
        event.target.value = value.slice(0, -1);
    }
});

document.getElementById('clientName').addEventListener('input', function(event) {
    const value = event.target.value;
    const nameRegex = /^[a-zA-Z\u0600-\u06FF\s]*$/;
    if (!nameRegex.test(value)) {
        alert('يمكنك إدخال الاسم باللغة العربية أو الإنجليزية فقط.');
        event.target.value = value.slice(0, -1);
    }
});
// Check sessionStorage data on page load
document.addEventListener('DOMContentLoaded', function() {
    const storedData = sessionStorage.getItem('OwnerData');
    if (storedData) {
        console.log('Stored data in sessionStorage:', JSON.parse(storedData));
    }
});