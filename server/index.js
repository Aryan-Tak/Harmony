const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const neo4j = require('neo4j-driver');
require('dotenv').config();


const { dbfunc , createUser} = require('./db');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const uplode = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 2 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'), false);
        }
      },
})


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


// DataBase Connection 

dbfunc().catch(error => {
    console.error('Error in dbfunc:', error);
    process.exit(1);
});

// User creation endpoint
app.post('/onboarding', async (req, res) => {
    try {
      const user = await createUser(req.body);
      res.status(200).json({ message: 'Account created successfully', user });
    } catch (error) {
      res.status(400).json({ error: 'Error creating account' });
    }
  });

// Server setup
app.listen(5174, () => {
    console.log('Server running on port 5174');
});
