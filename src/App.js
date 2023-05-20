// import queryString from 'query-string'
import {useEffect, useState} from 'react'
// Style imports
import style from './styles/style.css'
import componentStyle from './styles/componentStyles.css'
import useAuth from './hooks/useAuth'

//Component Imports
import Login from './Login'
import Dashboard from './views/Dashboard'

const code = new URLSearchParams(window.location.search).get('code')

function App() {

  
  return code ? <Dashboard code={code} /> : <Login />
}

export default App;
