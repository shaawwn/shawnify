import {useState, useEffect} from 'react';

import {msToMinutesAndSeconds, truncateText} from '../helpers/functions';
import {createContextArray} from '../utils/utils';
import {LinkCard, LinkCardAlbum} from '../components/LinkCard'
import ArtistBanner from '../components/ArtistBanner'
import HistoryNavigator from '../components/HistoryNavigator';

/*
    I guess the API doesn't support filtering liked songs by artist (eg get all liked Songs by David Bowie)
    Might have to be something I do with a different server, eg build the users library on a seperate server, and then with that server can filter by artist
*/
function ArtistView(props) {

    const [artist, setArtist] = useState()
    const [artistAlbums, setArtistAlbums] = useState()
    const [topTracks, setTopTracks] = useState()
    const [relatedArtists, setRelatedArtists] = useState()
    const [following, setFollowing] = useState()

    function onLoad() {
        getArtist()
        getArtistAlbums()
        getTopTracks()
        getRelatedArtists()
    }
    
    function checkIfFollowing() {
        fetch(`https://api.spotify.com/v1/me/following/contains?type=artist&ids=${props.artistID}`, {
            headers: {
                'Authorization': `Bearer ${props.accessToken}`,
                // 'Content-Type'
            }
        }).then((response) => response.json())
        .then((data) => {
            // console.log("Following artist? ", data[0])
            setFollowing(data[0])

        })
    }


    function getRelatedArtists() {
        fetch(`https://api.spotify.com/v1/artists/${props.artistID}/related-artists`, {
            headers: {
                'Authorization': `Bearer ${props.accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
        .then((data) => {
            // console.log('Artist data', data)
            setRelatedArtists(data)
        })
    }


    function getArtistAlbums() {
        fetch(`https://api.spotify.com/v1/artists/${props.artistID}/albums`, {
            headers: {
                'Authorization': `Bearer ${props.accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
        .then((data) => {
            setArtistAlbums(data)
        })
    }


    function getTopTracks() {
        fetch(`https://api.spotify.com/v1/artists/${props.artistID}/top-tracks?market=US`, {
            headers: {
                'Authorization': `Bearer ${props.accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
        .then((data) => {
            setTopTracks(data.tracks)
        })
    }


    function getArtist() {
        fetch(`https://api.spotify.com/v1/artists/${props.artistID}`, {
            headers: {
                'Authorization': `Bearer ${props.accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
        .then((data) => {
            // console.log('Artist data', data)
            setArtist(data)
        })
    }


    function artistDetailsLoaded() {
        // since there are multiple async api calls, ensure that all content is loaded before trying to render 
        if(artist && artistAlbums && topTracks && relatedArtists) {
            return true
        } 
        return false
    }


    function displayArtistBasic() {

        if(artistDetailsLoaded()) {
            let albumProps; // this was created to limit the amount of albums returned on the artist page
            if(artistAlbums.items.length > 8) {
                albumProps = artistAlbums.items.slice(0,8)
            } else {
                albumProps = artistAlbums.items
            }
            return(
                <>  
                    <ArtistBanner artist={artist} />
                    <div className="top-tracks-albums-container">
                        <TopTracks 
                            topTracks={topTracks} 
                            controls={props.controls}
                            />
                        <ArtistViewAlbums 
                            albums={albumProps}
                            toggleView={props.toggleView}
                            controls={props.controls}
                            />    
                    </div>
                </>
            )
        } else {
            return(
                <h1>Loading artist...</h1>
            )
        }

    }


    useEffect(() => {
        onLoad()
    }, [])


    return(
        <div className="artist-view">
            {displayArtistBasic()}            
        </div>
    )
}


// function ArtistBanner(props) {

//     return(
//         <div className="playlist-banner">
//             <img src={props.artist.images[2].url} alt={props.artist.name}/>
//             <p>{props.artist.name}</p>
//             <p>Followers {props.artist.followers.total}</p>
//         </div>
//     )
// }


function ArtistViewAlbums(props) {
    return(
        <div>
            <h1>Albums</h1>
            <div className="artist-albums-container">
                {props.albums.map((album) => 
                    <LinkCardAlbum 
                        key={album.id}
                        item={album}
                        toggleView={props.toggleView}
                        controls={props.controls}
                        />
                )}
            </div>
        </div>

    )
}
function TopTracks(props) {

    const contextArray = createContextArray(props.topTracks)

    // pass 
    // function handleClick(id) {
    //     // add control playback
    //     console.log("Artist track ID", id, contextArray)
    //     // props.controls('start', id, context, trackPosition)
    // }

    function handleClick(id, offset) {
        // id is track id
        // play selected track
        // when handled from library, no need context, just play the song (not true I think)

        if(props.viewType === 'library') {

            // console.log("Library view dont use context_uri", createContextArray(props.tracks))
            props.controls('start', null, createContextArray(props.tracks), null, 0)
            return false
        } 
        const context_uri = `spotify:artist:${id}`

        props.controls('start', context_uri, null, null, 0) // don't need position_ms, for now at least
    }

    return(
        <div className="top-tracks-container">
            <h1>Popular</h1>
            {props.topTracks.map((track) => 
                <div key={track.id} className="top-track-row" onClick={() => handleClick(track.id)}>
                    <img src={track.album.images[2].url} alt={track.album.name}></img>
                    <p>{truncateText(track.name)}</p>
                    <p>{truncateText(track.album.name)}</p>
                    <p>{msToMinutesAndSeconds(track.duration_ms)}</p>
                </div>
            )}
        </div>
    )
}
export default ArtistView