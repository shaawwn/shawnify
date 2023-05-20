import {useState, useEffect, useRef} from 'react';

/**
 * 
 * Functions for handling searches in app
 * There is pagination for all search results
 */

function useSearch(accessToken) {

    const [searchResult, setSearchResult] = useState()
    const [tracks, setTracks] = useState([])
    const [artists, setArtists] = useState([])
    const [albums, setAlbums] = useState([])
    const [playlists, setPlaylists] = useState([])
    const [shows, setShows] = useState([])

    const searchTypes = ["album", "artist", "playlist", "track", "show", "episode", "audiobook"]
    const pagination = useRef()


    function _setPaginatedState(type, data) {
        if(type === 'album') {
            // TODO
            setAlbums(prevAlbums => prevAlbums.concat(data.items))
        } else if(type === 'artist') {
            // TODO
            setArtists(prevArtists => prevArtists.concat(data.items))
        } else if(type === 'track') {
            // TODO
            setTracks(prevTracks => prevTracks.concat(data.items))
        } else if(type === 'playlist') {
            // TODO
            setPlaylists(prevPlaylists => prevPlaylists.concat(data.items))
        }   
    }

    // function _parsePaginationURL(URL) {
    //     // get the 'type' attribute from a URL string
    //     // https://api.spotify.com/v1/search?query=rush&type=artist&locale=en-US%2Cen%3Bq%3D0.9&offset=20&limit=20"
    //     let testURL = 'https://api.spotify.com/v1/search?query=rush&type=artist&locale=en-US%2Cen%3Bq%3D0.9&offset=20&limit=20'

    //     console.log("parsing url", testURL.split("&")[1])
    // }

    // function handlePagination(type) {
    //     // type is the searchType - album, artist, track, etc
    //     // basically, fetch whatever the pagination URL is that is currently set
    //     // set paginatioin URL when filtering search Type
    //     if(pagination.current === null) {
    //         // no more search results
    //         return false
    //     }

    //     fetch(pagination.current, {
    //         headers: {
    //             'Authorization': `Bearer ${accessToken}`,
    //             'Content-Type': 'application/json'
    //         }
    //     }).then((response) => response.json())
    //     .then((data) => {
    //         console.log("Pagination data in useSearch")
    //         if(data.next === null) {
    //             // either do nothing, or set the state as 'final'
    //             // pagination.current = data.next
    //             _setPaginatedState(type, data)
    //         } else {
    //             // set state
    //             _setPaginatedState(type, data)
    //         }
    //         pagination.current = data.next
    //     })
    // }

    function search(query) {
        // 'type' is the desired query type, eg 'track', 'album', default is all seachTypes
        if(query === '') {
            // nothing to search, abort before query
            console.log("Nothing to search, aborting query")
            return false
        }
        fetch(`https://api.spotify.com/v1/search?q=${query}&type=${searchTypes}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
        .then((data) => {
            // console.log('hook search', data)
            if(data.error === 400) {
                console.error("400 error in fetch")
                setSearchResult()
                // return false
            } else {
                setSearchResult(data)
            }
        })
    }

    // useEffect(() => {
    //     // refrsh when a new searchResult is found and return
    //     if(searchResult) {
    //         // console.log("Data in hook", searchResult)
    //         // _parsePaginationURL()
    //         console.log("Search result update", searchResult.tracks.next)  
    //     }
    // }, [searchResult])

    return [search, searchResult, setSearchResult]
}

export default useSearch