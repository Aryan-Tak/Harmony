const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const neo4j = require('neo4j-driver');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());





// Spotify API Setup

app.post('/onboarding', (req, res) => {
    const code = req.body.code;
    // console.log('Received authorization code:', code);
    // console.log('clientSecret' ,process.env.SPOTIFY_CLIENT_SECRET)

    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:5173/onboarding',
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret:process.env.SPOTIFY_CLIENT_SECRET ,
    });

    spotifyApi.authorizationCodeGrant(code).then(data => {
        // console.log('Access token:', data.body.access_token);
        // console.log('Refresh token:', data.body.refresh_token);
        // console.log('Expires in:', data.body.expires_in);

        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        });
    }).catch(err => {
        console.error('Error during authorization code grant:', err);
        res.sendStatus(400);
    });
});

app.listen(5174, () => {
    console.log('Server running on port 5174');
});
