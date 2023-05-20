import {useState, useEffect, useRef} from 'react';
import useAuth from '../hooks/useAuth'
import usePlaylists from '../hooks/usePlaylists';
import usePlayback from '../hooks/usePlayback';
import useHistory from '../hooks/useHistory';

import PlaylistView from '../views/PlaylistView';
import HomeView from '../views/HomeView';
import SearchView from '../views/SearchView';
import SearchResultsView from '../views/SearchResultsView';
import LibraryView from '../views/LibraryView';
import AlbumView from '../views/AlbumView';
import ArtistView from '../views/ArtistView';
import GridView from '../views/GridView'

import Navbar from '../components/Navbar';
import Playbar from '../components/Playbar'


import HistoryNavigator from '../components/HistoryNavigator';
import __TestView__ from '../views/__TestView__';
import Tester from '../components/Tester';

/*
    Dashboard is the home page of the app, and by default acts as the 'Home' View (as opposed to playlist/library views)
    Dashboard needs to:
        Access user account, which it uses to directly get playlists/recently played items as well
        as pass this information to children (like playlists in navbar)

    Dashboard is basically the App container, and holds all the views, navbar, etc, so toggling views is just toggling whatever page view is being displayed IN the dashboard

    TODOS?
*/


export default function Dashboard(props) {
    // console.log("Loading dashboard")
    // const strictModeAuth = useRef(true)
    const accessToken = useAuth(props.code)
    const [playback, controls] = usePlayback(accessToken, false) 
    // const [playback, controls] = useState() // Dummy test
    const history = useHistory()
    const [playlists, setPlaylists] = usePlaylists(accessToken)
    const [view, setView] = useState('home') // home
    const [content, setContent] = useState(undefined)


    function updateHistory(page, logHistory=true) {
        if(logHistory === true) {
            history.addPage(page)       
        } // else do not update history
    }


    function toggleView(viewType, viewContent, logHistory=true) {
        // viewTypes = [library, home, search, playlist, ...]
        if(viewType === 'home') {
            updateHistory(['home', null], logHistory)
            setView('home')
        } else if(viewType === 'library') {
            updateHistory(['library', null], logHistory)
            setView('library')
        } else if(viewType === 'search') {
            updateHistory(['search', null], logHistory)
            setView('search')
        } else if(viewType === 'results') {
            updateHistory(['results', null], logHistory)
            setView('results')
            setContent(viewContent)
        }else if(viewType === 'playlist') {
            updateHistory(['playlist', viewContent], logHistory)
            setView('playlist')
            setContent(viewContent)
        } else if(viewType === 'album') {
            updateHistory(['album', viewContent], logHistory)
            setView('album')
            setContent(viewContent)
        } else if(viewType === 'artist') {
            updateHistory(['artist', viewContent], logHistory)
            setView('artist')
            setContent(viewContent)
        } else if(viewType === 'grid') {
            setView('grid')
        }
        window.scrollTo(0, 0) // scroll back to top of window when switching views
    }

    function displayView() {

        if(view === 'home') {
            return(
                <HomeView 
                    playlists={playlists} 
                    toggleView={toggleView}
                    controls={controls}
                />
            )
        } else if(view === 'playlist') {
            return(
                <PlaylistView 
                    playlistID={content} 
                    accessToken={accessToken}
                    toggleView={toggleView}
                    controls={controls}
                    />
            )
        } else if(view === 'album') {
            return(
                <AlbumView 
                    albumID={content}
                    accessToken={accessToken}
                    toggleView={toggleView}
                    controls={controls}
                />
            )
        } else if(view === 'artist') {
            return(
                <ArtistView 
                    artistID={content}
                    accessToken={accessToken}
                    toggleView={toggleView}
                    controls={controls}
                />
            )
        } else if(view === 'search') {
            return(
                <SearchView 
                    accessToken={accessToken}
                    toggleView={toggleView}
                    controls={controls}
                />
            )
        } else if(view === 'results') {
            return(
                <SearchResultsView 
                    accessToken={accessToken}
                    toggleView={toggleView}
                    controls={controls}
                />
            )
        }else if(view === 'library') {
            return(
                <LibraryView 
                    toggleView={toggleView}
                    accessToken={accessToken}
                    controls={controls}
                />
            )
        } else if(view === 'grid') {
            return(
                <GridView 
                    title={'Your playlists'}
                />
            )
        }
    }

    function displayNavbar() {
        if(playlists.length > 0) {
            return <Navbar 
                playlists={playlists} 
                setPlaylists={setPlaylists} 
                toggleView={toggleView}
                accessToken={accessToken}
                controls={controls}
                />
        } else {
            return <Navbar 
                playlists={[]}
                setPlaylists={setPlaylists}
                toggleView={toggleView}
                controls={controls}
                />
        }
    }

    useEffect(() => { 
        // console.log("Playback", playback)
    }, [playback])

    // return(
    //     <div className="dashboard">
    //         {/* <h1>Fetch testing.</h1> */}
    //         <Tester 
    //                 accessToken={accessToken}
    //         />
    //     </div>
    // )
    return(
            <div className="dashboard">
                {displayNavbar()}
                <div className="view-container">
                    <HistoryNavigator 
                        history={history}
                        toggleView={toggleView}
                        />
                    {displayView()}

                </div>
                <Playbar 
                    accessToken={accessToken}
                    playback={playback}
                    controls={controls}
                />
            </div>
    )

}


// GRAVEYARD

// import LinkCardCarousel from '../components/LinkCardCarousel'
// import SpotifyApi from '../helpers/SpotifyApi'
// import {LinkCard} from '../components/LinkCard';

// const [user, setUser] = useState()
// const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useState([])
// const api = new SpotifyApi(accessToken)