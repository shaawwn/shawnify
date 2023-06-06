


function ArtistBanner(props) {

    return(
        <div className="playlist-banner">
            {props.artist.images.length > 0 ?
                <img src={props.artist.images[2].url} alt={props.artist.name}/>
            :<h1>No image.</h1>
            }
            <p>{props.artist.name}</p>
            <p>Followers {props.artist.followers.total}</p>
        </div>
    )
}


export default ArtistBanner