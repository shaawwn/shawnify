import {useState, useEffect, useRef} from 'react';

import {msToMinutesAndSeconds, printSongDetails} from '../helpers/functions'
import {
    getDevices,
    getPlaybackState,
    start,
    pause,
    play,
    nextSong,
    previousSong,
    shuffle,
    repeat
} from '../helpers/playbackControls'
/*

    Function for handling playback functions and state

*/
function usePlayback(accessToken, test) {

    const [current, setCurrent] = useState()
    const [isPlaying, setIsPlaying] = useState(false)
    const timer = useRef() // amount of time left in song (check new song when this runs out)
    const timerID = useRef()
    const refreshTimer = useRef()
    const [devices, setDevices] = useState()


    function handleTimer(data) {
        // deal with all the timer stuff 
        // if timer is set to 0 then it will run indefintely, which is a problem because it is making a fetch everyime
        // if(timerID.current) {
        //     // clear timeout if any
        //     // so this is just getting cleaed immedialy
        //     console.log("Clearing timer", timerID)
        //     clearTimeout(timerID)
        // }
        if(data.is_playing === true) {
            if(data.item.duration_ms - data.progress_ms === 0) {
                console.log("Timer was 0")
                // setTimer(250)
                timer.current = 250
            } else {
                // setTimer(data.item.duration_ms - data.progress_ms)
                timer.current = data.item.duration_ms - data.progress_ms + 250
            }

        } else {
            // false, null, or undefined
            console.log("Setting 30 minute timer")
            // setTimer(36000000) // 30 minutes-ish
            timer.current = 3600000

        }
    }

    function getCurrentSong(accessToken) {
        // for reference, this is get PLAYBACK for a user, not CURRENTLY PLAYING,it just so happens to include currently
        // console.log("Calling getcurrent")
        fetch(`https://api.spotify.com/v1/me/player`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
        // .then((response) => console.log('response', response))
        .then((response) => response.json())
        .then((data)=> {
            // printSongDetails(data)
            // console.log("current track", data)
            handleTimer(data) // maybe it is setting a bunch of timers?
            setCurrent({track:data.item}) // sets current TRACK item (no details about playback)
            setIsPlaying(data.is_playing)
        })
        .catch((response) => {
            // when there is not currently playing track, resposne.json() will return an error
            // returns undefined response sometime

            console.log('there was an error: no current song playing.', response)
            setCurrent(undefined)
        })
    }

    function getDevices(accessToken) {
        // console.log('getting user devices')
        fetch(`https://api.spotify.com/v1/me/player/devices`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }).then((response) => response.json())
        .then((data) => {
          console.log('user devices', data)
          // find macbook only
          for(let i = 0; i < data.devices.length; i++) {
            // console.log('data devices', data.devices[i].name.includes('MacBook'))
            setDevices(data.devices)
          }
        //   setDevices(data.devices)
        })
      }

    function _refreshCurrentSong(accessToken, getCurrentSong) {
        // this needs to be called in order to update currentSong whenever the currently playing track changes
        // calling getCurrentSong also handles the timer settings
        if(refreshTimer.current) {
            // console.log("Clearing refrsh Timer", refreshTimer.current)
            clearTimeout(refreshTimer.current)
        }
        refreshTimer.current = setTimeout(() => getCurrentSong(accessToken), 1000)
        // console.log("Setting refresh Timer", refreshTimer.current)
      }
      
    
    function playbackControls(controlType, context_uri, uris, offset, position_ms, track) {
    // function playbackControls(controlType, uri=null, context, trackPosition) {
        // controlType = 'start', 'play', 'pause', 'skip', 'previous', 'start', 'shuffle', 'repeat'
        // Acts directly on playback object HERE
        // console.log('control type', controlType, context_uri)
        if(controlType === 'play') {
            play(devices[0].id, accessToken, current.is_playing)
            _refreshCurrentSong(accessToken, getCurrentSong)
        } else if(controlType === 'pause') {
            pause(devices[0].id, accessToken, current.is_playing)
            _refreshCurrentSong(accessToken, getCurrentSong)
        } else if(controlType === 'next') {
            console.log("NEXT")
            nextSong(accessToken)
            _refreshCurrentSong(accessToken, getCurrentSong)
        } else if(controlType === 'previous') {
            previousSong(accessToken)
            _refreshCurrentSong(accessToken, getCurrentSong)
        } else if(controlType === 'shuffle') {
            shuffle(accessToken, current.shuffle_state)
            _refreshCurrentSong(accessToken, getCurrentSong)
        }else if(controlType === 'start') {
            // the error of currentSong unknown seems to only happen when you first start a track, but after that works fine
            // ex. you navigate to an album, select any track, it starts palying, but when getCurrentSong is called, it returns basically ann empty object. However, if you select a different song at this point, it will then work as intended, returning a playback object showing song details, etc.

            // console.log(context_uri, uris, offset, position_ms)
            console.log("Hitting 'Start'", track)
            start(devices[0].id, accessToken, context_uri, uris, offset, position_ms) //context can be contextUri or uris

            setCurrent(track) // 
            // _refreshCurrentSong(accessToken, getCurrentSong)
        }
    }

    // uncomment for playback functionality
    useEffect(() => {
        // this is onLoad get currentSong, only when the initial page load, or if accessToken changes
        if(accessToken) {
            // console.log("Getting initial current song.")
            getCurrentSong(accessToken)
            getDevices(accessToken)
        } else {
            // console.log("No access token provided.", accessToken)
        }

    }, [accessToken])


    useEffect(() => {
        // this refreshes currentSong when the timer runs out, for example when a song ends (end of timer) and a new song begins
        // this is an...not an ideal solution, as right now it will bactch up api calls and when the timer gets close will then trigger a byunch of api calls at once ()
        if(current) {
            // on playthrough, this will check for a new song and reset the timer
            if(timerID.current) {
                // clear timeout if any to prevent too many api Calls
                clearTimeout(timerID.current)
            }
            timerID.current = setTimeout(() => {
                getCurrentSong(accessToken)
            }, timer.current)
        } else {
            // console.log("not loaded yet.")
        }

    }, [current]) //timer should be reset whenever the currentSong changes as per this dependency


    // console.log("Loading usePlayback", current)
    // {current, is_playing}
    const currentTrack  = {
        currentTrack: current,
        isPlaying: isPlaying,
        shuffle: '',
        repeat: ''
    }
    return [currentTrack, playbackControls]
    // return [current, playbackControls]
}

export default usePlayback