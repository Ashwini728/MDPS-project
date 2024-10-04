// Registration form submission
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:4000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: fullName, password, email }), // Send data as JSON
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registration successful!');
            // Redirect to login or another page as needed
        } else {
            alert(`Registration failed: ${data.error}`);
        }
    } catch (error) {
        alert('An error occurred during registration. Check console for details.');
        console.error('Error:', error);
    }
});

// Login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }), // Send data as JSON
        });

        const data = await response.json();
        if (response.ok) {
            alert('Login successful!');
            // Redirect to another page as needed
        } else {
            alert(`Login failed: ${data.error}`);
        }
    } catch (error) {
        alert('An error occurred during login. Check console for details.');
        console.error('Error:', error);
    }
});
