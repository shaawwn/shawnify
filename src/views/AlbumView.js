import {useState, useEffect} from 'react';

import SpotifyPlaylist from '../utils/SpotifyPlaylist';
import useTracks from '../hooks/useTracks';
import usePlaylist from '../hooks/usePlaylist'
import {useSearch} from '../hooks/useSearch';
import TrackTableMini from '../components/TrackTableMini';
import SearchMini from '../components/SearchMini'
import PlaylistBanner from '../components/PlaylistBanner'

function AlbumView(props) {

    // const [playlist, tracks, addTrack, removeTrack] = usePlaylist(props.accessToken, props.playlistID)
    // albums have less functionality than playlists (cannot add/remove, etc and for the most part will have < 100 tracks, so no need the hook, at least for now.)
    const [album, setAlbum] = useState()

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

    function displayContent() {

        return(
            <>
                <PlaylistBanner 
                    playlist={album} 
                    viewType="album"
                />
                <TrackTableMini 
                    tracks={album.tracks.items}
                    toggleView={props.toggleView}
                    viewType='album'
                    controls={props.controls}
                    albumDetails={album}
                    context_id={props.playlistID}
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

