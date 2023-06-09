import {useState, useEffect, useRef} from 'react';

import ShelfAddCard from '../components/ShelfAddCard'
import TrackTableMini from '../components/TrackTableMini'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faImage} from '@fortawesome/free-solid-svg-icons'


const MYPLAYLISTID = '37i7cmrZzQ3irpEJbyqIw9'


function CreatePlaylistMenu(props) {

    const [initial, setInitial] = useState(true) 
    const playlistID = useRef()

    function displayCreatePlaylistMenu() {
        if(initial === true) {
            return(
                <CreatePlaylistDetailsMenu 
                    submit={setInitial}
                />
            )
        } else if(initial === false) {
            return (
                <CreatePlaylistAddItems />
            )
        }
    }

    function _createPlaylist_(name, description, image) {
        // leaving this here for now to bypass the playlist creation
        props.toggleModal()
        props.toggleView('playlist', MYPLAYLISTID)
    }
    function handleClick(e) {
        // get name, desc, image (not image for now)

        const menu = e.target.parentNode
        const image = 'imageLocation'
        const name = menu.firstChild.children[1].value
        const description = menu.children[1].value
        _createPlaylist_('MyPlaylist', 'My test playlist', image)
    }

    function createPlaylist(name, description, image) {
        // using name, desc, user, image, create the playlist in spotify
        fetch(`https://api.spotify.com/v1/users/${props.user.id}/playlists`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${props.accessToken}`
            },
            body: JSON.stringify({
                name: name,
                public: true,
                collaborative: false,
                description: description
            })
        }).then((response) => response.json())
        .then((data) => {
            console.log("CREATE PLAYLIST DATA", data)
                console.log("Playlist created")
                playlistID.current = data.id
                props.toggleModal()
                props.toggleView('playlist', data.id)
        }).catch(
            console.log("There was an error creating playlist.")
        )
    }

    return(
        <div className="create-playlist-menu">


            <div className="create-playlist-menu-form">
            <div className="create-playlist-menu-head">
                <ShelfAddCard icon={faImage}/>
                <input className="create-playlist-menu-nameinput" placeholder="New Playlist"></input>
            </div>
            <textarea className="create-playlist-menu-input" placeholder="Write a short description of your new playlist."></textarea>
            <button onClick={handleClick} className="create-playlist-menu-btn">Create Playlist</button>
        </div>
        </div>
    )
}


function CreatePlaylistDetailsMenu(props) {

    // Name of the playlist is spome default value (Playlist1, etc)
    // description is a small text area users can write a description of the playlist with (defaults to empty string/nothing)
    //public is boolean to set public/private, defaults to true
    //collaborative is a boolean that toggles collarborative, defaults to false, it true must be public
    // can add a custom cover image (fileupload) defaults to empty array/null/undefined (whatever doesn't cause an error and will trigger the 'No Image' catch)

    function createPlaylist(image, name, description) {
        console.log(image, name, description)
        // assuming this is successful, close this part of the menu and open the 'add tracks' and search tables
        // props.submit(false)
        props.toggleView('createPlaylist')

    }

    function handleClick(e) {
        const menu = e.target.parentNode
        const image = 'imageLocation'
        const name = menu.firstChild.children[1]
        const description = menu.children[1]
        createPlaylist(image, name, description)

    }
    return(
        <div className="create-playlist-menu-form">
            <div className="create-playlist-menu-head">
                <ShelfAddCard icon={faImage}/>
                <input className="create-playlist-menu-nameinput" placeholder="New Playlist"></input>
            </div>
            <textarea className="create-playlist-menu-input" placeholder="Write a short description of your new playlist."></textarea>
            <button onClick={handleClick} className="create-playlist-menu-btn">Create Playlist</button>
        </div>

    )
}

function CreatePlaylistAddItems() {
    // two tables for adding/removing tracks from playlist, top is playlist in current state, bottom is tracks to add
    // tracks to Add has a search feature that wil display tracks with an Add button that, when selected, will add the tracks to the playlist at the top

    return(
        <div className="create-playlist-menu-tables">

            <div className="create-playlist-search-container">
                <input className="create-playlist-search-input" placeholder="Search for tracks to add to playlist"></input>
                <TrackTableMini />
            </div>
        </div>
    )
}
export default CreatePlaylistMenu