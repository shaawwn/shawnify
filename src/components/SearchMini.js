import {useState, useEffect, useRef} from 'react';
import TrackTableMini from '../components/TrackTableMini'
import useSearch from '../hooks/useSearch'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'

// 
function SearchMini(props) {

    const searchTypes =["album", "artist", "playlist", "track", "show"]

    const [search,searchResult, setSearchResult] = useSearch(props.accessToken)
    const [topResult, setTopResult] = useState()
    const [tracks, setTracks] = useState([])
    const [artists, setArtists] = useState([])
    const [albums, setAlbums] = useState([])
    const [playlists, setPlaylists] = useState([])
    const [shows, setShows] = useState([])
    const [filter, setFilter] = useState('all')
    const pagination = useRef()
    const [firstLoad, setFirstLoad] = useState(true) 
    const delay = useRef() 
    const query = useRef()


    function handleChange(e) {
        console.log("query value", e.target.value)
        if(e.target.value === '') {
            // do nothing because there is no value to search
            console.log("Nothing to search.")
            // clear results
            // setAllResults(undefined)
            setSearchResult()
            setTracks([])
            setArtists([])
            setAlbums([])
            setPlaylists([])
            setShows([])
            setFirstLoad(true)
            setFilter('all')
            return false
        }

        if(delay.current) {
            // as a user types, allow for a small buffer before making an actual fetch, using a timer interval.
            // if there is currently a timerInterval, user is still typing, clear current timer and reset
            clearTimeout(delay.current)
        }
        
        setFirstLoad(true)
        query.current = e.target.value // remove this 
        delay.current = setTimeout(() => search(e.target.value), 500)
    }

    function toggleFilter(filterType) {
        // TODO
        console.log("Toggling filter", filterType)
        // filter = filterType
        if(filterType === 'all') {
            pagination.current = undefined
        } else {
            pagination.current = searchResult[filterType].next
        }
        // console.log("Pagination url is: ", pagination.current)
        // because filter type is not changing
        setFilter(filterType)
    }

    function populateTrackTableMini() {
        // use Track table mini instead
        // console.log("POPPING TRACK TABLE SEARCH", tracks)
        return(
            <div>
                <TrackTableMini 
                    tracks={tracks}
                    accessToken={props.accessToken}
                    trackScroll={handlePagination}
                    toggleView={props.toggleView}
                    viewType="search"
                    controls={props.controls}
                    removeTrack={props.removeTrack}
                    addTrack={props.addTrack}
                />
            </div>
        )
    }

    function _parsePaginationURL(URL) {
        // get the 'type' attribute from a URL string
        // https://api.spotify.com/v1/search?query=rush&type=artist&locale=en-US%2Cen%3Bq%3D0.9&offset=20&limit=20"
        // let testURL = 'https://api.spotify.com/v1/search?query=rush&type=artist&locale=en-US%2Cen%3Bq%3D0.9&offset=20&limit=20'

        // console.log("parsing url", testURL.split("&")[1].split("=")[1])
        return URL.split("&")[1].split("=")[1]
    }

    function _queryMatch(toMatch) {
        const queryRegex = new RegExp(query.current, 'i')
        return queryRegex.test(toMatch)
    }

    function handlePagination() {
        console.log("HANDLING SEARCH PAGINATION")
        // handle the pagination for search results, including all types (album, track, artist)
        // console.log("Calling pagination from searchView")
        if(pagination.current === null) {
            // no more results to paginate
            return false 
        }

        fetch(pagination.current, {
            headers: {
                'Authorization': `Bearer ${props.accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
        .then((data) => {
            // check type
            const type =_parsePaginationURL(pagination.current)
            // console.log("type", type)

            setSearchResult(prevSearchResult => ({
                ...prevSearchResult,
                ...data
            }))
            // setSearchResult(prevSearchResult)
            // console.log("pagination data: ", data)
            if(type === 'track') {
                pagination.current = data.tracks.next
                setTracks(prevTracks => prevTracks.concat(data.tracks.items))
            } else if(type === 'album') {
                pagination.current = data.albums.next
                setAlbums(prevAlbums => prevAlbums.concat(data.albums.items))
            } else if(type === 'artist') {
                pagination.current = data.artists.next
                setArtists(prevArtists => prevArtists.concat(data.artists.items))
            } else if(type === 'playlist') {
                pagination.current = data.playlists.next
                setPlaylists(prevPlaylists => prevPlaylists.concat(data.playlists.items))
            }
            // pagination.current = data.tracks.next
        })
    }


    function displayResults() {
        // like the main display results, but only tracks
        if(searchResult !== undefined && tracks.length > 0) {
            // if(filter ===)
            return(
                <>
                    {populateTrackTableMini()}
                </>
            )
        }
    }
    useEffect(() => {
        if(searchResult) {
            // console.log("SEARCH RESULT", searchResult)
            if(firstLoad === true) {
                setArtists(searchResult.artists.items)
                setPlaylists(searchResult.playlists.items)
                setAlbums(searchResult.albums.items)
                setTracks(searchResult.tracks.items)
                setFirstLoad(false)
            } 

        }
    }, [searchResult])


    return(
        <div className="search-mini">
            <h1>Search for items to add!</h1>
            <div className="search-input-container-mini">
                    <FontAwesomeIcon 
                        className="search-input-icon"
                        icon={faMagnifyingGlass} 
                        // size="1x"
                        />
                    <input 
                        type="text" 
                        onChange={handleChange}
                        className="search-input"
                        // onKeyDown={handleKeyPress}
                        placeholder="What do you want to listen to?">
                    </input>
                </div>
                {/* {searchResult ? <ResultFilter toggleFilter={toggleFilter} />:<span></span>} */}
                {displayResults()}
        </div>
    )
}

// function ResultFilter(props) {
//     // filter results
//     const searchTypes =["all", "albums", "artists", "playlists", "tracks", "shows"]

//     function handleClick(filter) {
//         props.toggleFilter(filter)
//     }
//     return(
//         <div className="search-filter">
//             {searchTypes.map((search) => 
//                 <div key={search}className="search-filter-option" onClick={() => handleClick(search)}>
//                     <p key={search}>{search}</p>
//                 </div>
//             )}
//         </div>
//     )
// }
export default SearchMini