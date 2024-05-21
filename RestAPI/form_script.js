const clientId = 'YOUR_CLIENT_ID';
const redirectUri = 'https://yourusername.github.io/oauth-callback';

document.getElementById('loginBtn').addEventListener('click', () => {
    const authorizationUrl = `https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
    window.location.href = authorizationUrl;
});

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        const tokenResponse = await fetch('https://login.salesforce.com/services/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'grant_type': 'authorization_code',
                'code': code,
                'client_id': clientId,
                'client_secret': 'YOUR_CLIENT_SECRET',
                'redirect_uri': redirectUri
            })
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('searchForm').style.display = 'block';

        document.getElementById('searchForm').addEventListener('submit', async function (event) {
            event.preventDefault();
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const mobilePhone = document.getElementById('mobilePhone').value;
            const company = document.getElementById('company').value;

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

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Error ${response.status}: ${errorText}`);
                }

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
    }
};
