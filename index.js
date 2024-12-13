var login_uri = 'http://127.0.0.1:3000/login.html';


document.querySelector('.user-button').addEventListener('click', getUserDetails);

function getUserDetails() {
    var userDiv = document.getElementById("userInfo");

    if (userDiv.classList.contains('user-details')) {
        userDiv.classList.remove('user-details');
        userDiv.innerHTML = "This is Musify!";
    } else {
        var tokens = JSON.parse(localStorage.getItem("tokens"));

        fetch("https://api.spotify.com/v1/me", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tokens.access_token
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch the user profile details');
            }
            return response.json();
        })
        .then(data => {
            if (data.error && data.error === 401) {
                console.log("Token expired");
            } else {
                var user_details = data;
                localStorage.setItem("user", JSON.stringify(user_details));
                manipulateUserData();
                console.log(user_details);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

function manipulateUserData() {
    var user_details = JSON.parse(localStorage.getItem("user"));
    var userDiv = document.getElementById("userInfo");

    userDiv.innerHTML = "";
    userDiv.classList.add("user-details");

    var userHeader = document.createElement('h2');
    userHeader.textContent = "USER DETAILS";
    userHeader.style.textAlign = "center";
    userHeader.style.fontSize = "2em";
    userHeader.style.fontFamily = "Cardo, serif";
    userHeader.style.letterSpacing = "0.1em";
    userDiv.appendChild(userHeader);

    var userList = document.createElement('ul');
    userList.style.listStyleType = "none";
    userList.style.fontStyle = "italic";
    userList.style.fontSize = "1em";
    userList.style.fontFamily = "Cardo, serif";
    userList.style.marginTop = "10px";

    var listItem_country = document.createElement('li');
    listItem_country.textContent = "Country: " + user_details.country;
    var listItem_name = document.createElement('li');
    listItem_name.textContent = "Name: " + user_details.display_name;
    var listItem_email = document.createElement('li');
    listItem_email.textContent = "Email: " + user_details.email;

    userList.appendChild(listItem_country);
    userList.appendChild(listItem_name);
    userList.appendChild(listItem_email);

    userDiv.appendChild(userList);
}

document.querySelector('.artists-button').addEventListener('click', function() { 
    localStorage.setItem("top5_button_was_pressed", "artists");
    window.location.href = 'top5.html';
});
document.querySelector('.tracks-button').addEventListener('click', function() { 
    localStorage.setItem("top5_button_was_pressed", "tracks");
    window.location.href = 'top5.html';
});

// document.getElementById('searchInput').addEventListener('input', function (event) {
//     const query = event.target.value.trim(); 
//     if (query.length > 0) {                
//         searchItems(query);
//     }
// });

document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var query = document.getElementById('searchInput').value.trim();
    if (query.length > 0) {
        localStorage.setItem("search_query", query);
        window.location.href = 'searchResults.html';
    }
});

document.querySelector('.logout-button').addEventListener('click', logout);

function logout() {
    localStorage.clear();
    console.log("Logged out successfully");
    window.location.href = login_uri;
}


