fetch("http://localhost:5000/api/emergencies", {
    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify({
        patientId: "PATIENT-001",
        latitude: 16.3067,
        longitude: 80.4365,
        symptoms: "Emergency request"
    })
})
.then(response => response.json())
.then(data => {

    console.log(data);

});

