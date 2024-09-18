require('dotenv').config();
const express = require('express');
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const path = require('path');
const history = require('connect-history-api-fallback');
const neo4j = require('neo4j-driver');
const multer = require('multer');
const session = require('express-session');
const sdk = require('node-appwrite');
const fs = require('fs');
const fileUpload = require('express-fileupload');



const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const NEO4J_URI = process.env.NEO4J_URI;
const NEO4J_USERNAME = process.env.NEO4J_USERNAME;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;
const PORT = process.env.PORT;
const SESSION_SECRET = process.env.SESSION_SECRET;

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
app.use(cors({ origin: '*',
    methods: 'GET,POST,PUT,DELETE',  
 }));
 
app.use(cookieParser());
app.use(express.json()); 
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false}
}));
app.use(fileUpload());

// Neo4j setUp
const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));

// Appwrite Setup
const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECTID)
    .setSession('')

const storage = new sdk.Storage(client)

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

app.get('/callback', (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
      res.redirect(`/#${querystring.stringify({ error: 'state_mismatch' })}`);
  } 
//   complete in else block
  else {
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
    //   Got the access token and refresh token in if block
      request.post(authOptions, (error, response, body) => {
          if (!error && response.statusCode === 200) {
              const access_token = body.access_token;
              const refresh_token = body.refresh_token;

              const userOptions = {
                  url: 'https://api.spotify.com/v1/me',
                  headers: { Authorization: `Bearer ${access_token}` },
                  json: true,
              };

            
              request.get(userOptions, async (error, response, body) => {
                  if (!error && response.statusCode === 200) {
                      const spotifyUserId = body.id;
                      console.log('Spotify User Id:', spotifyUserId);
                      req.session.spotifyUserId = spotifyUserId;

                      try {
                          const userResult = await driver.executeQuery(
                              `MATCH (u:User {spotifyId: $spotifyUserId}) RETURN u`,
                              { spotifyUserId }
                          );  
                        //   till here sign up is being check
                        // now new user is being created

                          if (userResult.records.length > 0) {
                              res.redirect(`http://localhost:5173/dashboard`);
                          } else {
                              const topArtistsOptions = {
                                  url: `https://api.spotify.com/v1/me/top/artists?limit=50`,
                                  headers: { Authorization: `Bearer ${access_token}` },
                                  json: true,
                              };

                              request.get(topArtistsOptions, async (error, response, body) => {
                                if (!error && response.statusCode === 200) {
                                  const topArtists = body.items.map(artist => ({
                                    id: artist.id,
                                    name: artist.name,
                                    genres: artist.genres,
                                  }));
                  
                                      
                                      console.log('Top Artists: Obtained');

                                      res.redirect(
                                        `http://localhost:5173/onboarding?spotifyId=${spotifyUserId}&topArtists=${encodeURIComponent(JSON.stringify(topArtists))}`
                                      );
                      


                                      for (const artist of topArtists) {
                                          await driver.executeQuery(
                                              `MERGE (a:Artist {spotifyId: $spotifyId, name: $name , genres: $genres})`,
                                              { spotifyId: artist.id, name: artist.name , genres: artist.genres }
                                          );
                                      }

                                      
                                  } else {
                                      console.error('Error fetching top artists:', error);
                                      res.status(500).send('Internal Server Error');
                                  }
                              });
                          }
                      } catch (error) {
                          console.error('Error with Neo4j:', error);
                          res.status(500).send('Internal Server Error');
                      } 
                  } else {
                      console.error('Error fetching user:', error);
                      res.status(500).send('Internal Server Error');
                  }
              });
          } else {
              res.status(response.statusCode).json({ error: 'Failed to get tokens' });
          }
      });
  }
});

app.post('/profile', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0){
    return res.status(400).send('No files were uploaded.');
  }  
  const { firstName, lastName, spotifyUserId , dob, bio, gender } = req.body;
  const image = req.files.photo;    


  try {

    const userProfile = await storage.createFile(
        process.env.APPWRITE_BUCKETID,
        '66dca10e003b1eef5caa',
        Math.random().toString(8),
        InputFile.fromBuffer(buffer,image.data , image.name)
    );
    const userResult = await driver.executeQuery(
        'MATCH (u:User {spotifyId: $spotifyUserId}) RETURN u',
        { spotifyUserId }
    );
    
    

    if (userResult.records.length > 0) {
          res.status(400).json({ error: 'User already exists' });
    } else {
        const photoPath = req.file.path;
        await driver.executeQuery(
          'CREATE (u:User { spotifyId: $spotifyUserId,firstName: $firstName, lastName: $lastName, dob: $dob, bio: $bio, gender: $gender, photoPath: $photoPath})',
          { spotifyUserId,  firstName, lastName, dob, bio, gender, photoPath }
          );
        res.status(201).send('User profile created');
      }
      
  } catch (err) {
    console.error('Error saving user profile:', err);
    res.status(500).send('Internal Server Error');
  } 
});

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
