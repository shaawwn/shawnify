import {useState, useEffect} from 'react';
import {truncateText, msToMinutesAndSeconds} from '../helpers/functions'

import {getTopTracks, getAlbums} from '../utils/apiGetFunctions'
import {createContextArray} from '../utils/utils'
import {ShelfCard} from '../components/LinkCard'
import CardGrid from '../components/CardGrid';


function SearchTopResult(props) {
    // display top result for search (do it dynamically?) as you type
    // default is Artitst
    // console.log("Top results props", props)
    const [albums, setAlbums] = useState()
    const [topTracks, setTopTracks] = useState()

    function onLoad() {
        getTopTracks(props.results[0].id, props.accessToken, setTopTracks)
        getAlbums(props.results[0].id, props.accessToken, setAlbums)
    }

    function displayTopResultView() {

        if(topTracks && albums) {
            return(
                <>
                
                <div className="search-top-result__head">
                    <TopResultCard 
                        accessToken={props.accessToken} results={props.results[0]}
                        toggleView={props.toggleView}
                        />
                    {/* Small div that acts as a link (with play button) */}
                    <TopTracks 
                        topTracks={topTracks.slice(0, 6)} 
                        controls={props.controls}

                        />
                </div>
                {/* <CardGrid results={props.results}/> */}
                <TopResultAlbums 
                    id={props.results[0].id}
                    accessToken={props.accessToken}
                    toggleView={props.toggleView}
                    albums={albums.items}
                />
                </>
            )
        }
    }

    useEffect(() => {
        if(props.results) {
            onLoad()
        }
    }, [props.results])

    return(
        <div className="search-top-result">
            {/* <h1>{props.results[0].name}</h1> */}
            {displayTopResultView()}

            {/* Top songs */}
            
            {/* Albums */}

            {/* Playlists */}

            {/* Related Artists */}
        </div>
    )    
}

function TopResultCard(props) {

    // this assumes it is an artist
    const [albums, setAlbums] = useState([])
    const [topTracks, setTopTracks] = useState([])


    function handleClick(id) {
        //
        // props.toggleView('artist', id)
        console.log("Clicking", id)
    }
    return(
        <div className="top-result-card" onClick={() => handleClick(props.results.id)}>
            <img src={props.results.images[2].url} alt={props.results.id}></img>
            <h1>{props.results.name}</h1>
        </div>
    )
}

function TopTracks(props) {
    // console.log("Artist top tracks: ", props.topTracks)
    // console.log(createContextArray(props.topTracks))

    function handleClick(id, track) {
        console.log("Clicking", id, track)
        let formatTrack = {
            track: track
        }
        // console.log("new track", newTrack)
        props.controls('start', null, [`spotify:track:${id}`], null, 0, formatTrack)
    }
    return(
        <div className="top-tracks-container">
            <h1>Popular</h1>
            {props.topTracks.map((track) => 
                <div key={track.id} className="top-track-row" onClick={() => handleClick(track.id, track)}>
                    <img src={track.album.images[2].url} alt={track.album.name}></img>
                    <p>{truncateText(track.name)}</p>
                    <p>{truncateText(track.album.name)}</p>
                    <p>{msToMinutesAndSeconds(track.duration_ms)}</p>
                </div>
            )}
        </div>
    )
}

function TopResultAlbums(props) {
    // return albums for the top result

    function displayAlbums() {

        if(props.albums.length > 0) {
            return(
                <div className="search-top-result__albums">
                    {props.albums.map((album) => 
                        <ShelfCard 
                            key={album.id}
                            item={album}
                            toggleView={props.toggleView}
                        />
                    )}
                </div>
            )     
        }
        return(
            <div>
                <h1>Loading albums</h1>
            </div>
        )
    }

    return(
        <div className="search-top-result__albums">
            <h1>Albums here</h1>
            {displayAlbums()}
        </div>
    )
}
export default SearchTopResult