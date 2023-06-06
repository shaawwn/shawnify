import {useState, useEffect} from 'react';
import {truncateText} from '../helpers/functions'
// import componentStyle from '../styles/componentStyles.css'


function LinkCard(props) {

    function handleClick(playlistID) {
        console.log('clicking link card', playlistID)
        props.toggleView('playlist', playlistID)
    }
    return(
        <div className="link-card" onClick={() => handleClick(props.playlist.id)}>
            <img src={props.playlist.images[0].url} alt={props.playlist.id}></img>
            <p>{props.playlist.name}</p>
        </div>
    )
}

function ShelfCard(props) {
    // specifically for displaying on the shelf

    function handleClick(id) {
        props.toggleView(props.item.type, props.item.id)
    }

    return(
        <div className="shelf-card" onClick={handleClick}>
            <p>{truncateText(props.item.name)}</p>
            {props.item.images.length > 0 ?
                <img src={props.item.images[0].url} alt={props.item.id}/>
            :<span>No Image</span>
            }
        </div>
    )
}

function LinkCardAlbum(props) {
    // link card but looks more like an album cover
    // takes album/playlist object as props)
    function handleClick(albumID) {
        props.toggleView('album', albumID)
    }

    return(
        <div className="playlist-cover" onClick={() => handleClick(props.item.id)}>
            <p>{truncateText(props.item.name)}</p>
            <img src={props.item.images[1].url} alt={props.item.id}/>
        </div>
    )
}
function LinkCardSmall(props) {

    return(
        <div className="link-card-small">
            <h2>Link Card(sm)</h2>
        </div>
    )
}

export {LinkCard, LinkCardSmall, LinkCardAlbum, ShelfCard}