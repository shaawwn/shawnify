
function getCurrentUser(accessToken, setUser) {

    fetch(`https://api.spotify.com/v1/me`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then((response) => response.json())
    .then((data) => {
        // console.log("USER DATA", data)
        setUser(data)
    })
}

function getTopTracks(artistID, accessToken, setTopTracks) {
    fetch(`https://api.spotify.com/v1/artists/${artistID}/top-tracks?market=US`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    }).then((response) => response.json())
    .then((data) => {
        // console.log("Top tracks in utils", data)
        setTopTracks(data.tracks)
    })
}

function getAlbums(artistID, accessToken, setAlbums) {
    fetch(`https://api.spotify.com/v1/artists/${artistID}/albums`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    }).then((response) => response.json())
    .then((data) => {
        // console.log("Album data in utils", data)
        setAlbums(data)
    })
}

module.exports = {
    getTopTracks,
    getAlbums,
    getCurrentUser
}
