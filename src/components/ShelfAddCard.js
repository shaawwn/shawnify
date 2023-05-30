// visually similar to ShelfCard, but with added instead of linking to playlist/album item, open a Create menu to add content to whatever the shelf is, first do playlists

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPlus} from '@fortawesome/free-solid-svg-icons'


function ShelfCardAdd(props) {
    //TODO
    
    function handleClick() {
        props.toggleModal('createPlaylist')
        // clicking should toggle the modal (in this case createPlaylist)
        // modal opens over the current view, so no toggleView, need to add the modal to the DOM 
    }
    return(
        <div className="shelf-card" onClick={handleClick}>
            <FontAwesomeIcon icon={props.icon} size="8x" style={{}}/>
        </div>
    )
}

export default ShelfCardAdd