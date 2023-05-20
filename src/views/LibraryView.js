import {useState, useEffect, useCallback} from 'react';
import useTracks from '../hooks/useTracks';
import TrackTable from '../components/TrackTable'
import HistoryNavigator from '../components/HistoryNavigator'

/**
 * 
 * LibraryView will take an accessToken as props
 * 
 * playback/controls TODO
 * accessToken
 * toggleView
 * userName (to be like "Hey Shawn!")
 * 
 * // Seemed to be a bug when delayed response from fetching, if you keep trying to scroll it will batch up the SAME api call each time, and then send everything all at once resulting in duplicates
 * 
 * In terms of playing songs, library seems to be its own beast in terms of context. That is, when you play an album, you can say something like "Oh this is the 5th song on the album, and after that, play the 6th song, then 7th, etc", since songs in albumshave a position attribute. The library, on the other hand, does not have this, 
 */

function LibraryView(props) {

    const [savedSongs, trackScroll] = useTracks(props.accessToken, 'library', null)
    // console.log("SAVED SONGS IN LIB", savedSongs)

    function populateTrackTable() {
        // console.log("SAVED SONGS", savedSongs)
        return(
            <div>
                <TrackTable
                    tracks={savedSongs.items} 
                    accessToken={props.accessToken} 
                    trackScroll={trackScroll}
                    toggleView={props.toggleView}
                    viewType="library"
                    controls={props.controls}
                />
            </div>
        )
    }

    // useEffect(() => {
    //     // console.log("Calling useEffect")
    // }, [savedSongs])

    return(
        <div className="library-view">
            <h1>Library view yo.</h1>
            {savedSongs? 
                populateTrackTable() 
                :
                <span>Loading library...</span>
            }
        </div>
    )
}

export default LibraryView;



    // useEffect(() => {
    //     // console.log(tracks)

    // }, [props.accessToken])

