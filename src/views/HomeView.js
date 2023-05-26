import {useState, useEffect} from 'react'


import Shelf from '../components/Shelf'
import CardGrid from '../components/CardGrid'
import Grid from '../components/Grid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPlus} from '@fortawesome/free-solid-svg-icons'



function HomeView(props) {

    // console.log('home props', props)
    return(
        <div className="home-view">

            {props.playlists.length > 0 ? 
                // Currently working on shelf, but carousel would be the origina
                <Shelf 
                    items={props.playlists}
                    toggleView={props.toggleView}
                    controls={props.controls}
                />
                :<span>No Playlists</span>}

            {/* Grid of users playlists */}

            <Grid 
                title={'Your playlists'}
                items={props.playlists.slice(0, 20)}
                toggleView={props.toggleView}
                controls={props.controls}
                handlePagination={null}
                createType={'playlist'}
                toggleModal={props.toggleModal}
            />

        </div>
    )
}

export default HomeView

/**
 * 
 * Home view should display:
 * 
 *       Recently played playlists
 * 
 *       A grid showing the users playlists in descending order, with the first option being to create a new playlist
 *          For now, use CardGrid with users playlists as props, it will probably do the trick anyways, maybe add a background for contrst
 */