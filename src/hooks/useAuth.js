import {useState, useEffect, useRef} from 'react';

/**
 * 
 * Currently there is a bug with useAuth where since it is dependent on the CODE that Spotify provides, it will try and run the script again using an expired CODE, which results in a 'code expired' error
 * 
 * It needs to run the refresh Code instead I think instead of trying to run the xpired code again.
 * 
 * handleStrict mode handles access/refresh tokens when strict mode re-renders intially, assigning access/refresh tokens based on their previous value. Since this, I think, should only load twice (with strict mode), it should be fine
 */
// https://throbbing-field-1967.fly.dev/
function useAuth(code) {

    // handle StrictMode
    const strictMode = useRef(false) // initial load will be false
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expiresIn, setExpiresIn] = useState(); // expiresIn may be deprecated because I wasn't getting one, but set to 1 hour (3600ms) anyways

    function handleStrictMode() {
        // development only to handle StrictMode re-renders and authorization
        setAccessToken((prevAccessToken) => prevAccessToken)
        setRefreshToken((prevRefreshToken) => prevRefreshToken)
        setExpiresIn((prevExpiresIn) => prevExpiresIn)
    }

    useEffect(() => {
        // fetch(`https://throbbing-field-1967.fly.dev/login?code=${code}`)
        fetch(`http://localhost:3000/login?code=${code}`)
        .then((response) => response.json())
        .then((data) => {
            console.log("THROBBING ", data)
            if(strictMode.current === true) {
                // strict mode will be disabled in production, so can comment out this
                handleStrictMode()
            } else {
                setAccessToken(data.access_token)
                setRefreshToken(data.refresh_token)
                setExpiresIn(3600)
                window.history.pushState({}, null, '/')
                strictMode.current = true // so now, when useAuth re-renders, strict mode will be true
            }
        })
        .catch(() => {
            window.location = '/'
        })
    }, [code])

    // create a refreshToken check, and use setTimer/setInteveral  with the expired value so that it will automatically refresh the accessToken before it expires. (ex timestamp 31minutes)
    useEffect(() => {
        if(!refreshToken || !expiresIn) return

        const interval = setInterval(() => {
            fetch(`https://throbbing-field-1967.fly.dev/refresh?refresh_token=${refreshToken}`)
            .then((response) => response.json())
            .then((data) => {
                setAccessToken(data.access_token)
                setExpiresIn(3600)
            })
        }, (expiresIn - 600) * 1000)

        return () => clearInterval(interval)
    }, [refreshToken, expiresIn])

    return accessToken
}

export default useAuth;