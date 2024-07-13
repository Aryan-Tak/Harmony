import React, { useEffect, useState } from 'react';
import OnboardingForm from '../components/OnBoardingForm';
import UseAuth from '../components/UseAuth';
import axios from 'axios';
import Login from '../components/Login';

function OnBoarding() {
    const code = new URLSearchParams(window.location.search).get('code');
    const { accessToken, isAuthenticated } = UseAuth(code);
    const [topTracks, setTopTracks] = useState([]);

    useEffect(() => {
        if (!accessToken) return;

        axios.get('https://api.spotify.com/v1/me/top/tracks', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then(res => {
            setTopTracks(res.data.items);
        })
        .catch(err => {
            console.error('Error fetching top tracks:', err);
        });
    }, [accessToken]);

    if (!isAuthenticated) {
        return <div>Loading...</div>;
    }
    return <OnboardingForm code={code} />;
}

export default OnBoarding;
