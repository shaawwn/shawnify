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


    function displayContent() {

        return(
            <>
                <PlaylistBanner 
                    playlist={playlist} 
                    viewType="playlist"
                />
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

