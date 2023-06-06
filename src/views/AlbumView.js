import {useState, useEffect} from 'react';

import TrackTable from '../components/TrackTable'
import PlaylistBanner from '../components/PlaylistBanner'

function AlbumView(props) {

    // const [playlist, tracks, addTrack, removeTrack] = usePlaylist(props.accessToken, props.playlistID)
    // albums have less functionality than playlists (cannot add/remove, etc and for the most part will have < 100 tracks, so no need the hook, at least for now.)
    const [album, setAlbum] = useState()

    function trackScroll() {
        //
    }

    function getAlbum() {
        fetch(`https://api.spotify.com/v1/albums/${props.playlistID}`, {
            headers: {
                'Authorization': `Bearer ${props.accessToken}`
            }
        }).then((response) => response.json())
        .then((data) => {
            setAlbum(data)
        })
    }

    function getAlbumTracks() {
        fetch(`https://api.spotify.com/v1/albums/${props.playlistID}/tracks`, {
            headers: {
                'Authorization': `Bearer ${props.accessToken}`
            }
        }).then((response) => response.json())
        .then((data) => {
            // console.log("Album tracks only", data)
        })
    }

    function displayContent() {

        return(
            <>
                <PlaylistBanner 
                    playlist={album} 
                    viewType="album"
                />
                <TrackTable 
                    playlist={false}
                    tracks={album.tracks.items}
                    metaData={album}
                    controls={props.controls}
                    toggleView={props.toggleView}
                    trackScroll={trackScroll}
                />
            </>

        )
    }

    useEffect(() => {
        if(props.accessToken) {
            getAlbum()
        }
    }, [])

    return(
        <div className="create-playlist-view">
            {album ? displayContent() : <h1>Loading playlist...</h1>}
        </div>
    )
}

export default AlbumView

