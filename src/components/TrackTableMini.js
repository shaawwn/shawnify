import {useState, useEffect} from 'react';

import {truncateText} from '../helpers/functions'
import { v4 as uuidv4 } from 'uuid';
import {msToMinutesAndSeconds} from '../helpers/functions'
/*

Mini version of the TrackTable to be used in creating playlists, include minimal information and a 'add' button to add tracks to playlist

Search tracks, albums, playlists, no banner, but be able to toggle between each. For playlists/albums, have the option to 'Add all' or have a check mark to pick and select tracks

*/

function TrackTableMini(props) {
    // console.log("TRACKS PROPS", props.tracks)

    function handleClick(id, offset, track) {
        // console.log("CLICKING")
        let formatTrack = {
            track: track
        }
        if(props.viewType === 'search') {
            console.log("SEARCH CLICK", id, track)
            props.controls('start', null, [`spotify:track:${id}`], null, 0, formatTrack)
        } else {
            // let formatTrack = {
            //     track: track
            // }
            console.log("PLAYLIST CLICK", id, track)
            props.controls('start', null, [`spotify:track:${id}`], null, 0, formatTrack)
        }
    }

    function handleLink(e, id) {
        // direct a link when clicking on text in a row
        e.stopPropagation()
        // console.log('link', e.target.dataset.spotifyId, e.target.getAttribute('view'))
        props.toggleView(e.target.getAttribute('view'), e.target.dataset.spotifyId)
    }

    function addTrack(e) {
        e.stopPropagation()
        const id = e.target.dataset.spotifyId
        console.log('Adding track', id)

    }

    function handleButtonClick(e) {
        e.stopPropagation()
        const id = e.target.dataset.spotifyId
        props.removeTrack(id)
    }

    function displayTrackRows() {
        return(
            <div className="track-table-mini">
                <table>
                    <thead>
                    <tr className="track-table-row" id={'track-table-mini-head'}>
                        <th className="table-item">Title</th>
                        <th className="table-item">Artist</th>
                        <th className="table-item">Album</th>
                        <th className="table-item">Duration</th>
                        </tr>
                    </thead>
    
                    <tbody>
                        {props.tracks.map((track, index) => 
                            <tr className="track-table-row" key={uuidv4()} onClick={() => handleClick(track.track.id, index, track.track)}>
                                <td className="table-item">{truncateText(track.track.name)}</td> 
                                <td className="table-item">
                                    <span className="table-link" onClick={handleLink} view="artist" data-spotify-id={track.track.artists[0].id}>    {truncateText(track.track.artists[0].name)} 
                                    </span>
                                </td> 
                                <td className="table-item">
                                    <span className="table-link" onClick={handleLink} view="album" data-spotify-id={track.track.album.id}>{track.track.album.name}
                                    </span>
                                </td> 
                                <td className="table-item">{msToMinutesAndSeconds(track.track.duration_ms)}</td> 
                                <td className="table-item"><button onClick={handleButtonClick} data-spotify-id={track.track.id}>Remove</button></td> 
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }

    function displayEmptyTable() {
        return(
            <div className="track-table-mini">
                <h1>Start adding some songs!</h1>
                    <table>
                    <thead>
                        <tr className="track-table-mini-head track-table-mini-row" id={'track-table-mini-head'}>
                            <th className="table-item">Title</th>
                            <th className="table-item">Artist</th>
                            <th className="table-item">Album</th>
                            <th className="table-item">Duration</th>
                            </tr>
                        </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        )
    }

    function displaySearchTrackRows() {
        //
        // console.log("Displaying search rows", props)
        return(
            <>
                {props.tracks.map((track, index) => 
                    <tr className="track-table-row" key={track.id} id={track.id} onClick={() => handleClick(track.id, index, track)}>
                        <td className="table-item">
                            {truncateText(track.name)}
                        </td>
                        <td className="table-item">
                            <span className="table-link" onClick={handleLink} view="artist" data-spotify-id={track.artists[0].id}>
                                {truncateText(track.artists[0].name)}
                            </span>
                        </td>
                        <td className="table-item">
                            <span className="table-link" onClick={handleLink} view="album" data-spotify-id={track.album.id}>
                                {truncateText(track.album.name)}  
                            </span>
                        </td>
                        <td className="table-item">
                            {msToMinutesAndSeconds(track.duration_ms)}
                        </td>
                        <td className="table-item"><button onClick={handleButtonClick} data-spotify-id={track.id}>Add</button></td> 
                    </tr>
                )}
            </>
        )
    }

    function displayTable(viewType) {
        if(viewType === 'playlist') {
            return displayTrackRows()
        } else if(viewType === 'search') {
            return displaySearchTrackRows()
        }
    }
    return(
        <div className="track-table-mini">
            {props.tracks.length > 0 ? displayTable(props.viewType): displayEmptyTable()}

        </div>
    )
}

export default TrackTableMini