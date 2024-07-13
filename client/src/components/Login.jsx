import React from 'react';
import { Link } from 'react-router-dom';
import conf from '../conf/conf';
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${conf.clientId}&response_type=code&scope=user-top-read&redirect_uri=http://localhost:5173/onboarding`;

function Login({code}) {
  return (
    <div className='flex flex-col justify-center items-center min-h-screen bg-cover bg-center' style={{ backgroundImage: "url('https://us.123rf.com/450wm/austler/austler2404/austler240400931/228758950-vector-illustration-of-a-boy-and-girl-listening-to-music-with-headphones.jpg?ver=6')" }}>
      <div className='bg-opacity-75  p-6 rounded-lg shadow-lg text-center'>
        <h1 className='font-mono font-medium text-4xl mb-4'>Harmony</h1>
        <p className='font-mono font-medium text-2xl mb-8'>Find people based on your music interest</p>
        <Link to={AUTH_URL} className='p-3 bg-black rounded-full text-white font-bold'>SignUp with Spotify</Link>
      </div>
    </div>
  );
}

export default Login;
