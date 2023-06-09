import {useState, useEffect, useRef} from 'react';

import {truncateText} from '../helpers/functions'
import { v4 as uuidv4 } from 'uuid';
import {msToMinutesAndSeconds} from '../helpers/functions'
/*

Mini version of the TrackTable to be used in creating playlists, include minimal information and a 'add' button to add tracks to playlist

Search tracks, albums, playlists, no banner, but be able to toggle between each. For playlists/albums, have the option to 'Add all' or have a check mark to pick and select tracks

*/

function TrackTableMini(props) {
    // console.log("TRACKS PROPS", props)
    const [height, setHeight] = useState(0) // 
    const tableRef = useRef()

    function handleScroll() {
        // need to account for search/playbar at bottom
        // this really needs to be the bottom of the COMPONENT, not the window and needs to factor in that there is a second table when using search so after it exceeds the height by a certain amount, don't scroll
        /**
         * Only scroll when bottom of track table has been reached, after that, scroll in search table (if search table)
         * Generally speaking, when you reach the bottom of the page, even with search, you should 
         * Search table should only appear at the bottom anyways (Or should it....)
         */
        // console.log("SCROLL HEIGHT", height, document.body.offsetHeight)

        if(window.innerHeight + 1 + window.scrollY >= document.body.offsetHeight) {
            props.trackScroll()
            window.scrollTo(0, document.documentElement.scrollTop)
        }
    }
    function handleClick(id, offset, track) {
        // console.log("CLICKING", id, offset, track)
        // add album details to track
        let formatTrack;
        let context_uri;
        if(props.viewType === 'album') {
            formatTrack = {
                track: track
            }
            formatTrack.track['album'] = props.albumDetails
            context_uri = `spotify:album:${props.context_id}`
        } else {
            formatTrack = {
                track: track
            }
            context_uri = `spotify:playlist:${props.context_id}`
        }

        if(props.viewType === 'search') {
            console.log("SEARCH CLICK", id, track, props)
            props.controls('start', null, [`spotify:track:${id}`], null, 0, formatTrack)
        } else {
            // let formatTrack = {
            //     track: track
            // }

            console.log("PLAYLIST CLICK", props)
            props.controls('start', context_uri, null, offset, 0, formatTrack)
        }
    }

    function handleLink(e, id) {
        // direct a link when clicking on text in a row
        e.stopPropagation()
        // console.log('link', e.target.dataset.spotifyId, e.target.getAttribute('view'))
        props.toggleView(e.target.getAttribute('view'), e.target.dataset.spotifyId)
    }

    function handleButtonClick(e) {
        e.stopPropagation()
        const id = e.target.dataset.spotifyId
        // console.log("BUTTON CLICK", e.target.innerText)
        if(e.target.innerText === 'Add') {
            // console.log("ADDING IMTEM")
            props.addTrack(id)
        } else if(e.target.innerText === 'Remove') {
            props.removeTrack(id)
        }
        // props.removeTrack(id)
    }

    function displayTrackRows() {
        return(
            <div className="track-table" ref={tableRef}>
                <table>
                    <thead className="track-table-head">
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

    function displayAlbumTrackRows() {
        // console.log("props in album", props.tracks[0])

        return(
            <div className="track-table">
                <table>
                <thead className="track-table-head">
                    <tr className="track-table-row" id={'track-table-mini-head'}>
                        {/* WHY IS SETTING THIS TO 100VW WORK?? */}
                        <th style={{width: '100vw'}} className="table-item">Title</th>
                        <th className="table-item">Artist</th>
                        <th className="table-item">Album</th>
                        <th className="table-item">Duration</th>
                        </tr>
                    </thead>
                    <tbody>
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
        } else if(props.viewType === 'album') {
            // also need to eliminate the search
            // console.log("DISPLAYING ALBUM", props.tracks)
            return displayAlbumTrackRows()
        }
    }

    useEffect(() => {
        //
        // console.log("HEIGHT", tableRef.current.offsetHeight)
        // if(tableRef.current) {
        //     // needs to be calc'd AFTER tracks load
        //     setHeight(tableRef.current.offsetHeight)
        //     console.log("Setting height", tableRef.current.offsetHeight)
        // }
    }, [props.tracks])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, []) // [height]


    return(
        // <div className="track-table-mini">
        <>
            {props.tracks.length > 0 ? displayTable(props.viewType): displayEmptyTable()}
        </>
        // </div>
    )
}

export default TrackTableMini