import {useState, useEffect} from 'react';
import {LinkCardAlbum, ShelfCard} from '../components/LinkCard'


/**
 * 
 *  You cant' crete folders with the spotify API, but you CAN add playlist/artist/album IDs to a seperate Database and then make a call like that.
 * 
 * Shelves should be a component/concept where you can pin/drag items to keep 'on the shelf' and then they are displayed like how spotify displays content now, except the user has full control over what items are placed and in what order.
 * 
 * Basically Spotify playlist folders, but in a more user friendly implementation
 * 
 * TODO! Since I probably have to set up a seperate server to handle it.
 */
export default function Shelf(props) {
    //props.items = array of playlist/albums to display on shelf



    function displayShelfItems() {
        // console.log("shelf props", props)
        // the first item should be 'add to shelf' option?
        return props.items.slice(0, 6).map((item) => 
            <ShelfCard 
                key={item.id}
                item={item}
                toggleView={props.toggleView}
                controls={props.controls}
            />
        )
    }

    return(
        <div className="shelf">
            {displayShelfItems()}
        </div>
    )
}