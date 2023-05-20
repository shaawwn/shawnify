import {useState, useEffect} from 'react';


import {parseTracks, parseSavedTracks, parsePlaylistTracks} from '../utils/utils'
export default function Tester(props) {
    // test various functions wihtout worryinh about styling, etc.
    //  playliwst - 3U7cnGKsbaP98hRy9C9WvR
    //  album 7qWGlDqW4PUb3eAXyCCSe2

 
    const [object, setObject] = useState()

    const [albumTracks, setAlbumTracks] = useState()
    const [playlistTracks, setPlaylistTracks] = useState()
    const [savedTracks, setSavedTracks] = useState()
    const [searchTracks, setSearchTracks] = useState()


    function search() {
        // 'type' is the desired query type, eg 'track', 'album', default is all seachTypes
        const searchTypes = ["album", "artist", "playlist", "track", "show", "episode", "audiobook"]
        const query = 'Rush'
        if(query === '') {
            // nothing to search, abort before query
            console.log("Nothing to search, aborting query")
            return false
        }
        fetch(`https://api.spotify.com/v1/search?q=${query}&type=${searchTypes}`, {
            headers: {
                'Authorization': `Bearer ${props.accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
        .then((data) => {
            // console.log('hook search', data)
            if(data.error === 400) {
                console.error("400 error in fetch")
                // setSearchResult()
                // return false
            } else {
                // setSearchResult(data)
                console.log("Search data: ", data.tracks)
                setObject(data.tracks)
            }
        })
    }

    function getCurrent() {
        fetch(`https://api.spotify.com/v1/me/player`, {
            headers: {
                'Authorization': `Bearer ${props.accessToken}`
            }
        }).then((response) => response.json())
        .then((data) => {
            console.log("Album/Playlist: ", data)
        })
    }

    function getPlaylist() {
        fetch(`https://api.spotify.com/v1/playlists/3U7cnGKsbaP98hRy9C9WvR`, {
            headers: {
                'Authorization': `Bearer ${props.accessToken}`
            }
        }).then((response) => response.json())
        .then((data) => {
            console.log("Playlist: ", data)
            // setPlaylist(data)
            setObject(data)
        })
    }

    function getAlbum() {
        fetch(`https://api.spotify.com/v1/albums/7qWGlDqW4PUb3eAXyCCSe2`, {
            headers: {
                'Authorization': `Bearer ${props.accessToken}`
            }
        }).then((response) => response.json())
        .then((data) => {
            console.log("Album: ", data)
            // setAlbum(data)
            setObject(data)
        })
    }

    function getPlaylistTracks() {
        fetch(`https://api.spotify.com/v1/playlists/3U7cnGKsbaP98hRy9C9WvR/tracks`, {
            headers: {
                'Authorization': `Bearer ${props.accessToken}`
            }
        }).then((response) => response.json())
        .then((data) => {
            console.log("Playlist tracks: ", data)
            // setAlbum(data)
            setObject(data)
        })   
    }
    function getAlbumTracks() {
        fetch(`https://api.spotify.com/v1/albums/7qWGlDqW4PUb3eAXyCCSe2/tracks`, {
            headers: {
                'Authorization': `Bearer ${props.accessToken}`
            }
        }).then((response) => response.json())
        .then((data) => {
            console.log("Album tracks: ", data)
            // setAlbum(data)
            setObject(data)
        })   
    }
    function getSavedSongs() {
        fetch(`https://api.spotify.com/v1/me/tracks`, {
            headers: {
                'Authorization': `Bearer ${props.accessToken}`
            }
        }).then((response) => response.json())
        .then((data) => {
            setObject(data)
            console.log("Saved Song: ", data)
        })
    }


    useEffect(() => {
        // getCurrent()
        //
        if(props.accessToken) {
            // getCurrent()
            // getSavedSongs()
            search()
            // getPlaylist()
            // getAlbum()
            // getAlbumTracks()
            // getPlaylistTracks()

            // playlist -> items -> track -> trackDetails
            // saved songs -> items -> track -> trackDetails
            // albym and search -> items -> track details

        }
        

    }, [props.accessToken])

    useEffect(() => {

        if(object) {
            // if(object.type === 'playlist') {
            //     console.log('obj is playlist', object)
            //     setPlaylistTracks(parsePlaylistTracks(object.tracks.items))
            //     // parsePlaylistTracks(object.tracks.items)
            // } else if(object.type === 'album') {
            //     // album and search have the same object structure, items -> track details
            //     parseTracks(object.tracks.items)
            // } else {
            //     console.log('calling savedTracks', object.items)
            //     // parseSavedTracks(object.items)
            //     parseTracks(object.items)
            // }
            parseTracks(object.items)


        }
    }, [object])
    return(
        <div>

            <h1>Testing component</h1>
        </div>
    )
}

/***
 * 
 * 
 * Right now get  a standard object for tracks to make it easier to work with
 * 
 * tracks - album/playlist/library/search/'widget' artist page/search page
 * 
 * playback state - is_playing, progress, duration, shuffle, repeat, etc
 * 
 * Passed to TrackTable: 
 *      id
 *      name
 *      artists
 *      album
 *      duration
 */