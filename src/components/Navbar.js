import {useState, useEffect} from 'react';
import NavbarDropdown from './NavbarDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faHouse, faMagnifyingGlass, faBook, faRecordVinyl, faMusic} from '@fortawesome/free-solid-svg-icons'



export default function Navbar(props) {

    return(
        <div className="navbar">
            <NavbarHeader toggleView={props.toggleView}/>
            <hr></hr>
            <NavbarItem 
                category={'Playlists'} 
                playlists={props.playlists} 
                setPlaylists={props.setPlaylists}
                toggleView={props.toggleView}
            />
        </div>
    )
}

function NavbarHeader(props) {
    // Element at top of navbar with shortcuts to Home/Search/Libray   
    
    function handleClick(param) {
        props.toggleView(param)
    }
    return(
        <div className="navbar-header">
            <div className="navbar-header-item">
                <FontAwesomeIcon icon={faHouse} onClick={() => handleClick('home')}/>
            </div>
            <div className="navbar-header-item">
                <FontAwesomeIcon icon={faMagnifyingGlass} onClick={() => handleClick('search')}/>
            </div>
            <div className="navbar-header-item">
                <FontAwesomeIcon icon={faMusic}  onClick={() => handleClick('library')}/>
            </div>
        </div>
    )
}

function NavbarItem(props) {

    const [dropdown, setDropdown] = useState('none')

    function handleClick(e) {
        e.stopPropagation()
        if(dropdown === 'none') {
            setDropdown('flex')
        } else if(dropdown === 'flex') {
            setDropdown('none')
        }
    }

    return(
        <div className="navbar-item" >
            <p onClick={handleClick}>{props.category}</p>
            <NavbarDropdown 
                visible={dropdown} 
                playlists={props.playlists} 
                setPlaylists={props.setPlaylists}
                toggleView={props.toggleView}
                />
        </div>
    )
}