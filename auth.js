const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";

var redirect_uri = 'http://127.0.0.1:3000/index.html';
var login_uri = 'http://127.0.0.1:3000/login.html';

var client_id = "8b10ce8f154e4cc193ffd851b48ccaf7";
var client_secret = "cb179d13c7004ce585e1eee123399dde";

function requestAuthorization() {
    var url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(login_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-top-read";

    window.location.href = url;
}

document.querySelector('.login-button').addEventListener('click', function () {
    requestAuthorization();
});

function fetchAccessToken(code) {
    var body = "grant_type=authorization_code";	
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(login_uri);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    callAuthorizationApi(body);
}

function callAuthorizationApi(body){
    fetch(TOKEN , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
        },
        body: body
    }) 
    .then(response => {
        if(!response.ok){
            throw new Error('Failed to fetch the access token');
        }
        return response.json();
    })
    .then(data => {
        console.log("data is: ");
        console.log(JSON.stringify(data));
    
        localStorage.setItem("tokens", JSON.stringify(data));
        window.location.href = redirect_uri; 
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

window.addEventListener('load', function () {
    onPageLoad();
});

function onPageLoad() {
    if (window.location.search.length > 0) {
        handleRedirect();
    }
}

function handleRedirect() {
    let code = getCode();
    fetchAccessToken(code);
    window.history.pushState("", "", login_uri);
}

function getCode() {
    return window.location.search.split('code=')[1];
}
