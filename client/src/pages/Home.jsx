import React from 'react'
import Login from '../components/Login'
import OnBoarding from './OnBoarding';


const code = new URLSearchParams(window.location.search).get('code');
function Home() {
    return <Login code={code} />
}

export default Home
