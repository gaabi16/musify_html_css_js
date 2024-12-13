
window.addEventListener('load', function () {
    var string = localStorage.getItem('top5_button_was_pressed');
    if (string) {
        getTop5(string);
    }
});

function getTop5(type) {
    var tokens = JSON.parse(localStorage.getItem("tokens"));

    fetch('https://api.spotify.com/v1/me/top/' + type, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + tokens.access_token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch the top 5 ' + type + ': ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (type === 'artists') {
            var top_artists = data.items.map(artist => {
                return {
                    name: artist.name,
                    image: artist.images?.[1]?.url || ''
                };
            });
            console.log('Top Artists:', top_artists);
            localStorage.setItem("artists", JSON.stringify(top_artists));
            manipulateArtists();
        } else if (type === 'tracks') {
            var top_tracks = data.items.map(track => {
                return {
                    name: track.album.name,
                    image: track.album.images?.[1]?.url || ''
                };
            });
            console.log('Top Songs:', top_tracks);
            localStorage.setItem("tracks", JSON.stringify(top_tracks));
            manipulateTracks();
        } else {
            console.log('Unknown type:', type);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function manipulateTracks() {
    document.querySelector("h1").textContent = "TOP 5 TRACKS";
    document.querySelector("h1").style.marginTop = "2rem";

    var tracks = JSON.parse(localStorage.getItem("tracks"));
    var trackContainer = document.getElementById('output_top5');
    trackContainer.innerHTML = '';

    for (var i = 15; i < 20; i++) {
        var trackCard = document.createElement('div');
        trackCard.style.display = 'inline-block';
        trackCard.style.textAlign = 'center';
        trackCard.style.margin = '10px';
        trackCard.style.padding = '10px';
        trackCard.style.border = '1px solid #ddd';
        trackCard.style.borderRadius = '8px';
        trackCard.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        trackCard.style.width = '150px';

        var img = document.createElement('img');
        img.style.width = '100px';
        img.style.height = '100px';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';
        if (tracks[i].image) {
            img.src = tracks[i].image;
        } else {
            img.src = '';
        }

        var trackName = document.createElement('div');
        trackName.textContent = tracks[i].name;
        trackName.style.marginTop = '10px';
        trackName.style.fontWeight = 'bold';
        trackName.style.color = '#333';

        trackCard.appendChild(img);
        trackCard.appendChild(trackName);

        trackContainer.appendChild(trackCard);
    }
}

function manipulateArtists() {
    document.querySelector("h1").textContent = "TOP 5 ARTISTS";
    document.querySelector("h1").style.marginTop = "2rem";

    var artists = JSON.parse(localStorage.getItem("artists"));
    var artistContainer = document.getElementById('output_top5');
    artistContainer.innerHTML = '';

    for (var i = 0; i < 5; i++) {
        var artistCard = document.createElement('div');
        artistCard.style.display = 'inline-block';
        artistCard.style.textAlign = 'center';
        artistCard.style.margin = '10px';
        artistCard.style.padding = '10px';
        artistCard.style.border = '1px solid #ddd';
        artistCard.style.borderRadius = '8px';
        artistCard.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        artistCard.style.width = '150px';

        var img = document.createElement('img');
        img.style.width = '100px';
        img.style.height = '100px';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';
        if (artists[i].image) {
            img.src = artists[i].image;
        } else {
            img.src = '';
        }

        var artistName = document.createElement('div');
        artistName.textContent = artists[i].name;
        artistName.style.marginTop = '10px';
        artistName.style.fontWeight = 'bold';
        artistName.style.color = '#333';

        artistCard.appendChild(img);
        artistCard.appendChild(artistName);

        artistContainer.appendChild(artistCard);
    }
}
