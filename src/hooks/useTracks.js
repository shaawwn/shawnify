import {useState, useEffect, useRef, useCallback} from 'react';

/**
 * 
 * functions for handling tracks (playlist, userlibrary, etc) and track manipulations
 * 
 * I feel like this doesnt NEED to be called once, but instead of used when playlist tracks are needed, ie dont' just load ALL the users linbrary when app loads, noly load it when user goes to library. As opposed to playback State, which is basically needed across the entire app.
 * 
 * So in that sense, useTracks needs a playlistID, or a 'library' attribute to determine which tracks to get
 * 
 * Playlist
 * SavedSongs
 * Albums
 * Artist tracks? All? Or just use albums
 * 
 * useTracks also returns the resposne Object from the API?
 */

// export default function useTracks(accessToken, type, id=null) {

//     // type = playlist, library, album, artist
//     // id = playlistID, albumID, artistID, or null if library (for usersLibrary)

//     // const [tracks, setTracks] = useState([])
//     const [responseObject, setResponseObject] = useState()
//     const [totalTracks, setTotalTracks] = useState()
//     const pagination = useRef(undefined)

//     const [tracks, setTracks] = useState([]) // set with playlist/tracks or albums/tracks


//     function handlePagination(trackListType) {
//         // tracklistType = playlist, library, etc
//         // handle the pagination for both playlists and library
//         // this works for all because pagination is set to whatever the fetchURL would be that was set in the original API call, meaning savedSongs, playlists, albums will all have the correct urls
//         if(pagination.current === null) {
//             // no more songs to load
//             return false
//         }
//         fetch(pagination.current, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         }).then((response) => response.json())
//         .then((data) => {
//             console.log("PAGINATION DATA", tracks)
//             if(data.next === null) {
//                 // last page
//                 // setTracks(prevTracks => prevTracks.concat(data.items.map(({track}) => track))) 
//                 setTracks(prevTracks => prevTracks.concat(data.items))
//                 pagination.current = data.next
//             } else {
//                 pagination.current = data.next
//                 // setTracks(prevTracks => prevTracks.concat(data.items.map(({track}) => track)))
//                 setTracks(prevTracks => prevTracks.concat(data.items))
//             }            
//         })

//     }

//     function getPlaylist() {
//         // playlist limit is 100, but for longer playlists there will be a next/previous attributes
//         // let fields=['name', 'album', 'duration_ms', 'progress_ms', 'id', 'uri']

//         fetch(`https://api.spotify.com/v1/playlists/${id}`, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         }).then((response) => response.json())
//         .then((data) => {
//             console.log("PlaylistData", data)
//             setResponseObject(data)
//             setTotalTracks(data.tracks.total)
//             setTracks(data.tracks.items)
//             // setTracks(data.tracks.items.map(({track}) => track))
//             pagination.current = data.tracks.next
//         })
//     }

//     function getPlaylistTracks() {
//         // let fields = 
//         fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         }).then((response) => response.json())
//         .then((data) => {
//             console.log("Playlist tracks", data)
//             setTracks(data.items)
        
//             // playlist goes data.tracks.items
//             // console.log("playlist tracks:", data)
//             // setResponseObject(data)
//             // setTotalTracks(data.tracks.total)
//             // setTracks(data.tracks.items)
//             // pagination.current = data.tracks.next
//         })
//     }

//     function getAlbum() {
//         // playlist limit is 100, but for longer playlists there will be a next/previous attributes
//         // console.log("ALBUM ID", id)
//         fetch(`https://api.spotify.com/v1/albums/${id}`, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         }).then((response) => response.json())
//         .then((data) => {
//             // playlist goes data.tracks.items
//             // console.log("Album data", data)
//             setResponseObject(data)
//             setTotalTracks(data.tracks.total_tracks)
//             setTracks(data.tracks.items)
//             pagination.current = data.tracks.next
//         })
//     }


//     function getSavedSongs() {
//         // Call once, then handle pagination seperately might be the best (well, not BEST) way to go about this
//         let fetchURL;

//         if(pagination.current === null) {
//             return false
//         }
//         if(pagination.current === undefined) {
//             // there is more to load
//             fetchURL = `https://api.spotify.com/v1/me/tracks?limit=50&offset=0`
//             // return false
//         }

//         fetch(fetchURL, {
//             headers: {
//                 "Authorization": `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         }).then((response) => response.json())
//         .then((data) => {

//             pagination.current = data.next // 
//             setResponseObject(data)
//             setTracks(data.items)
//             setTracks(data.items.map(({track}) => track))
//         })
//     }

//     useEffect(() => {
//         if(accessToken) {
//             if(type === 'playlist') {
//                 getPlaylist()
//                 // getPlaylistTracks()
//             } else if(type === 'library') {
//                 getSavedSongs()
//             } else if(type === 'album') {
//                 getAlbum()
//             } else if(type === 'search') {
//                 // handle search query pagination
//             }
//         }
//     }, [])

