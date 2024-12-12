var login_uri = 'http://127.0.0.1:3000/login.html';


document.querySelector('.user-button').addEventListener('click', getUserDetails);

function getUserDetails() {

    var tokens = JSON.parse(localStorage.getItem("tokens"));

    fetch("https://api.spotify.com/v1/me" ,{
        method : "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + tokens.access_token
        }
    })
    .then(response => {
        if(!response.ok){
            throw new Error('Failed to fetch the user profile details');
        }
        return response.json();
    })
    .then( data  => {
        if(data.error && data.error === 401){
            console.log("Token expired");
        } else {
            var user_details = data;
            localStorage.setItem("user", JSON.stringify(user_details));
            console.log(user_details);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

document.querySelector('.artists-button').addEventListener('click', function() { 
    //getTop5("artists"); 
    localStorage.setItem("top5_button_was_pressed", "artists");
    window.location.href = 'top5Artists.html';
});
document.querySelector('.tracks-button').addEventListener('click', function() { 
    // getTop5("tracks"); 
    localStorage.setItem("top5_button_was_pressed", "tracks");
    window.location.href = 'top5Artists.html';
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


