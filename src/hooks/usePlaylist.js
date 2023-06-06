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

Need to differentiate between users playlists and just followed playlists, as users will not be allowed to modify playlist content of playlists they do not own.
 */

function usePlaylist(accessToken, playlistID) {

    const [playlist, setPlaylist] = useState()
    const [tracks, setTracks] = useState([])
    const [reload, setReload] = useState(false) // this is for re-rendering when adding/removing tracks to display changes

    const pagination = useRef(undefined)

    function getPlaylist() {
        let fields = 'id, name, owner, images, tracks(items(track.id, track.name, track.artists, track.album(!available_markets), track.duration_ms, track.uri), limit, offset, next, previous, total), type, uri'
        fetch(`https://api.spotify.com/v1/playlists/${playlistID}?fields=${fields}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then((response) => response.json())
        .then((data) => {
            console.log("Setting playlist in new hook", data)
            setPlaylist(data)
            setTracks(data.tracks.items)
            pagination.current = data.tracks.next

        }).catch((data) => {
            console.log("There was an error fetching playlist", data)
        })   
    }

    function getPlaylistItems() {
        let fields = 'items(track.id, track.name, track.artists, track.album(!available_markets), track.duration_ms, track.uri), limit, offset, next, previous, total'

        fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks?fields=${fields}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
        .then((data) => {
            console.log("Getting items only: ", data)
        })
    }

    function removeTrack(track) {
        // maybe use an array for these in case I can figure out how to do a group action on tracks in the future
        console.log("Removing track from hook.")
        const trackURI = `spotify:track:${track}`
        const toRemove = [{"uri": trackURI}]

        fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                tracks: toRemove
            })
        }).then((response) => response.json())
        .then((data) => {
            // success returns a snapshot ID for the playlist
            if(reload === false) {
                setReload(true)
            } else if(reload === true) {
                setReload(false)
            }
        }).catch((data) => {
            console.log("There was an error removing track", data)
        })
    }

    function addTrack(track) {
        console.log("Adding track from hook.")
        // pass a single track ID in URI form as a param to the URL
        const trackURI = `spotify:track:${track}`
        const payload = {
            uris: [trackURI],
            // position: 0 // omitted appends to playlist
        }
        console.log("Adding track from hook", trackURI, payload)
        fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(payload)
        }).then((response) => response.json())
        .then((data) => {
            // if successful returns a snapshot
            if(reload === false) {
                setReload(true)
            } else if(reload === true) {
                setReload(false)
            }
        })
        .catch((data) => {
            console.log("There was an error adding track", data)
        })
    }

    function trackScroll() {
        // load additional tracks scrolling through track lists, if there are any, using the 'next' uri provided by spotify response
        let fields = 'items(track.id, track.name, track.artists, track.album, track.duration_ms, track.uri), limit, offset, next, previous'
        if(pagination.current === null) {
            // no more songs to load (spotify data.next = null)
            console.log("No more songs to load in pagination")
            return false
        }
        fetch(pagination.current + `&fields=${fields}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
        .then((data) => {
            if(data.next === null) {
                // last page
                setTracks((prevTracks) => prevTracks.concat(data.items))
                pagination.current = data.next
            } else {
                setTracks((prevTracks) => prevTracks.concat(data.items))
                pagination.current = data.next
       
                pagination.current = data.next
    
            }
        })
    }

    useEffect(() => {
        if(accessToken) {
            getPlaylist()
            // getPlaylistItems()
        }
    }, [])

    useEffect(() => {
        getPlaylist()
        // getPlaylistItems()
    }, [playlistID])

    useEffect(() => {
        // re-render when users remove/add tracks with 'reload' as the trigger state
        // removed accessToken conditional, since it shouldn't get to this point without an accessToken anyways
        getPlaylist()
    }, [reload])
    
    // console.log("TRACKS IN HOOK", tracks)
    return [playlist, tracks, addTrack, removeTrack, trackScroll]
}

export default usePlaylist