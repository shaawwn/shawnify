import {useState, useEffect} from 'react';

import SpotifyPlaylist from '../utils/SpotifyPlaylist';
import useTracks from '../hooks/useTracks';
import usePlaylist from '../hooks/usePlaylist'
import {useSearch} from '../hooks/useSearch';
import TrackTableMini from '../components/TrackTableMini';
import SearchMini from '../components/SearchMini'


function CreatePlaylistView(props) {
    // console.log("Create playlist props", props)

    const [playlist, trackScroll] = useTracks(props.accessToken, 'playlist', props.playlistID)
    // const [playlist, setPlaylist] = useState()
    const [reload, setReload] = useState(false)
    // const Playlist = new SpotifyPlaylist(props.accessToken, props.playlistID)
    // const [hookPlaylist, hookTracks] = usePlaylist(props.accessToken, props.playlistID)
    // console.log("API PLAYLIST", apiPlaylist)


    // const [playlist, setPlaylist] = useState()
    // const [tracks, setTracks] = useState()
    // const [tracks, playlist] = usePlaylist(props.accessToken, 'playlist, props.playlistID)
    // const [search] = useSearch(props.accessToken)
    
    function _getPlaylist_() {
        // mimicking the request to the API to get the playlist details
        console.log("PROPS", props.playlistID)
        // setPlaylist(props.playlistID)
        // setTracks([])
    }

    function addTrack(track) {
        // both add/remove will take a track object (which includes its ID) as a param
        console.log("Adding track to playlist", track)
    }

    function removeTrack(track) {
        console.log("Removing track from palylsit", track) // track is the uri
        const trackURI = `spotify:track:${track}`
        console.log("remove track from playlist: ", trackURI)
        fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${props.accessToken}`
            },
            body: JSON.stringify({
                tracks: [{"uri": trackURI}] // track ID, in array form
            })
        }).then((response) => response.json())
        .then((data) => {
            // if successful, will return a snapshotID for the playlist
            // but need to update state to reflect the change.
            // I think spotify really does just update and reload so why reinvent the wheel
            console.log("Removing track and updating: ", data)
            // I think this IS reloading, however, because the palylist is set through the hook, it returns the same playlist until the hook itself is refreshed.
            if(reload === false) {
                
                console.log("Reloading from false")
                setReload(true)
            } else if(reload === true) {
                console.log("Reloading from true")
                setReload(false)
            }
        })
    }

    function getPlaylist() {
        // the real deal
        fetch(`https://api.spotify.com/v1/playlists/${props.playlistID}`, {
            headers: {
                'Authorization': `Bearer ${props.accessToken}`
            }
        }).then((response) => response.json())
        .then((data) => {
            console.log("PLAYLIST DATA CREATE", data)
            // setPlaylist(data)
            // setTracks(data.tracks)
        })
    }

    function displayContent() {
        // console.log("PLAYING CONTET", playlist.tracks.items)
        return(
            <>
                <h1>{playlist.name}</h1>
                <TrackTableMini 
                    tracks={playlist.tracks.items}
                    toggleView={props.toggleView}
                    viewType='playlist'
                    controls={props.controls}
                    removeTrack={removeTrack}
                    addTrack={addTrack}
                />
            </>

            // needs to have a TrackTableMini for the playlist

            // AND have the SearchTableMini (or whatever I'm gonna call it)
        )
    }

    useEffect(() => {
        // console.log("USE EFFECT", props.playlistID)
        if(props.playlistID) { 
            // console.log("PLAYLIST", playlist)
            // _getPlaylist_()
            getPlaylist()
        }
    }, [])

    // useEffect(() => {
    //     if(props.playlistID) {
    //         console.log("Loading playlist with spotiofy")
    //         Playlist.getPlaylist(setPlaylist)
    //     }
    // }, [])
    // useEffect(() => {
    //     // console.log("Create playlist playlist: ", playlist)
    //     // apiPlaylist.getPlaylist(setPlaylist)
    //     console.log("Hook palylist", hookPlaylist)
    // }, [playlist])


    return(
        <div className="create-playlist-view">
            {playlist ? displayContent() : <h1>Loading playlist...</h1>}
            <hr></hr>
            <SearchMini 
                accessToken={props.accessToken}
                toggleView={props.toggleView}
                controls={props.controls}
                addTrack={addTrack}
                removeTrack={removeTrack}
            />
        </div>
    )
}

export default CreatePlaylistView