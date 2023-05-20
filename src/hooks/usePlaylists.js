import {useState, useEffect, useRef} from 'react';


export default function usePlaylists(accessToken) {

    const [playlists, setPlaylists] = useState([]) // default 0 playlists
    const [end, setEnd] = useState(false)
    const pagination = useRef(null)
    const limit = 50;
    let offset = 0

    function getCurrentUserPlaylists() {
        let fetchURL = `https://api.spotify.com/v1/me/playlists?offset${offset}=&limit=${limit}`

        if(pagination.current !== null) { 
            // set fetch URL to the current pagination URL
            fetchURL = pagination.current
        }
        fetch(fetchURL, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
        .then((data) => {

            if(data.next === null) {
                // last page, no more items
                setEnd(true)
                return false
            } else {
                pagination.current = data.next
            }
            // console.log('current user playlists from hook', data)
            setPlaylists(data.items)
        })
    }

    useEffect(() => {
        if(accessToken) {
            getCurrentUserPlaylists()
        } 
    }, [accessToken])

    return [playlists, setPlaylists]
}