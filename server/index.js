// const express = require('express');
// const SpotifyWebApi = require('spotify-web-api-node');
// const cors = require('cors');
// const multer = require('multer');
// const bodyParser = require('body-parser');
// const neo4j = require('neo4j-driver');
// require('dotenv').config();


// const app = express();
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// const URI = process.env.NEO4J_URI;
// const USER = process.env.NEO4J_USERNAME;
// const PASSWORD = process.env.NEO4J_PASSWORD;

// const driver = neo4j.driver(URI , neo4j.auth.basic(USER , PASSWORD));



// // Spotify API Setup

// app.post('/onboarding', (req, res) => {
//     const refreshToken = req.body.refreshToken;
//     console.log('Received authorization code:', refreshToken);


//     const spotifyApi = new SpotifyWebApi({
//         redirectUri: 'http://localhost:5173/onboarding',
//         clientId: process.env.SPOTIFY_CLIENT_ID,
//         clientSecret:process.env.SPOTIFY_CLIENT_SECRET ,
//         refreshToken
//     });

//     spotifyApi.refreshAccessToken().then(
//         (data) => {
//             console.log('Refreshed access token:', data.body['access_token']);
//             res.json({
//                 asccessToken: data.body['access_token'],
//                 expiresIn: data.body['expires_in']
//             })
//         }
//     ).catch(err => {
//         console.error('Error refreshing access token:', err);
//         res.sendStatus(400);
//     });

//     }
// );

// app.post('/onboarding', (req, res) => {
//     const code = req.body.code;
//     console.log('Received authorization code:', code);

//     const spotifyApi = new SpotifyWebApi({
//         redirectUri: 'http://localhost:5173/onboarding',
//         clientId: process.env.SPOTIFY_CLIENT_ID,
//         clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
//     });


//     spotifyApi.authorizationCodeGrant(code).then(data => {
//         console.log('Access token:', data.body.access_token);
//         console.log('Refresh token:', data.body.refresh_token);
//         console.log('Expires in:', data.body.expires_in);

//         res.json({
//             accessToken: data.body.access_token,
//             refreshToken: data.body.refresh_token,
//             expiresIn: data.body.expires_in,
//         })
//     }).catch(err => {
//         console.error('Error during authorization code grant:', err);
//         res.sendStatus(400);
//     });
// });


// const upload = multer({ dest: 'uploads/'});

// app.post('/onboarding' , upload.single('photo') , async (req, res) => {
//     const { firstname , lastname , dob , gender , bio} = req.body;
//     // const photo = req.file.filename;
//     const session = driver.session();
//     console.log('Connected to Neo4j');
//     try {
//         await session.run(
//             `CREATE (USER:Person {
//                 firstname: $firstname,
//                 lastname: $lastname,
//                 dob: $dob,
//                 gender: $gender,
//                 bio: $bio
//                 }) RETURN USER`,
//             { firstname , lastname , dob , gender , bio ,}
//         );
//         res.status(200).send('Account created successfully');
        
//     } catch (error) {
//         console.log('Error in createUser:', error);
//         res.status(500).json({ error: 'Error creating account' });   
//     }finally {
//         await session.close(); // Ensure the session is closed
//     }
// })

// // DataBase Connection 

// // dbfunc().catch(error => {
// //     console.error('Error in dbfunc:', error);
// //     process.exit(1);
// // });

// // User creation endpoint
// // app.post('/onboarding', uplode.single('photo') , async (req, res) => {
// //     try {
// //       const user = await createUser(req.body);
// //       res.status(200).json({ message: 'Account created successfully', user });
// //     } catch (error) {
// //       res.status(400).json({ error: 'Error creating account' });
// //     }
// //   });

// // Server setup
// app.listen(5174, () => {
//     console.log('Server running on port 5174');
// });
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
app.use(bodyParser.urlencoded({ extended: true }));

const URI = process.env.NEO4J_URI;
const USER = process.env.NEO4J_USERNAME;
const PASSWORD = process.env.NEO4J_PASSWORD;

const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

// Spotify API Setup
app.post('/onboarding', (req, res) => {
    const { code, refreshToken, firstname, lastname, dob, gender, bio } = req.body;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:5173/onboarding',
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    if (code) {
        // Handle authorization code grant
        spotifyApi.authorizationCodeGrant(code).then(data => {
            console.log('Access token:', data.body.access_token);
            console.log('Refresh token:', data.body.refresh_token);
            console.log('Expires in:', data.body.expires_in);

            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in,
            });
        }).catch(err => {
            console.error('Error during authorization code grant:', err);
            res.sendStatus(400);
        });
    } else if (refreshToken) {
        // Handle refresh token
        spotifyApi.setRefreshToken(refreshToken);
        spotifyApi.refreshAccessToken().then(data => {
            console.log('Refreshed access token:', data.body.access_token);
            res.json({
                accessToken: data.body.access_token,
                expiresIn: data.body.expires_in,
            });
        }).catch(err => {
            console.error('Error refreshing access token:', err);
            res.sendStatus(400);
        });
    } 
    // else if (firstname && lastname && dob && gender && bio) {
    //     // Handle user data
    //     const session = driver.session();
    //     console.log('Connected to Neo4j');
    //     session.run(
    //         `CREATE (USER:Person {
    //             firstname: $firstname,
    //             lastname: $lastname,
    //             dob: $dob,
    //             gender: $gender,
    //             bio: $bio
    //             }) RETURN USER`,
    //         { firstname, lastname, dob, gender, bio }
    //     ).then(() => {
    //         res.status(200).send('Account created successfully');
    //     }).catch(error => {
    //         console.log('Error in createUser:', error);
    //         res.status(500).json({ error: 'Error creating account' });
    //     }).finally(() => {
    //         session.close();
    //     });
    // }
     else {
        res.status(400).json({ error: 'Invalid request' });
    }
});

// Server setup
app.listen(5174, () => {
    console.log('Server running on port 5174');
});