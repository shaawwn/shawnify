
/**
 * 
 * artist props passed to banner
artist = {
    "external_urls": {
        "spotify": "https://open.spotify.com/artist/440ltmtZqVLOfnmJgWTPpe"
    },
    "followers": {
        "href": null,
        "total": 43
    },
    "genres": [],
    "href": "https://api.spotify.com/v1/artists/440ltmtZqVLOfnmJgWTPpe",
    "id": "440ltmtZqVLOfnmJgWTPpe",
    "images": [], NO IMAGES
    "name": "井上幹",
    "popularity": 3,
    "type": "artist",
    "uri": "spotify:artist:440ltmtZqVLOfnmJgWTPpe"
}
 */

function ArtistBanner(props) {
    // console.log("Artist banner props", props)

    // PASS A DEFAULT IMAGE
    return(
        <div className="playlist-banner">
            {props.artist.images.length > 0 ?
                <img src={props.artist.images[2].url} alt={props.artist.name}/>
            :<h1>No image.</h1>
            }
            {/* <img src={props.artist.images[2].url} alt={props.artist.name}/> */}
            <p>{props.artist.name}</p>
            <p>Followers {props.artist.followers.total}</p>
        </div>
    )
}


export default ArtistBanner