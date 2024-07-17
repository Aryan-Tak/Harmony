const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const bodyParser = require('body-parser');
const neo4j = require('neo4j-driver');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const dbfunc = (async () => {
    
    const URI = 'bolt://localhost:7687'
    const USER = 'neo4j'
    const PASSWORD = 'harmony123'
    let driver
  
    try {
      driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
      const serverInfo = await driver.getServerInfo()
      console.log('Connection established')
      console.log(serverInfo)
    } catch(err) {
      console.log(`Connection error\n${err}\nCause: ${err.cause}`)
    }
  })
  dbfunc();

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
