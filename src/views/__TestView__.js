import {useState, useEffect} from 'react'

import useTracks from '../hooks/useTracks'

function __TestView__(props) {

    const tracks = useTracks(props.accessToken, 'library')

    useEffect(() => {
        if(tracks) {
            console.log(tracks)
        }
    }, [tracks])

    return(
        <div>
            <h1>Test View.</h1>
        </div>
    )
}

export default __TestView__