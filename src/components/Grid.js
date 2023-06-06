import {useState, useEffect} from 'react';

import ShelfCard from '../components/ShelfCard'
import ShelfAddCard from '../components/ShelfAddCard'
import PlaylistCreate from '../components/PlaylistCreate'
import { v4 as uuidv4 } from 'uuid';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPlus} from '@fortawesome/free-solid-svg-icons'



function Grid(props) {

    // props.handlePagination can be null, if so, do not add scroll event

    function handleClick() {
        // when clicking on the grid itself(and not a card), open a new view that shows ALL the content
        // console.log("Opening view")
    }


    function handleScroll() {
        if(window.innerHeight + 1 + window.scrollY >= document.body.offsetHeight) {
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
                {displayGrid()}
            </div>
        </div>
    )
}

export default Grid