import {useState, useEffect, useRef} from 'react';
import useTracks from '../hooks/useTracks'
import PlaylistBanner from '../components/PlaylistBanner'
import TrackTable from '../components/TrackTable'
import HistoryNavigator from '../components/HistoryNavigator';

import {parseTracks} from '../utils/utils'
/**
 * 
 * In all of these, the response Object is the overall details of the playlist/album/library
 * 
 * Still need 'tracks' in order to more easily handle the track table, but the responseObject itself has a lot of the details 
 */

function PlaylistView(props) {
    
    // console.log('playlist props', props.playlistID)
    // const {tracks, responseObject, handlePagination} = useTracks(props.accessToken, 'playlist', props.playlistID)

    const [playlist, trackScroll] = useTracks(props.accessToken, 'playlist', props.playlistID)


    // use tracks to get the offset of the track in playlist, eg tracks[0] would be offset 0 for whatever the song is
    // const [playlist, setPlaylist] = useState()

    function populateTrackTable() {
        // create a table and populate it with the track information
        // console.log("Playlist Tracks", tracks[0].artists[0].name)
        // console.log("In playlistview", playlist.tracks.items)
        console.log("tracks: ", playlist.tracks.items)
        
        return(
            <div>
                <TrackTable 
                    tracks={playlist.tracks.items} 
                    trackScroll={trackScroll}
                    toggleView={props.toggleView}
                    viewType="playlist"
                    controls={props.controls}
                    contextID={props.playlistID}
                    />
            </div>
        )
    }

    // ORIGINAL
    // useEffect(() => {
    //     // changed dependy from props.playlistID to useTrack response object and removed getPlaylist()
    //     // This I need because it is actually using the playlist response, which has more data than JUST the tracks
    //     if(responseObject) {
    //         setPlaylist(responseObject)
    //         // getPlaylistData()
    //         // getPlaylistTracks()
    //     }
    // }, [responseObject])

    useEffect(() => {
        // console.log("Playlist: ", playlist, pagination)
    }, [playlist])

    return(
        <div className="playlist-view">  
            {playlist ? 
            <>
                <PlaylistBanner 
                    playlist={playlist} 
                    viewType="playlist"
                />
                {populateTrackTable()}
            </>
            :<span>Loadin' Playlist...</span>}
        {/* <p>Loadin' playlist.......</p> */}
        </div>

    )
}

export default PlaylistView



// / NEW THING
// export default function __PlaylistView(props) {
    
//     const [playlist, setPlaylist] = useState()
//     const [tracks, setTracks] = useState([])
//     const pagination = useRef()

//     function populateTrackTable() {
//         // create a table and populate it with the track information
//         return(
//             <div>
//                 <TrackTable 
//                     tracks={playlist.tracks.items} 
//                     accessToken={props.accessToken} 
//                     handlePagination={handlePagination}
//                     toggleView={props.toggleView}
//                     viewType="playlist"
//                     // playback={props.playback}
//                     // controls={props.controls}
//                     />
//             </div>
//         )
//     }

//     function handlePagination() {
//         console.log("pagination")
//         if(pagination.current === null) {
//             // no more songs to load
//             return false
//         }
//         fetch(pagination.current, {
//             headers: {
//                 'Authorization': `Bearer ${props.accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         }).then((response) => response.json())
//         .then((data) => {
//             if(data.next === null) {
//                 // last page
//                 setTracks(prevTracks => prevTracks.concat(data.items)) 
//                 pagination.current = data.next
//             } else {
//                 pagination.current = data.next
//                 setTracks(prevTracks => prevTracks.concat(data.items))
//             }            
//         })
//     }

//     function getPlaylist() {
//         console.log("Calling get playlist")
//         fetch(`https://api.spotify.com/v1/playlists/${props.playlistID}`, {
//             headers: {
//                 'Authorization': `Bearer ${props.accessToken}`,
//                 'Content-Type': 'application/json'
//             }
//         }).then((response) => response.json())
//         .then((data) => {
//             // playlist goes data.tracks.items
//             console.log("PLAYTLIST DATA", data)
//             setPlaylist(data)
//             setTracks(data.tracks.items)
//             pagination.current = data.next
//         })
//     }

//     useEffect(() => {
//         // fetch(`https://api.spotify.com/v1/playlists/${props.playlistID}`, {
//         //     headers: {
//         //         'Authorization': `Bearer ${props.accessToken}`,
//         //         'Content-Type': 'application/json'
//         //     }
//         // }).then((response) => response.json())
//         // .then((data) => {
//         //     // playlist goes data.tracks.items
//         //     console.log("PLAYTLIST DATA", data)
//         //     setPlaylist(data)
//         //     setTracks(data.tracks.items)
//         //     pagination.current = data.next
//         // })
//         if(props.accessToken) {
//             getPlaylist()
//         }
//     }, [])


//     return(
//         <div className="playlist-view">  
//             {playlist ? <>
//                 <PlaylistBanner playlist={playlist} viewType="playlist"/>
//                 {populateTrackTable()}
//             </>
//             :<span>Loadin'...</span>    
//         }
//         </div>

//     )
// }
/**
 * 
 * So the problem with Playlist and album is: 
 * 
 * playlist - res.tracks.items[0].tracks.<track details>
 * album - res.tracks.items[0].<track details>
 * 
 * with playlist, there is an additional level to the object: track, where track details are held
 * 
 * So in tracktable, where you populate the rows, for album you would only need 
 *     <td className="table-item">
 *          {truncateText(track.name)}
 *         </td>
 * 
 * whereas playlist would be: 
 *     <td className="table-item">
 *          {truncateText(track.track.name)}
 *      </td>
 * 
 *      with the addiontal track
 * 
 * I could try and format it to a new object, since I dont think I'll need ALL the data returned in an object, for example I don't THINK I need date added, etc.
 * 
 * But I think savedSongs are the same way, the problem is that for Album, because it is EXPLICITELY an album, it doesnt have data int he object for 'album', artitst is diffetrent etc, because it is redundant
 */