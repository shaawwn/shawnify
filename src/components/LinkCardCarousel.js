import {useState, useEffect, useRef} from 'react';
import {LinkCard} from './LinkCard'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCaretRight, faCaretLeft} from '@fortawesome/free-solid-svg-icons'
/*
    LinkCardCarousel takes the list of playlists as props
    using the range 5 (5 cards displayed at once), set the index of the carouself, eg [0, 5], [1, 6], [2, 7] until you reach the end

    Maybe loop around when it reaches the end
    So I actually want to put the MOST LISTENED stuff at the top, not necessarily the most recently made playlists
*/

export default function LinkCardCarousel(props) {

    // console.log('carousel props', props.playlists)

    const location = useRef(0) // left most value
    const max = props.playlists.length - 1 // index of last item
    const [toDisplay, setToDisplay] = useState(props.playlists.slice(location.current, location.current + 5))


    function handleClick(direction) {
        // so when you click a direction, move the value +/- 1 depending on direction, and check for the limit
        console.log('carousel should move:', direction, max, location.current)
    }

    function displayCards() {

        return props.playlists.slice(0, 6).map((playlist) => 
            <LinkCard 
                playlist={playlist} 
                key={playlist.id + 'link-card'}
                toggleView={props.toggleView}
                />
        )
    }


    return(
        <div className="link-card-carousel">
            {/* <FontAwesomeIcon icon={faCaretLeft} className="carousel-arrow" onClick={() => handleClick('left')}/> */}
            {displayCards()}
            {/* <FontAwesomeIcon icon={faCaretRight} className="carousel-arrow" onClick={() => handleClick('right')}/> */}
        </div>
    )
}