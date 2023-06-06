import {useState, useEffect} from 'react';
import ShelfCard from './ShelfCard'
import {truncateText} from '../helpers/functions';
import { v4 as uuidv4 } from 'uuid';

/*
    CardGrid takes an object of albums/playlists/artists and displays the shelf cards of those
*/
function CardGrid(props) {

    function handleScroll() {
        if(window.innerHeight + 1 + window.scrollY >= document.body.offsetHeight) {
            props.handlePagination()
            window.scrollTo(0, document.documentElement.scrollTop)
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return(
        <div className="card-grid-grid" >
            {props.results.map((result) => 
                <ShelfCard
                    key={uuidv4()} 
                    item={result}
                    toggleView={props.toggleView}
                />
            )}
        </div>
    )

}

function GridCard(props) {
    console.log("Grid card props", props)
    function handleClick(id) {
        props.toggleView()
    }

    return(
        <div className="shelf-card" onClick={handleClick}>
            <p>{truncateText(props.item.name)}</p>
            {props.item.images.length > 0 ?
                <img src={props.item.images[0].url} alt={props.item.id}/>
            :<span>No Image</span>}

        </div>
    )
}
export default CardGrid