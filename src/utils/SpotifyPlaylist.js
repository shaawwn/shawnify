// api methods for playlist management

// Playlists
// Get Playlist
// Change Playlist Details
// Get Playlist Items
// Update Playlist Items
// Add Items to Playlist
// Remove Playlist Items
// Get Current User's Playlists
// Get User's Playlists
// Create Playlist
// Get Featured Playlists
// Get Category's Playlists
// Get Playlist Cover Image
// Add Custom Playlist Cover Image
// S

class SpotifyPlaylist {
    constructor(accessToken, playlistID) {
        this.accessToken = accessToken
        this.playlistID = playlistID
        this.tracks = []
    }

    getPlaylist(setter) {
        fetch(`https://api.spotify.com/v1/playlists/${this.playlistID}`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        }).then((response) => response.json())
        .then((data) => {
            console.log("Setting playlist in api", data)
            setter(data)
            this.tracks = this.tracks.concat(data.tracks.items)
            console.log("PLAYLIST TRACKS", this.tracks)
        }).catch((data) => {
            console.log("There was an error fetching playlist", data)
        })
    }

    changePlaylistDetails(setter) {
        // TODO
    }

    getPlaylistItems(setter) {
        // TODO
    }

    updatePlaylistItems(setter) {
        // TODO
    }

    addItemsToPlaylist(setter) {
        // TODO
    }

    removeItemsFromPlaylist(setter) {
        // TODO
    }

    getCUrrentUsersPlaylists(setter) {
        // TOOD
    }

    getUsersPlaylist(setter) {
        // TODO
    }

    createPlaylist(setter) {
        // TODO
    }

    getFeaturedPlaylists(setter) {
        // TODO
    }

    getCategoryPlaylist(setter) {
        // TODO
    }

    getPlaylistCoverImage(setter) {
        // TODO
    }

    addCustomPlaylistCoverImage(setter) {
        // TODO
    }
}

export default SpotifyPlaylist