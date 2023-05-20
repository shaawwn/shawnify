import {useRef} from 'react';
/**
 * 
 * setter is a setState function that is passed from react within a component, ex. getUserDetails(setUserDetails) where setUserDetails is a setter
 * 
 * MAYBE MOVE THIS CLASS TO BE SEPERATE HOOKS eg 
 * usePlaylists
 * useTracks
 * useSearch etc
 * that all call the spotify api for their respective items instead of one giant class.
 */
class SpotifyApi {
    constructor(accessToken) {
        this.accessToken = accessToken
    }

    getUserDetails(setter) {
        // fetch user details and 
        fetch(`https://api.spotify.com/v1/me`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
        .then((data) => {
            // console.log('user data in class: ', data)
            setter(data)
        })
    }
    
    getCurrentUserPlaylists(setter) {
        // by default returns users first 20 playlists, if there are more, they are linked in the 'next' url as data.next
        // I BELIEVE that this is by more recently made

        fetch(`https://api.spotify.com/v1/me/playlists`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
        .then((data) => {
            // console.log('current user playlists from class', data)
            setter(data.items)
        })
    }

    /**
     * For Recently Played, only TRACKS/Artists are actually returned with API, but I think you can get the parent album/playlist using whatever the recent tracks are, and jsut create a set of unique albums/playlists so you dont have overlap
     */
    getRecentlyPlayedTracks(setter) {
        fetch(`https://api.spotify.com/v1/me/player/recently-played`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
        .then((data) => {
            console.log("Recently played: ", data)
            setter(data.items)

        })
    }

    getRecentlyPlayedAlbums() {
        //
    }

    getRecentlyPlayedPlaylists(){

    }
}

export default SpotifyApi