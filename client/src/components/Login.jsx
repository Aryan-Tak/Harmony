import React from 'react';
import Spline from '@splinetool/react-spline';
import { Link } from 'react-router-dom';
const AUTH_URL = 'http://localhost:5174/login';


function Login() {
  return (
    // <div className='flex flex-col justify-center items-center min-h-screen bg-cover bg-center' style={{ backgroundImage: "url('https://us.123rf.com/450wm/austler/austler2404/austler240400931/228758950-vector-illustration-of-a-boy-and-girl-listening-to-music-with-headphones.jpg?ver=6')" }}>
    //   <div className='bg-opacity-75  p-6 rounded-lg shadow-lg text-center'>
    //     <h1 className='font-mono font-medium text-4xl mb-4'>Harmony</h1>
    //     <p className='font-mono font-medium text-2xl mb-8'>Find people based on your music interest</p>
    //     <div className='flex justify-around'>
    //       <Link to={AUTH_URL} className='p-3 bg-black rounded-full text-white font-bold hover:bg-white hover:text-black'>Create Your Harmony</Link>
    //       <Link className='p-3 bg-black rounded-full text-white font-bold hover:bg-white hover:text-black'>Continue the Groove</Link>
    //     </div>
    //   </div>
    // </div>
    <div className='flex w-full h-full'>
       <Spline scene="https://prod.spline.design/qWMskPoUbnpYHZZx/scene.splinecode" />
  
    </div>
  );
}

export default Login;
