


function getCurrentUserPlaylists(accessToken, setter) {
    fetch(`https://api.spotify.com/v1/me/playlists`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    }).then((response) => response.json())
    .then((data) => {
        // console.log('current user playlists', data)
        setter(data)
    })
}


export {
    getCurrentUserPlaylists
}