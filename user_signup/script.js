document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const formObject = {};
    formData.forEach((value, key) => { formObject[key] = value; });

    fetch('/submit-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formObject),
    })
    .then(response => response.json())
    .then(data => {
        // Display QR Code in a popup
        const qrPopup = window.open("", "QR Code", "width=400,height=400");
        qrPopup.document.write(`<img src="${data.qrCodeUrl}" alt="QR Code" style="width:100%;height:100%;">`);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error submitting form');
    });
});
