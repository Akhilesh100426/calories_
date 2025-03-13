function validateLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const error = document.getElementById("loginError");

    error.innerText = "";

    if (!username || !password) {
        error.innerText = "Please enter both username and password.";
        return;
    }

    // Fetch user data from det.json
    fetch("det.json")
        .then(response => response.json())  // Read JSON properly
        .then(data => {
            const users = data.names;  // Get user list
            const isValidUser = users.some(user => user.user === username && user.password === password);

            if (isValidUser) {
                alert("Login successful!");
                localStorage.setItem("loggedIn", "true");  // Store login status
                window.location.href = "home.html";  // Redirect to home page
            } else {
                error.innerText = "Invalid username or password.";
            }
        })
        .catch(err => {
            console.error("Error loading user data:", err);
            error.innerText = "Unable to verify login. Please try again.";
        });
}
