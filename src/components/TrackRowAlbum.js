import {useState, useEffect} from 'react'
import {msToMinutesAndSeconds, truncateText} from '../helpers/functions';

// Track row is gonna have all the playback, link,click functionality



function TrackRowAlbum({title, artist, album, playlist, duration_ms, id, artistID, toggleView, controls, context, offset, track}) {

    function handleClick(context, offset, track) {
        // clicking on a row should play the song (context will be album id)

        const context_uri=`spotify:album:${context}`
        track['album'] = album
        console.log("Clicming album row", track)
        controls('start', context_uri, null, offset, 0, {track})
        // controls('start', context_uri, null, offset, 0, {track})
    }

    function handleLink(e, id, viewType) {
        // clicking specifically on the link to artist/album should take you to those respective views
        // viewType = artist/album views
        // id = artist/album id
        e.stopPropagation()
        if(viewType === 'artist') {
            toggleView('artist', artistID)
        } else if(viewType === 'album') {
            toggleView('album', album.id)
        }

    }


    return(
        <tr className="track-table-row" onClick={() => handleClick(context, offset, track)} data-testid="track-row">
            <td className="track-table-item">
                    <p className="track-table-item-title">{truncateText(title)}</p>
                    <p className="track-table-item-title-artist" onClick={(e) => {handleLink(e, artistID, 'artist')}} data-testid="artist-link">{truncateText(artist)}</p>
            </td>
            {album && 
                <td className="track-table-item">
                    <span className="track-table-item-title-artist" onClick={(e) => handleLink(e, album.id, 'album')} data-testid="album-link">{album.name}</span>
                </td>
            }
            <td className="track-table-item">
                {msToMinutesAndSeconds(duration_ms)}
            </td>
            {playlist && 
                <td className="track-table-item">
                    <button>Add</button>
                </td>
            }
        </tr>
)
}

export default TrackRowAlbum