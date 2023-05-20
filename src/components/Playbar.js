import {useState, useEffect} from 'react';
// import Player from './Player'
import Player from './Player'
import {msToMinutesAndSeconds} from '../helpers/functions'

/*
    Playbar needs the play functions
    Track details (name, album artist)
    That is it?
*/
function Playbar(props) {

    // console.log("Playbar props", props.playback.currentTrack)
    useEffect(() => {
        // console.log('props in playbar currently playing useEffect', props)
        // console.log('changing song', props.playback)
        // console.log("Playbar props", props.playback)
    }, [props.playback])

    function displayProgress(progress, duration, count) {

        
        return (
            <>
                <ProgressBar progress={progress} duration={duration} />
            </>
        )
    }

    function displaySkeletonPlaybar() {
        // if everything is undefined, display a skeleton form playbar with placeholder elements
    }

    return(
        <div className="playbar">

            {props.playback.currentTrack !== undefined ? 
                <TrackDetailCard currentTrack={props.playback.currentTrack.track}/>
            :<span>No item</span>
            }
            <Player 
                accessToken={props.accessToken} 
                playback={props.playback.isPlaying}
                controls={props.controls}
                />

            {/* <ProgressBar currentTrack={currentTrack}/> */}

            {/* NeedVolume/settings */}
            {/* TEMP to just fill the space for settingsd */}
            {props.playback.currentTrack !== undefined ? 
                <TrackDetailCard currentTrack={props.playback.currentTrack.track}/>
            :<span>No item</span>
            }
        </div>
    )
}

function TrackDetailCard(props) {
    // console.log("DETAIL", props)
    if(props.playback === undefined) {
        // console.log('no suong currenlty playing', props.playback)
    }

    function displaySkeleton() {
        return(
            <>
                {/* <img src="#" alt="track-detail-skeleton" /> */}
                <div className="card-track-details">
                    {/* <p style={{fontSize: '18px', color: 'rgb(245,245,245)'}}>No song selected</p> */}
                    {/* <p style={{fontSize: '14px', color: 'rgb(200,200,200)'}}>Track Artist</p>                     */}
                </div>
            </>
        )
    }

    function displayTrackDetails() {

        return(
            <>
            <img src={props.currentTrack.album.images[2].url} alt="track-detail-skeleton" />
            <div className="card-track-details">
                <p style={{fontSize: '18px', color: 'rgb(245,245,245)'}}>{props.currentTrack.name}</p>
                <p style={{fontSize: '14px', color: 'rgb(200,200,200)'}}>{props.currentTrack.artists[0].name}</p>                    
            </div>
        </>

        )
    }

    useEffect(() => {
        // console.log('playback in playbar', props.currentTrack)
    }, [props.playback])

    // console.log('current track details in card', props, empty)
    return(
        <div className="track-detail-card">
            {props.currentTrack ? 
            displayTrackDetails()
            : displaySkeleton()
           }
        </div>
    )
}

function ProgressBar(props) {
    // status bar showing current progreess of track
    /**
     * track length
     * current progress
     * playback state (paused/playing)
     */
    const [progress, setProgress] = useState()
    const[duration, setDuration] = useState()

    function displaySkeleton() {
        return(
            <>
                <p>0:00</p>
                <hr></hr>
                <p>0:00</p>
            </>
        )
    }

    function displayProgress() {
    
        return(
            <>
                <p>{msToMinutesAndSeconds(props.currentTrack.progress_ms)}</p>
                {/* <p>{setInterval(increment(props.currentTrack.progress_ms), 1000)}</p> */}
                <hr></hr>
                <p>{msToMinutesAndSeconds(props.currentTrack.duration_ms)}</p>
            </>
        )
    }

    useEffect(() => {
        // console.log('rendering progress', props.progress, props.duration)
    }, [])
    return(
        <div className="progress-bar">
            {props.currentTrack ? displayProgress(): displaySkeleton()}
        </div>
    )
}

function PlayerSettings(props) {
    // settings for volume, switch device, etc, found in the bottom right corner in the main spotify client

    return(
        <div className="playbar-settings">
            <p>Settings here.</p>
        </div>
    )
}
export default Playbar

