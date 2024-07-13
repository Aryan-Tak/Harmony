import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UseAuth(code) {
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expiresIn, setExpiresIn] = useState();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (!code) return;

        axios.post('http://localhost:5174/onboarding', { code })
            .then(res => {
                setAccessToken(res.data.accessToken);
                setRefreshToken(res.data.refreshToken);
                setExpiresIn(res.data.expiresIn);
                setIsAuthenticated(true);
                window.history.pushState({}, null, '/');
            })
            .catch(err => {
                console.error('Login request failed:', err);
                if (err.response) {
                    console.error('Error response data:', err.response.data);
                }
            });
    }, [code]);

    useEffect(() => {
        if (!refreshToken || !expiresIn) return;

        const interval = setInterval(() => {
            axios.post('http://localhost:5174/refresh', { refreshToken })
                .then(res => {
                    setAccessToken(res.data.accessToken);
                    setExpiresIn(res.data.expiresIn);
                })
                .catch(err => {
                    console.error('Token refresh failed:', err);
                    if (err.response) {
                        console.error('Error response data:', err.response.data);
                    }
                });
        }, (expiresIn - 60) * 1000);

        return () => clearInterval(interval);
    }, [refreshToken, expiresIn]);

    return { accessToken, isAuthenticated };
}
