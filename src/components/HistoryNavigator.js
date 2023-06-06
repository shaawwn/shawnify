import {useState, useEffect} from 'react';
import useHistory from '../hooks/useHistory'



import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCaretRight, faCaretLeft} from '@fortawesome/free-solid-svg-icons'

function HistoryNavigator(props) {
    
    function handleClick(direction) {
        if(direction === 'back') {
            let [view, content] = props.history.back()
            console.log("View: ", view, "Content: ", content)
            props.toggleView(view, content, false)
        } else if(direction === 'next') {
            let [view, content] = props.history.forward()
            props.toggleView(view, content, false)
        }
    }

    useEffect(() => {

    }, [props.history])

    return(
        <div className="history-nav">
            <FontAwesomeIcon        className="history-nav-icon" 
                icon={faCaretLeft} 
                size="2x"
                onClick={() => handleClick('back')}
            />
            <FontAwesomeIcon    className="history-nav-icon" 
                icon={faCaretRight} 
                size="2x"
                onClick={() => handleClick('next')}
            />
        </div>
    )
}

export default HistoryNavigator