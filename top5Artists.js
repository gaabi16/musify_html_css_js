
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
                    image: artist.images.length > 0 ? artist.images[1].url : ''
                };
            });
            localStorage.setItem("artists", JSON.stringify(top_artists));
            manipulateArtists();
            console.log('Top Artists:', top_artists);
        } else if (type === 'tracks') {
            var top_tracks = data.items.map(track => {
                return {
                    name: track.name,
                    image: track.images.length > 0 ? track.images[1].url : ''
                };
            });
            localStorage.setItem("tracks", JSON.stringify(top_tracks));
            manipulateArtists();
            console.log('Top Songs:', top_tracks);
        } else {
            console.log('Unknown type:', type);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function manipulateArtists() {
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
            console.log("n ai imagine aia e");
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
