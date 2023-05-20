// utility functons file

function createContextArray(tracks) {
    // create an array of track URIs that can be passed to the player API
    let contextArray = []

    for(let i = 0; i < tracks.length; i++) {
        contextArray.push('spotify:track:' + tracks[i].id)
    }

    return contextArray
}


    function parseSavedTracks(trackList) {
        let parsedTracks = []
        for(let i = 0; i < trackList.length; i++) {
            // console.log("IN LOOP", trackList[i])
            let parsedObject = {}
            // playlist has 'track', not 'album
            parsedObject.id = trackList[i].track.id
            parsedObject.name = trackList[i].track.name
            parsedObject.album = trackList[i].track.album
            parsedObject.duration_ms = trackList[i].track.duration_ms
            parsedObject.track_number = trackList[i].track.track_number
            parsedObject.artists = trackList[i].track.artists
            parsedObject.uri = trackList[i].track.uri
            
            // parsedObject.images = trackList[i].track.album.images
            // console.log(parsedObject)
            parsedTracks.push(parsedObject)
        }

        // console.log(parsedTracks)
        return parsedTracks
    }

    function parsePlaylistTracks(trackList) {
        // playlist -> items -> track -> trackDetails

        let parsedTracks = []
        for(let i = 0; i < trackList.length; i++) {
            // console.log("IN LOOP", trackList[i])
            let parsedObject = {}
            // playlist has 'track', not 'album
            parsedObject.id = trackList[i].track.id
            parsedObject.name = trackList[i].track.name
            parsedObject.album = trackList[i].track.album
            parsedObject.duration_ms = trackList[i].track.duration_ms
            parsedObject.track_number = trackList[i].track.track_number
            parsedObject.artists = trackList[i].track.artists
            parsedObject.uri = trackList[i].track.uri
            // parsedObject.images = trackList[i].track.album.images
            parsedTracks.push(parsedObject)
        }

        console.log("Playlist", parsedTracks)
        return parsedTracks
    }

    function parseTracks(trackList, album=null) {
        // type = 'album', 'saved songs', etc.
        // return an object that can be used by any of the views to get/play songs, eg
        // const parsedObject = {}
        // console.log("ALBUM", album !== null)
        let parsedTracks = []
        // given an object that includes a track/items list, create a standard parsed object
        // if(type === 'playlist' || 'album') {
            // object.tracks.items
            // image URL tied to palylist/album object, not track details directly
            for(let i = 0; i < trackList.length; i++) {

                let parsedObject = {}

                parsedObject.id = trackList[i].id
                parsedObject.name = trackList[i].name

                if(album !== null) {
                    parsedObject.album = album
                } else {
                    parsedObject.album = trackList[i].album
                }
                // parsedObject.album = trackList[i].album
                parsedObject.duration_ms = trackList[i].duration_ms
                parsedObject.track_number = trackList[i].track_number
                parsedObject.artists = trackList[i].artists
                parsedObject.uri = trackList[i].uri
                parsedTracks.push(parsedObject)
            }
        // }

        // console.log("Parsed tracks", parsedTracks)
        return parsedTracks
    }

module.exports = {
    createContextArray,
    parseTracks,
    parsePlaylistTracks,
    parseSavedTracks
}