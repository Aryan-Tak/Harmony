import React, { useEffect, useState } from 'react';
import { useNavigate , useSearchParams } from 'react-router-dom';
import OnboardingForm from '../components/OnBoardingForm';
import UseAuth from '../components/UseAuth';
import axios from 'axios';
import Login from '../components/Login';

function OnBoarding() {
    const code = new URLSearchParams(window.location.search).get('code');
    const { accessToken, isAuthenticated } = UseAuth(code);
    const [topArtists, setTopArtists] = useState([]);

    useEffect(() => {
        if (!accessToken) return;

        axios.get('https://api.spotify.com/v1/me/top/artists?limit=50', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then(res => {
            setTopArtists(res.data.items);
            console.log('Top artists:', res.data.items);
        })
        .catch(err => {
            console.error('Error fetching top artists:', err);
        });
    }, [accessToken]);

    if (!isAuthenticated) {
        return <div>Loading...</div>;
    }
    return <OnboardingForm code={code} />;
}

export default OnBoarding;
