window.addEventListener('load', function () {
    var query = localStorage.getItem('search_query');
    if (query) {
        searchItems(query);
    }
});


function searchItems(query, types = ['album', 'artist', 'track'], market = '', limit = 10, offset = 0) {

    var tokens = JSON.parse(localStorage.getItem("tokens"));
    
    var url = "https://api.spotify.com/v1/search?" +
          "q=" + encodeURIComponent(query) +
          "&type=" + types.join('%2C') +
          "&limit=" + limit +
          "&offset=" + offset;

    if (market) {
        url += "&market=" + encodeURIComponent(market);
    }

    console.log("The url is ----- " + url);

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + tokens.access_token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch search results, status: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        var albumNames = [];
        var artistNames = [];
        var trackNames = [];

        if (data.albums && data.albums.items) {
            albumNames = data.albums.items.map(album => album.name);
        }

        if (data.artists && data.artists.items) {
            artistNames = data.artists.items.map(artist => artist.name);
        }

        if (data.tracks && data.tracks.items) {
            trackNames = data.tracks.items.map(track => track.name);
        }

        var searchResults = {
            albums: albumNames,
            artists: artistNames,
            tracks: trackNames
        };

        localStorage.setItem('search_results', JSON.stringify(searchResults));

        console.log('Albums:', searchResults['albums']);
        console.log('Artists:', searchResults['artists']);
        console.log('Tracks:', searchResults['tracks']);

        displayResults(searchResults);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displayResults(searchResults) {
    const output = document.getElementById('output');
    output.innerHTML = '';

    const albumsDiv = document.createElement('div');
    const albumsHeader = document.createElement('h2');
    albumsHeader.textContent = 'Albums';
    albumsDiv.appendChild(albumsHeader);

    const albumsList = document.createElement('ul');
    searchResults.albums.forEach(album => {
        const li = document.createElement('li');
        li.textContent = album;
        albumsList.appendChild(li);
    });
    albumsDiv.appendChild(albumsList);
    output.appendChild(albumsDiv);

    const artistsDiv = document.createElement('div');
    const artistsHeader = document.createElement('h2');
    artistsHeader.textContent = 'Artists';
    artistsDiv.appendChild(artistsHeader);

    const artistsList = document.createElement('ul');
    searchResults.artists.forEach(artist => {
        const li = document.createElement('li');
        li.textContent = artist;
        artistsList.appendChild(li);
    });
    artistsDiv.appendChild(artistsList);
    output.appendChild(artistsDiv);

    const tracksDiv = document.createElement('div');
    const tracksHeader = document.createElement('h2');
    tracksHeader.textContent = 'Tracks';
    tracksDiv.appendChild(tracksHeader);

    const tracksList = document.createElement('ul');
    searchResults.tracks.forEach(track => {
        const li = document.createElement('li');
        li.textContent = track;
        tracksList.appendChild(li);
    });
    tracksDiv.appendChild(tracksList);
    output.appendChild(tracksDiv);
}