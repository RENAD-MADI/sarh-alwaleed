



document.getElementById('dataForm').addEventListener('submit', function(event) {
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
  
    window.location.href = 'commerical6.html';
});