//     // WORK ON THIS NEXT (albums and playlists have ids)
//     // the problem here is as is it will call getPlaylist which doesn't work withalbums

//     useEffect(() => {
//         // handle updating tracks when a new palylist is selected (probably have to do album at some point)
//         if(id !== null && type === 'playlist') { 
//             getPlaylist()
//         }
//     }, [id])

//     // console.log("Tracks", tracks)
//     return {tracks, responseObject, handlePagination}
// }


export default function useTracks(accessToken, type, id) {

    const [tracks, setTracks] = useState([])
    const [playlist, setPlaylist] = useState() // for the purposes of simplicity, EVERYYTHING is a playlist

    const pagination = useRef(undefined)
    
    function getPlaylist() {

        let fields = 'id, name, owner, images, tracks(items(track.id, track.name, track.artists, track.album(!available_markets), track.duration_ms, track.uri), limit, offset, next, previous, total), type, uri'

        fetch(`https://api.spotify.com/v1/playlists/${id}?fields=${fields}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
        .then((data) => {
            // console.log("Playlist data: ", data)
            setPlaylist(data)
            // setTracks(data.tracks.items.map(({track}) => track)) keeping for posterity
            pagination.current = data.tracks.next
        })
    }

    function getAlbum() {
        let fields = 'id, name, owner, images, tracks(items(track.id, track.name, track.artists, track.album, track.duration_ms, track.uri), limit, offset, next, previous, total), type, uri'

        fetch(`https://api.spotify.com/v1/albums/${id}?fields=${fields}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
        .then((data) => {
            // console.log("Album", data)
            setPlaylist(data)
            // setTracks(data.tracks.items.map(({track}) => track))
            pagination.current = data.tracks.next
        })        
    }

    function getSavedTracks() {
        //
        let fields = 'track(id, name, album, artists, duration_ms, track_number, type, uri)'

        // let fields = 'id, name, owner, images, tracks(items(track.id, track.name, track.artists, track.album, track.duration_ms, track.uri), limit, offset, next, previous, total), type, uri'
        let fetchURL;

        if(pagination.current === null) {
            // no more songs to load
            return false
        }

        if(pagination.current === undefined) {
            fetchURL = `https://api.spotify.com/v1/me/tracks?limit=50&offset=0`
        }

        fetch(fetchURL, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
        .then((data) => {

            pagination.current = data.next
            // console.log("Library data: ", data)
            setPlaylist(data)
        })
    }


    function trackScroll() {
        // load additional tracks scrolling through track lists, if there are any, using the 'next' uri provided by spotify response
        // console.log("SCROLLING", pagination.current)
        // pagination.current = null
        let fields = 'items(track.id, track.name, track.artists, track.album, track.duration_ms, track.uri), limit, offset, next, previous'
        // console.log("Pagination: ", pagination.current)
        if(pagination.current === null) {
            // no more songs to load (spotify data.next = null)
            // console.log("Null")
            console.log("No more songs to load in pagination")
            return false
        }
        console.log("Not null")
        fetch(pagination.current + `&fields=${fields}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
        .then((data) => {
            console.log("Fetching")
            if(data.next === null) {
                // last page
                console.log("No more tracks to load after this.")
                pagination.current = data.next
            } else {
                // console.log("Setting pagination",data, playlist)
                if(playlist.href) {
                    if(playlist.href.split('/')[4] === 'me') {
                        // console.log("Saved Songs")
                        setPlaylist(prevState => ({
                            href: prevState.href,
                            items: prevState.items.concat(data.items),
                            limit: prevState.limit,
                            offset: prevState.offset,
                            previous: prevState.previous,
                            total: prevState.total
                        }))
                        pagination.current = data.next
                        return false
                    }
                }
                console.log("Not saved songs")
                setPlaylist(prevState => ({

                    id: prevState.id,
                    images: prevState.images,
                    name: prevState.name,
                    owner: prevState.owner,
                    tracks: {
                        items: prevState.tracks.items.concat(data.items),
                    },
                    type: prevState.type,
                    uri: prevState.uri
                }))
                pagination.current = data.next
    
            }
        })
    }

    useEffect(() => {
        if(accessToken) {
            if(type === 'playlist') {
                getPlaylist()
            } else if(type === 'library') {
                getSavedTracks()
            } else if(type === 'album') {
                getAlbum()
            } else if(type === 'search') {
                // search query
            }
        }
    }, [])

    useEffect(() => {
        // handle updating tracks when a new palylist is selected (probably have to do album at some point)
        if(id !== null && type === 'playlist') { 
            getPlaylist()
        }
    }, [id])

    // console.log("playlist", playlist)
    return [playlist, trackScroll]
}