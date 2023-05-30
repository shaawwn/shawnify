import {useState, useEffect} from 'react';

import ShelfCard from '../components/ShelfCard'
import ShelfAddCard from '../components/ShelfAddCard'
import PlaylistCreate from '../components/PlaylistCreate'
import {truncateText} from '../helpers/functions'
import { v4 as uuidv4 } from 'uuid';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPlus} from '@fortawesome/free-solid-svg-icons'



/**
 * 
 * @param {title, items, toggleView, controls} props 
 * @returns Grid
 * 
 * title is the title to be dispalyed at top of grid, eg 'Your Playlists'
 * 
 * items are to be displayed in grid, shelf/grid cards in grid format with an image and (probably) the title of the item, passed as an array of objects
 * 
 * toggleView and controls are functions
 * 
 * Only render 20 items, after that, click on the grid to open a new view that shows all playlists (with pagination if needed)
 */



function Grid(props) {
    // console.log("Grid props", props)
    // props.handlePagination can be null, if so, do not add scroll event
    function handleClick() {
        // when clicking on the grid itself(and not a card), open a new view that shows ALL the content
        // console.log("Opening view")
    }


    function handleScroll() {
        if(window.innerHeight + 1 + window.scrollY >= document.body.offsetHeight) {
            // console.log("Scrolling")
            props.handlePagination()
            window.scrollTo(0, document.documentElement.scrollTop)
        }
    }

    useEffect(() => {

        if(props.handlePagination === null) {
            //
        } else {
            window.addEventListener('scroll', handleScroll)

            return () => {
                window.removeEventListener('scroll', handleScroll)
            }
        }

    }, [])

    //// REMOVE

    function displayGrid() {
        // if there are items, display the grid with items, 
        // if not, display the PlaylistCreate menu with a message

        if(props.items.length > 0) {
            return(
                <>
                    {props.createType === 'playlist'? 
                    
                    <ShelfAddCard 
                        toggleModal={props.toggleModal}
                        icon={faPlus}
                    />
                    :<span></span>
                    }
                    {props.items.map((item) => 
                        <ShelfCard 
                            key={uuidv4()}
                            item={item}
                            toggleView={props.toggleView}
                            controls={props.controls}
                        />
                    )}
                </>
            )
        }

        return(
            <>
                <h1>You have no playlists, create your first!</h1>
                <PlaylistCreate />
            </>
        )
    }
    return(
        <div className="card-grid">
            <p className="card-grid-title">{props.title}</p>
            <div className="card-grid-grid" onClick={handleClick} data-testid='card-grid'>
                {/* Grid content, playlists/album cards in grid view */}
                {displayGrid()}
            </div>
        </div>
    )
}

export default Grid