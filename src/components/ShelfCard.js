import {truncateText} from '../helpers/functions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUser} from '@fortawesome/free-solid-svg-icons'
export default function ShelfCard(props) {
    // specifically for displaying on the shelf
    // console.log('shelf card props', props)

    function handleClick(id) {
        // console.log("Clicking", props.item.id)
        props.toggleView(props.item.type, props.item.id)
    }

    return(
        <div className="shelf-card" onClick={handleClick}>
            <p className="shelf-card-title">{truncateText(props.item.name)}</p>
            {props.item.images.length > 0 ?
                <img src={props.item.images[0].url} alt={props.item.id}/>
            // :<span>No Image</span>
            : <FontAwesomeIcon icon={faUser} size="5x"/>
            // Give a blank image if span
            }
            {/* <img src={props.item.images[0].url} alt={props.item.id}/> */}
        </div>
    )
}