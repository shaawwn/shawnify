import {useState, useEffect, useRef} from 'react';

export default function useHistory() {

    const [initializeHistory, setInitializeHistory] = useState()
    const [current, setCurrent] = useState()
    const history = useRef()


    class HistoryPage {
        constructor(page, previous) {
            // page should be ['view', viewContent] and that is it, not [[view, viewContent]. undefined]
            // create a callback to toggleView(view, content) that is called when back/forward is selected
            this.page = page // {view: 'album', content: '123123jnk1jn23}
            this.previous = previous //{view: 'album', content: '123123jnk1jn23}
            this.next = null
        }

        getPrevious() {
            return this.previous
        }

        getNext() {
            return this.next
        }
    }

    class History {
        constructor(head = null) {
            this.head = head
            this.current = head // current defaults to head at first
        }

        getCount() {
            let count = 0
            let page = this.head
            while(page.next) {
                count += 1
                page = page.next
            }
            return count
        }
        addPage(current) {
            // current = array [view, content] eg ['playlist', 1231jb3n1jk231], or ['library', null]
            // adding a page always sets current to the most recently addded page
            let newPage = new HistoryPage(current, this.current)
            // console.log("Adding", newPage)
            this.current.next = newPage // set next of current
            this.current = newPage // set current to the new page
        }

        back() {
            // go back in history
            // sets 'current' to previous page, and returns the page details for previous page

            if(this.current.getPrevious() === null) {
                // do nothing 
                return this.current.page
            } else {
                // set current to previous page
                this.current = this.current.getPrevious()
                return this.current.page
            }
        }

        forward() {
            // go forward
            if(this.current.getNext() === null) {
                // do nothing 
                return this.current.page
            } else {
                // set current to next page
                this.current = this.current.getNext()
                return this.current.page
            }
        }

        getLast() {
            let lastPage = this.head
            if(lastPage) {
                while(lastPage.next) {
                    lastPage = lastPage.next
                }
            }
    
            return lastPage
        }
    }

    function initHistory() {
        const head = new HistoryPage(['home', null], null)
        history.current = new History(head)
        setInitializeHistory(true) // re-render with history object created
    }

    useEffect(() => {
        // on load create a history object
        initHistory()
    }, [])

    return history.current
}


// /*
//  * 
//  * On first login, initialize useHistory, and set it to 'Dashboard view
//  * Also create a numeric system, 1, 2, 3, 4, etc. as a key to the object, then set the toggleView callback as the object
//  * set some reference to the key as a current page, ie intiially key = 1, then as you move forward and back through history, you can just increment +/- 1.  It will always go back to the first Dashboard (although maybe there SHOULD be some expiration, that just resets history)
//  */