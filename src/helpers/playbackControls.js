// playback controls to use in usePlayback

function getDevices(accessToken, setDevices) {
    // console.log('getting user devices')
    fetch(`https://api.spotify.com/v1/me/player/devices`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }).then((response) => response.json())
    .then((data) => {
      // console.log('user devices', data)
      setDevices(data.devices)
    })
  }

function getPlaybackState(setCurrentlyPlaying, accessToken, currentlyPlayingRef) {
// getUser playback state
// console.log("Getting playback state", props.accessToken) // at the time of initial loading, accessToken does not exist
// console.log('playback state in helpers')
    fetch(`https://api.spotify.com/v1/me/player`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }

    })
    .then((response) => response.json())
    .then((data) => {
        // console.log("playback state from within helpers", data)
        // setPlaybackState(data.is_playing)
        // setDevice(data.device.id)

        setCurrentlyPlaying(data)
        currentlyPlayingRef.current = data

    })
}

function start(deviceID, accessToken, context_uri=null, uris=null, offset=null, position_ms=0) {

    // I think, with this, it's probably starting that ONE SONG and not the actual song in context of album/playlist,
    // meaning, that when you hit next/previous, because there is basically only one song , it just repeats, needs to be int he context of whatever the song is being chosen from, album, library, playlist, etc.

    let payload = {}
    if(context_uri !== null) {
        payload.context_uri = context_uri
    }
    if(uris !== null) {
        payload.uris = uris
    }
    if(offset !== null) {
        payload.offset = {'position': offset}
    }
    if(position_ms !== 0) {
        payload.position_ms = position_ms
    }
    console.log("Payload", payload)
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`, {
        method: "PUT",
        headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    }).catch(e => {
        console.log('start error:', e)
    })
}
  
function pause(device, accessToken, playbackState) {
    console.log('pausing')
    fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${device}`, {
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
    // setPlayState(false)
    // playbackState = false
}
  
  
function play(device, accessToken, playbackState) {
    console.log("resuming/starting")
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device}`, {
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
    // setPlayState(true)
    // playbackState = false
}
  
  
function nextSong(accessToken) {
    console.log('skipping')
    fetch(`https://api.spotify.com/v1/me/player/next`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
    // getPlaybackState(currentlyPlaying, accessToken)
}
  
  
function previousSong(accessToken) {
    console.log('previous')
    fetch(`https://api.spotify.com/v1/me/player/previous`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
    // getPlaybackState(currentlyPlaying, accessToken)
}
  
  
function shuffle(accessToken, shuffleState) {
    // set shuffle state on or off
    // shuffleState true/false 
    console.log('shuffling playlist', shuffleState)
    let newState;
    if(shuffleState === true) {
        newState = false
    } else if(shuffleState === false) {
        newState = true
    }
    fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${newState}`, {
        method: 'PUT',
        headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
        }
    })
}

function repeat(accessToken, repeatState){
    //TODO
}

module.exports = {
    getDevices,
    getPlaybackState,
    start,
    pause,
    play,
    nextSong,
    previousSong,
    shuffle,
    repeat
}