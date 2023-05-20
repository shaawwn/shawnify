import {useState, useEffect} from 'react';
import {truncateText} from '../helpers/functions'
export default function NavbarDropdown(props) {



    function handleClick(playlistID) {
        props.toggleView('playlist', playlistID)
    }
    
    return(
        <div className="navbar-dropdown" style={{display: props.visible}}>
            {props.playlists.map((playlist) => 
                <p onClick={() => handleClick(playlist.id)} className="navbar-dropdown-item" key={playlist.id}>{playlist.name}</p>
            )}
        </div>

    )
}