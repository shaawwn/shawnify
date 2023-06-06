import {useState, useEffect, useRef} from 'react';

import SearchTopResult from '../components/SearchTopResult'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
import CardGrid from '../components/CardGrid';
import Grid from '../components/Grid';
import HistoryNavigator from '../components/HistoryNavigator';
import TrackTable from '../components/_TrackTable'
import useSearch from '../hooks/useSearch';


function SearchView(props) {
    
    const searchTypes =["album", "artist", "playlist", "track", "show"]
    const [
            search, 
            searchResult, 
            setSearchResult, 
            // handlePagination,
            // pagination
        ] = useSearch(props.accessToken)

    // const queryString = useRef('')
    // const filterVisible = useRef('none')
    // const queryDelay = useRef(500)
    // const [allResults, setAllResults] = useState()
    const [topResult, setTopResult] = useState()
    const [tracks, setTracks] = useState([])
    const [artists, setArtists] = useState([])
    const [albums, setAlbums] = useState([])
    const [playlists, setPlaylists] = useState([])
    const [shows, setShows] = useState([])
    const [filter, setFilter] = useState('all')
    const pagination = useRef()
    const [firstLoad, setFirstLoad] = useState(true) // this is required to make a distinction between a new search and updating curreny results, such as paginating current results (tracks, albums, etc.)
    const delay = useRef() // delay search queries to allow for user to complete typing a query
    const query = useRef()
    


    function handleChange(e) {
        // console.log("query value", e.target.value)
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
    

    function populateTrackTable() {

        // let handlePagination;
        // console.log("Track table in search", tracks)
        return(
            <div>
                <TrackTable
                    tracks={tracks} 
                    accessToken={props.accessToken} 
                    // getSavedSongs={getSavedSongs}
                    trackScroll={handlePagination}
                    toggleView={props.toggleView}
                    viewType="search"
                    controls={props.controls}
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
        // by default, the topResult from artists will display on a search
        // if possible, results should display user saved content first
        // findTopMatch(query.current, searchResult)
        if(searchResult !== undefined && artists.length > 0) { // allResult set on fetch
            // console.log("All results", searchResult)
            // findTopMatch(query.current, searchResult) // this is infinite loop since it is setting state
            if(filter === 'all') {
                return(
                    <SearchTopResult
                        accessToken={props.accessToken}
                        results={artists}
                        toggleView={props.toggleView}
                        controls={props.controls}
                    />
            )
            } else if(filter === 'artists') {
                // return Card Grid with artists as props
                // console.log("Setting to artists")
                // return(
                //     <CardGrid 
                //         results={artists}
                //         toggleView={props.toggleView}handlePagination={handlePagination}
                //     />
                // )
                return(
                    <Grid 
                    // title={''}
                    items={artists}
                    toggleView={props.toggleView}
                    controls={props.controls}
                    handlePagination={handlePagination}
                />)
            } else if(filter === 'playlists') {
                // return CardGrid with playlists
                // return(
                //     <CardGrid 
                //         results={playlists}
                //         toggleView={props.toggleView}
                //         handlePagination={handlePagination}
                //     />
                // )
                return(
                    <Grid 
                    // title={''}
                    items={playlists}
                    toggleView={props.toggleView}
                    controls={props.controls}
                    handlePagination={handlePagination}
                />)
            } else if(filter === 'tracks') {
                // console.log("Tracks", tracks)
                // return TrackTable with tracks
                return(
                    <>
                        {populateTrackTable()}
                    </>
                )
            } else if(filter === 'albums') {
                // return CardGrid with albums
                // return(
                //     <CardGrid 
                //         results={albums}
                //         toggleView={props.toggleView}
                //         handlePagination={handlePagination}
                //     />
                // )
                return(
                    <Grid 
                    // title={''}
                    items={albums}
                    toggleView={props.toggleView}
                    controls={props.controls}
                    handlePagination={handlePagination}
                />)
            }

        } else {
            // console.log("Error in search:, ", artists, albums, tracks, playlists)
            return(
                <SearchHome />
            )
        }
    }

    useEffect(() => {
        if(searchResult) {
            // setState here form search result
            // console.log("Search result", searchResult)
            // findTopMatch(query.current, searchResult)
            // load once
            // console.log("New result", searchResult)
            if(firstLoad === true) {
                // console.log("Loading first")
                setArtists(searchResult.artists.items)
                setPlaylists(searchResult.playlists.items)
                setAlbums(searchResult.albums.items)
                setTracks(searchResult.tracks.items)
                setFirstLoad(false)
            } 

        }
    }, [searchResult])

    return(
        <div className="search-view">
            <div className="search-view-header">
                {/* <HistoryNavigator /> */}
                <div className="search-input-container">
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

            </div>
            {/* <ResultFilter visible={filterVisible.current} /> */}

            {/* Big old grid that is reuasable, call it content-grid, usable for album/playlists, browse, etc*/}
            {/* {displayResults()} */}
            {searchResult ? <ResultFilter toggleFilter={toggleFilter}/> : <span></span>}
            {displayResults()}
        </div>
    )
}

function SearchHome(props) {

    return(
        <div className="">
            <h1>Recent Searches here</h1>
            <div className="content-grid"> 
                <h1>Display Browsing Grid TODO</h1>
            </div>   
        </div>
    )
}

// 

function ResultFilter(props) {
    // filter results
    const searchTypes =["all", "albums", "artists", "playlists", "tracks", "shows"]

    function handleClick(filter) {
        props.toggleFilter(filter)
    }
    return(
        <div className="search-filter">
            {searchTypes.map((search) => 
                <div key={search}className="search-filter-option" onClick={() => handleClick(search)}>
                    <p key={search}>{search}</p>
                </div>
            )}
        </div>
    )
}

export default SearchView;


// function ResultsDropdown(props) {

    //     function handleClick(id) {
    //         console.log("Clicking", id)
    //         props.toggleView('results', id)
    //     }
    //     // useEffect(() => {
    
    //     // }, [props.visible])
    
    //     return(
    //         <div className="results-dropdown" style={{display: props.visible}}>
    //             {/* <h1>Results here</h1> */}
    //             {props.artists.map((artist) => 
    //                 <p onClick={() => handleClick(artist.id)} key={artist.id}>{artist.name}, {artist.popularity}</p>
    //             )}
    //         </div>
    //     )
    // }


    // function handleKeyPress(e) {
    //     // console.log("keydown", e.code, queryString.current)
    //     // queryString not changing here only when pressing enter
    //     // check for backspace and blank search query
    //     if(e.code === 'Enter') {
    //         console.log('searchin for: ', e.target.value)
    //         handleSearch(e.target.value)
    //         queryString.current = e.target.value
    //         filterVisible.current = 'flex'
    //         // console.log('query: ', queryString.current)
    //     }
    // }


    // function handleSearch(queryString) {
    //     // console.log("Handling search for: ", queryString)
    //     fetch(`https://api.spotify.com/v1/search?q=${queryString}&type=${searchTypes}`, {
    //         headers: {
    //             'Authorization': `Bearer ${props.accessToken}`,
    //             'Content-Type': 'application/json'
    //         }
    //     }).then(response => response.json())
    //     .then((data) => {
    //         // search returns albums, aritsts, tracks, playlists, podcasts (data.albums, data.artists...)
    //         // console.log("search results", data.artists)
    //         // console.log('search results ALL', data)
    //         if(data.error) {
    //             return false
    //         }
    //         setAllResults(data)
    //         setArtists(data.artists.items)
    //         setPlaylists(data.playlists.items)
    //         setAlbums(data.albums.items)
    //         setTracks(data.tracks.items)
    //         setShows(data.shows.items)

    //     })
    // }


    // function findTopMatch(query, searchResponse) {
    //     // searching should return a 'top match' with a heirarch of artist -> album -> track -> playlist
    //     // that is, if there is an EXACT match in track, return the track as the top result as opposed to the artist who wrote the track
    //     // do this by filtering the top results (index 0) from each of the search types and if there is an exact match return it (in hierchacal order)
    //     // console.log("Search query and response", query, searchResponse)

    //     for(let i = 0; i < searchTypes.length; i++) {
    //         // return false
    //         if(searchTypes[i] + 's' === 'artists') {
    //             if(_queryMatch(artists[0].name)) {
    //                 console.log("Aritst match", query, artists[0].name, query)
    //             }
    //         } else if(searchTypes[i] + 's' === 'albums') {
    //             if(_queryMatch(albums[0].name)) {
    //                 console.log("Album match", albums[0].name)
    //             }
    //             // setTopResult(albums)

    //         } else if(searchTypes[i] + 's' === 'tracks') {
    //             if(_queryMatch(tracks[0].name)) {
    //                 console.log("Track match", tracks[0].name)
    //             }
    //         } else if(searchTypes[i] + 's' === 'playlsits') {
    //             if(_queryMatch(tracks[0].name)) {
    //                 console.log("Playlist match", playlists[0].name)
    //             }
    //         } else {
    //             // return top Artists by default
                
    //             return artists[0]
    //         }
    //     }
    // }