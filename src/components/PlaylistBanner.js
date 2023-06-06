import {useState, useEffect} from 'react';

/**
 * 
    There needs to be some distinction from library/playlist, maybe a 'toggleBanner' flag to turn off when needed
 */
function PlaylistBanner(props) {
    // name, picture, creator, num_songs, 
    // props.library == true the playlist is set to library
    function displayBanner(viewType) {
        if(viewType === 'playlist') {
            return displayPlaylistBanner()
        } else if(viewType === 'album') {
            return displayAlbumBanner()
        }
    }

    function displayAlbumBanner() {
        return(<>
            <img src={props.playlist.images[0].url} alt={props.playlist.name} />
            <div className="playlist-banner-details">
                <h1 className="playlist-banner-header">{props.playlist.name}</h1>
                <div className="playlist-banner-sub">
                    <p className="playlist-banner-text">{props.playlist.tracks.total} songs</p>
                    <p className="playlist-banner-text">1 hour 40min</p>
                    <p className="playlist-banner-text">{props.playlist.tracks.items[0].artists[0].name}</p>
                </div>

            </div>
            {/* <h2>{props.followers} followers</h2> */}
        </>
    )
    }
    function displayLibraryBanner() {
        // library banner is a custom banner that differs from the typical banner
        // flesh this out later
        return (
            <div className="playlist-banner">
                <h1>Shawn's Library</h1>
            </div>
        )
    }

    function displayPlaylistBanner() {
        // also display length of playlist in time
        return(<>
                <img src={props.playlist.images[0].url} alt={props.playlist.name} />
                <div className="playlist-banner-details">
                    <h1 className="playlist-banner-header">{props.playlist.name}</h1>
                    <div className="playlist-banner-sub">
                        <p className="playlist-banner-text">{props.playlist.tracks.total} songs</p>
                        <p className="playlist-banner-text">1 hour 40min</p>
                        <p className="playlist-banner-text">Created by {props.playlist.owner.display_name}</p>
                    </div>

                </div>
                {/* <h2>{props.followers} followers</h2> */}
            </>
        )
    }
    return(
        <div className="playlist-banner">
            {props.library === true ? displayLibraryBanner() : displayBanner(props.viewType)}
        </div>
    )
}

export default PlaylistBanner