document.getElementById('searchForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const mobilePhone = document.getElementById('mobilePhone').value;
    const company = document.getElementById('company').value;

    const accessToken = '6Cel800D09000000HnAr888J8000000sXxeK44sLVqG26n3MsTvj86zay8VnDaTxwIaDg71kvcfFdFuXIHMEnT6geDHCYfbXt6BH3ltmDxZ'; // Use the obtained access token

    try {
        const response = await fetch('https://regressiondc-dev-ed.lightning.force.com/services/apexrest/dupcheck/dc3Api/search', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                object: "Lead",
                searchFields: {
                    FirstName: firstName,
                    LastName: lastName,
                    Email: email,
                    MobilePhone: mobilePhone,
                    Company: company
                }
            })
        });
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error('Error:', error);
    }
});

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (data.length === 0) {
        resultsDiv.innerHTML = '<p>No records found.</p>';
    } else {
        data.forEach(record => {
            const recordDiv = document.createElement('div');
            recordDiv.innerHTML = `
                <p>Name: ${record.FirstName} ${record.LastName}</p>
                <p>Email: ${record.Email}</p>
                <p>Mobile Phone: ${record.MobilePhone}</p>
                <p>Company: ${record.Company}</p>
            `;
            resultsDiv.appendChild(recordDiv);
        });
    }
}
