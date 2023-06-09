import {useState, useEffect} from 'react';

import TrackRow from '../components/TrackRow'
import TrackRowAlbum from '../components/TrackRowAlbum'


function TrackTable({playlist, tracks, metaData, controls, toggleView, trackScroll}) {
    // playlist === true, displayPlayist rows
    // tracksData is meta data for the playlist/album to seperate it from the track information 
    // tracks are a list of track objects in the playlist/album
    function displayAlbumHead() {
        <>
            <tr className="track-table-row">
                <th className="track-table-head-item">Title</th>
                <th className="track-table-head-item">Duration</th>
            </tr>
        </>
    }

    function displayPlaylistHead() {
        return(
            <tr className="track-table-row">
                <th className="track-table-head-item">Title</th>
                <th className="track-table-head-item">Album</th>
                <th className="track-table-head-item">Duration</th>
            </tr>
        )
    }

    function displayAlbumTableRows() {
        return(
            <>
                {tracks.map((track, index) => 
                
                    <TrackRowAlbum 
                        title={track.name}
                        artist={track.artists[0].name}
                        artistID={track.artists[0].id}
                        album={metaData}
                        playlist={false} // boolean
                        duration_ms={track.duration_ms}
                        key={track.id}
                        toggleView={toggleView}
                        controls={controls}
                        context={metaData.id}
                        offset={index}
                        track={track}
                    />
                )}   
            </>
        )
    }
    function displayTableRows() {

        return(
            <>
                {tracks.map((track, index) => 
                    <TrackRow 
                        title={track.track.name}
                        artist={track.track.artists[0].name}
                        artistID={track.track.artists[0].id}
                        album={track.track.album}
                        playlist={true} // boolean
                        duration_ms={track.track.duration_ms}
                        key={track.track.id}
                        toggleView={toggleView}
                        controls={controls}
                        context={metaData.id}
                        offset={index}
                        track={track}
                    />
                )}

            </>
        )
    }

    function populateTable() {
        if(playlist) {
            return displayTableRows()
        }
        return displayAlbumTableRows()
    }
    return(
        <>
            <table className="track-table">
                <thead className="track-table-head">
                    {playlist ? displayPlaylistHead() : displayAlbumHead()}
                </thead>
                <tbody>
                    {tracks ? populateTable() : <tr className="track-table-item"><td>You have no items!</td></tr>}
                </tbody>
            </table>
        </>
    )
}

export default TrackTable