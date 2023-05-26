import {useState, useEffect, useRef} from 'react';


/**
 * 
 * 
 * Hook for managing playlist. Similar methods to useTracks, but includes additional methods for playlist management, add/remove tracks, changing playlist details, etc
 * 
 * Playlists
Get Playlist
Change Playlist Details
Get Playlist Items
Update Playlist Items
Add Items to Playlist
Remove Playlist Items
Get Current User's Playlists
Get User's Playlists
Create Playlist
Get Featured Playlists
Get Category's Playlists
Get Playlist Cover Image
Add Custom Playlist Cover Image
S
 */

function usePlaylist(props) {

    const [playlist, setPlaylist] = useState()
    const [tracks, setTracks] = useState([])

    function getPlaylist() {
        fetch(`https://api.spotify.com/v1/playlists/${props.playlistID}`, {
            headers: {
                'Authorization': `Bearer ${props.accessToken}`
            }
        }).then((response) => response.json())
        .then((data) => {
            console.log("Setting playlist in new hook", data)
            setPlaylist(data)
            setTracks(prevTracks => prevTracks.concat(data.tracks.items))

        }).catch((data) => {
            console.log("There was an error fetching playlist", data)
        })   
    }
    useEffect(() => {
        if(props.accessToken) {
            getPlaylist()
        }
        // getPlaylist()
    }, [props.playlistID])

    return (playlist, tracks)
}

export default usePlaylist