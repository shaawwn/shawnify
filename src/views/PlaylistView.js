import {useState, useEffect} from 'react';

import SpotifyPlaylist from '../utils/SpotifyPlaylist';
import useTracks from '../hooks/useTracks';
import usePlaylist from '../hooks/usePlaylist'
import {useSearch} from '../hooks/useSearch';
import TrackTableMini from '../components/TrackTableMini';
import TrackTable from '../components/TrackTable'
import SearchMini from '../components/SearchMini'
import PlaylistBanner from '../components/PlaylistBanner'

// need to check if owner for playlist

function PlaylistView(props) {

    const [playlist, tracks, addTrack, removeTrack, trackScroll] = usePlaylist(props.accessToken, props.playlistID)

    // const [reload, setReload] = useState(false)


    function displayContent() {

        return(
            <>
                <PlaylistBanner 
                    playlist={playlist} 
                    viewType="playlist"
                />
                {/* <TrackTableMini 
                    tracks={tracks}
                    toggleView={props.toggleView}
                    viewType='playlist'
                    context_id={props.playlistID}
                    controls={props.controls}
                    removeTrack={removeTrack}
                    addTrack={addTrack}
                    trackScroll={trackScroll}
                /> */}
                <TrackTable 
                    playlist={true}
                    tracks={tracks}
                    metaData={playlist}
                    controls={props.controls}
                    toggleView={props.toggleView}
                    trackScroll={trackScroll}
                />
            </>

        )
    }

    // useEffect(() => {

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

export default PlaylistView


// GRAVEYARD
    // function _getPlaylist_() {
    //     // mimicking the request to the API to get the playlist details
    //     console.log("PROPS", props.playlistID)
    //     // setPlaylist(props.playlistID)
    //     // setTracks([])
    // }

    // function getPlaylist() {
    //     // the real deal
    //     fetch(`https://api.spotify.com/v1/playlists/${props.playlistID}`, {
    //         headers: {
    //             'Authorization': `Bearer ${props.accessToken}`
    //         }
    //     }).then((response) => response.json())
    //     .then((data) => {
    //         console.log("PLAYLIST DATA CREATE", data)
    //         // setPlaylist(data)
    //         // setTracks(data.tracks)
    //     })
    // }