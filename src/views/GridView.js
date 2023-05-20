import {useState, useEffect} from 'react';

function GridView(props) {

    return(
        <div className="grid-view">
            <h1>{props.title}</h1>
        </div>
    )
}

export default GridView