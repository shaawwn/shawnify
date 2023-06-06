
import CreatePlaylistMenu from '../components/CreatePlaylistMenu';


function Modal(props) {

    // toDisplay is the content that should be loaded on top of the modal, eg the CreatPlaylistMenu
    function handleClick(e) {
        e.stopPropagation()

        if(e.target.className !== 'modal') {
            // do nothing
        } else {

            if(window.confirm("Do you want to cancel playlist creation?")) { // add React component here instead of JS confirm
                props.toggleModal()
            } 

        }
        
    }

    function displayContent() {
        if(props.toDisplay === 'createPlaylist') {
            return(
                <CreatePlaylistMenu 
                    toggleView={props.toggleView}
                    toggleModal={props.toggleModal}
                    user={props.user}
                    accessToken={props.accessToken}
                />
            )
        } else {
            return(
                <h1>NoContent</h1>
            )
        }
    }
    return(
        <div className="modal" onClick={handleClick}>
            {displayContent()}
        </div>
    )
}

export default Modal