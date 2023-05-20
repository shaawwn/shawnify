import {useState, useEffect} from 'react';

// import {msToMinutesAndSeconds} from '../_helpers'
// import TrackTableRowGroup from './TrackTableRowGroup'
import {createContextArray} from '../utils/utils'

import {truncateText, msToMinutesAndSeconds} from '../helpers/functions'
/**
 * 
    When cell content is too long, create a '...' ellipses ito trail off.
    Two components to track table cells:
        The cell itself, which functions as a start/selet for the track within the cell
        Text links within the cell: Name will start to play the song same as clicking the cell,
            but artist and album should link to artist/album pages respectively

    Spotify gets the total number of tracks in a playlist and allws you to scroll while some value is less than that number
    When you rabid scroll, it has skeleton template loading because it can't load the tracks fast enoguh, however, I think it DOES keep track of where in the list you are, so when you stop, it takes that location value and gets the songs that are there
 */

function TrackTable(props) {

    // console.log('track table props', props)
    function handleClick(id, offset, track, albumDetails) {
        // id is track id
        // play selected track
        // when handled from library, no need context, just play the song (not true I think)

        if(props.viewType === 'library') {

            props.controls('start', null, [`spotify:track:${id}`], null, 0, track)
            return false
        } else if(props.viewType === 'search') {
            let formatTrack = {
                track: track
            }
            props.controls('start', null, [`spotify:track:${id}`], null, 0, formatTrack)
            return false
        }

        const context_uri = `spotify:${props.viewType}:${props.contextID}`
        if(albumDetails) {
            track = {
                track: {
                    ...track,
                    album: albumDetails
                },
                album: albumDetails
            }
            props.controls('start', context_uri, null, offset, 0, track)
        } 
        props.controls('start', context_uri, null, offset, 0, track) 
    }

    function handleLink(e, id) {
        // direct a link when clicking on text in a row
        e.stopPropagation()
        // console.log('link', e.target.dataset.spotifyId, e.target.getAttribute('view'))
        props.toggleView(e.target.getAttribute('view'), e.target.dataset.spotifyId)
    }

    function handleScroll() {

        // only call the pagination function when scrolling at the bottom of the page 
        // this will ALWAYS call scroll, but only make the callback at the bottom
        if(window.innerHeight + 1 + window.scrollY >= document.body.offsetHeight) {
            // on scrolling, add new SKELETON ROWS, then overwrite with the loaded rows
            // console.log("Table tracks", props.tracks)
            props.trackScroll() 
            // console.log("Scrolling in handle", window.innerHeight + 1, window.scrollY, document.body.offsetHeight)
            window.scrollTo(0, document.documentElement.scrollTop)
        }

    }


    function displaySkeletonRows() {
        // console.log('display skeleton rows')
        // load empty rows when there is nothing to load
        let emtpyTrack = { // skeleton Track object
            track: {
                id: '',
                name: '',
                artists: ['',''],
                album: {
                    name: ''
                },
                duration_ms: 0
            }
        }
        return(
            <>
                <tr className="track-table-row-skeleton">
                    <td className="table-item">Empty</td>
                    <td className="table-item">Empty</td>
                    <td className="table-item">Empty</td>
                    <td className="table-item">Empty</td>
                </tr>
            </>
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
                            <span className="table-link" onClick={() => handleLink} view="artist" data-spotify-id={track.artists[0].id}>
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
                    </tr>
                )}
            </>
        )
    }

    function displayAlbumTrackRows() {
        // console.log("props in album", props.tracks[0])

        return(
            <>
                {props.tracks.map((track,index) => 
                    <tr className="track-table-row" key={track.id} id={track.id} onClick={() => handleClick(track.id, index, track, props.albumDetails)}> 
                        <td className="table-item"> {truncateText(track.name)}</td>
                        <td className="table-item" >
                            <span className="table-link" onClick={handleLink} view="artist" data-spotify-id={track.artists[0].id}>{truncateText(track.artists[0].name)}</span>
                        </td>
                        <td className="table-item">
                        <span className="table-link" onClick={handleLink} view="album" >
                            {truncateText(props.albumDetails.name)}
                            </span>
                        </td>
                        <td className="table-item">{msToMinutesAndSeconds(track.duration_ms)}</td>
                    </tr>
                )}
            </>
        )   
    }

    function displayTrackRows() {
        // theres a dynamic font depending on how long a playlist/album title is, its made to fit the banner, so something that is like 200 words will be small, but something that is two will be very large
        // console.log("Track rows", props.tracks[0])
        return(
            // mapped track to remove redundant track.track.name convention
            <>
                {props.tracks.map((track, index) => 
                //Clicking a row shoud start playback for the song, so need id
                    <tr className="track-table-row" key={track.track.id} id={track.track.id} onClick={() => handleClick(track.track.id, index, track)}> 
                        <td className="table-item">{truncateText(track.track.name)}</td>
                        <td className="table-item" >
                            <span className="table-link" onClick={handleLink} view="artist" data-spotify-id={track.track.artists[0].id}>{truncateText(track.track.artists[0].name)}</span>
                        </td>
                        {/* Album */}
                        {track.track.album && track.track.album.id ? 
                            <td className="table-item">
                            <span className="table-link" onClick={handleLink} view="album" data-spotify-id={track.track.album.id}>
                                {truncateText(track.track.album.name)}
                                </span>
                            </td>
                        :<td className="table-item">
                            <span className="table-link">
                                {truncateText(props.track.albumName)}
                            </span>
                        </td>
                        }
                        <td className="table-item">{msToMinutesAndSeconds(track.track.duration_ms)}</td>
                    </tr>
                )}
            </>
        )
    }

    function displayTable(viewType) {
        if(viewType === 'playlist') {
            return displayTrackRows()
        } else if(viewType === 'album') {
            // console.log("calling display album tracks")
            return displayAlbumTrackRows()
            // return displayTrackRows()
        } else if(viewType === 'library') {
            return displayTrackRows()
        } else if(viewType === 'search') {
            return displaySearchTrackRows()
        }
    }


    useEffect(() => {
        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return(
        <>
            <table className="track-table">
                <thead className="track-table-head">
                    <tr id={'head'}>
                        <th>Title</th>
                        <th>Artist</th>
                        {/* {props.viewType !== 'album' ? 
                            <th>Album</th>
                            :<></>
                        } */}
                        <th>Album</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {props.tracks ? displayTable(props.viewType) : displaySkeletonRows()}
                </tbody>
            </table>
        </>
    )
}

// NEW TRACK TABLE
// function TrackTable2(props) {

//     useEffect(() => {
//         window.addEventListener('scroll', handleScroll)

//         return () => {
//             window.removeEventListener('scroll', handleScroll)
//         }
//     }, [])
//     return(
//         <>
//             <table className="track-table">
//                 <thead className="track-table-head">
//                     <tr id={'head'}>
//                         <th>Title</th>
//                         <th>Artist</th>
//                         {/* {props.viewType !== 'album' ? 
//                             <th>Album</th>
//                             :<></>
//                         } */}
//                         <th>Album</th>
//                         <th>Duration</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {props.tracks ? displayTable(props.viewType) : displaySkeletonRows()}
//                 </tbody>
//             </table>
//         </>
//     )
// }
export default TrackTable


/**
 * 
 * Track table only needs TRACKS and some functions to handle pagination and controls
 * 
 * Ideally, be:
 * <Track Table 
 *      tracks={tracks}
 *      pagination={pagination}
 *      controls={controls} // (start/resume to be precise)
 * />
 */

