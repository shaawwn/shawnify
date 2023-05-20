import {useState, useEffect} from 'react';
import useTracks from '../hooks/useTracks'
import PlaylistBanner from '../components/PlaylistBanner'
import TrackTable from '../components/TrackTable'


function AlbumView(props) {

    const [album, trackScroll] = useTracks(props.accessToken, 'album', props.albumID)

    function populateTrackTable() {
        // console.log("Album details", album)
        // console.log("album tracks", album.tracks.items)
        return(
            <div>
                <TrackTable 
                    tracks={album.tracks.items} 
                    trackScroll={trackScroll}
                    toggleView={props.toggleView}
                    viewType="album"
                    controls={props.controls}
                    contextID={props.albumID}
                    accessToken={props.accessToken}
                    albumDetails={album}
                    />
            </div>
        )
    }


    useEffect(() => {   

    }, [album])

    return(
        <div className="album-view">
            {album ?
                <>
                    <PlaylistBanner playlist={album} viewType={'album'}/>
                    {populateTrackTable()}
                </>
                :<span></span>
        }

        </div>
    )
}

export default AlbumView