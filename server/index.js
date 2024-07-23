require('dotenv').config();
const express = require('express');
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const path = require('path');
const history = require('connect-history-api-fallback');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const PORT = process.env.PORT;

const generateRandomString = length => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

const stateKey = 'spotify_auth_state';

const app = express();
app.use(cors())
app.use(cookieParser());

app.get('/' , (req , res) => {
    res.render(path.resolve(__dirname, '../client/index.html'));
})

app.get('/login' , (req , res) => {
    const state =  generateRandomString(16);
    res.cookie(stateKey , state);

    const scope = 'user-read-private user-read-email user-top-read';

    res.redirect(
        `https://accounts.spotify.com/authorize?${querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI,
        state: state,
        })}`
    );
});

app.get('/callback' , (req , res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect(`/#${querystring.stringify({ error: 'state_mismatch'})}`);
    } else {
        res.clearCookie(stateKey);
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code',
            },
            headers: {
                Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
            },
            json: true,
        };

        request.post(authOptions , (error , response , body) => {
            if (!error && response.statusCode === 200) {
                const access_token = body.access_token;
                const refresh_token = body.refresh_token;

                // console.log('Access Token:', access_token);
                // console.log('Refresh Token:', refresh_token);
                const userOptions = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { Authorization: `Bearer ${access_token}` },
                    json: true,
                };
                request.get(userOptions , (error , response , body) => {
                  if(!error && response.statusCode === 200){
                    const spotifyUserId = body.id;
                    console.log('Spotify User Id:', spotifyUserId);
                  }
                  
                  const topArtists = {
                    url : `https://api.spotify.com/v1/me/top/artists?limit=50`,
                    headers: { Authorization: `Bearer ${access_token}` },
                    json: true,
                  };
                  request.get(topArtists , (error , response , body) => {
                    if(!error && response.statusCode === 200){
                       const topArtists = body.items;
                      console.log('Top Artists: Obtained');
                    } else {
                      console.error('Error fetching top artists:', error);
                    }
                  });
                })
                res.redirect(`http://localhost:5173/onboarding`);   
            } else {
                res.status(response.statusCode).json({
                    error: 'Failed to get tokens'
                })
            }
        });
    }
})

app.get('/refresh_token', function (req, res) {
    // requesting access token from refresh token
    const refresh_token = req.query.refresh_token;
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
          'base64',
        )}`,
      },
      form: {
        grant_type: 'refresh_token',
        refresh_token,
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token;
        res.send({ access_token });
      }
    });
  });

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
})