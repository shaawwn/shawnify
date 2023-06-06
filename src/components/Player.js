import {useState, useEffect} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faRepeat, faPlay, faBackwardStep, faForwardStep, faRandom, faPause} from '@fortawesome/free-solid-svg-icons'

/*
The player itself I think should be rather small and JUST be the playbutton components, and be a component of the larger playbar

    is_playing
    shuffle_state
    repeat_state
    progress_ms
    currently_playing_type
    device_id - device to use for playback (example the macbook)
*/

function Player(props) {

    const [playState, setPlayState] = useState(false)
    const [shuffleState, setShuffleState] = useState(false)
    const [repeatState, setRepeatState] = useState(false)
    const [device, setDevice] = useState()


    function handleClick(e) {

        let playerBtn = e.target.parentNode.getAttribute('name')
        console.log('button', playerBtn)
        if(playerBtn === 'play') {
            // start/stop playback
            if(playState === true) {
                props.controls('pause')
                setPlayState(false)
            } else if(playState === false){
                props.controls('play')
                setPlayState(true)
            }
        } else if(playerBtn === 'next') {
            props.controls('next')
        } else if(playerBtn === 'previous') {
            props.controls('previous')
        } else if(playerBtn === 'shuffle') {
            props.controls('shuffle')
        } else if(playerBtn === 'repeat') {
            props.controls('repeat')
        }
    }

    function displayShuffle() {
        let color;
        if(shuffleState === true) {
            color = 'rgb(30, 215, 65)'
        } else if(shuffleState === false) {
            color = 'rgb(200, 200, 200)'
        }
        return <FontAwesomeIcon onClick={handleClick} name="shuffle" icon={faRandom} size="2x" color={color}/>
    }

    function displayRepeat() {
        
    }

    useEffect(() => {

        if(props.playback) {
            if(props.playback === true) {
                setPlayState(true)
            } else {
                setPlayState(false)
            }
            if(props.playback.shuffle_state === true) {
                setShuffleState(true)
            } else {
                setShuffleState(false)
            }
        }

    }, [props.playback]) 



    return(
        <div className="player">
            {/* <h1>Player Here</h1> */}
            <div className="player-controls">
                <FontAwesomeIcon onClick={handleClick} name="repeat" icon={faRepeat} size="2x"/>
                <FontAwesomeIcon name="previous" icon={faBackwardStep} size="2x" onClick={handleClick}/>
                <div className="play-btn">
                    {/* change to pause if playstate === true */}
                    {playState === true? <FontAwesomeIcon name="play" color="white" icon={faPause} size="3x" onClick={handleClick}/> : <FontAwesomeIcon name="play" color="white" icon={faPlay} size="3x" onClick={handleClick}/>}
                {/* <FontAwesomeIcon name="play" icon={faPlay} size="3x" onClick={handleClick}/> */}
                </div>
                <FontAwesomeIcon name="next" icon={faForwardStep} size="2x" onClick={handleClick}/>
                {displayShuffle()}
                {/* <FontAwesomeIcon onClick={handleClick} name="shuffle" icon={faRandom} size="2x"/>  */}
                          
            </div>
            {/* <ProgressBar /> */}
        </div>
    )
}

function ProgressBar(props) {
    // status bar showing current progreess of track
    return(
        <div className="progress-bar">
            <p>Current</p>
            <hr></hr>
            <p>Final</p>
        </div>
    )
}
export default Player
