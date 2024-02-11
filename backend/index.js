const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json());
const jwt = require('jsonwebtoken');
const dotenv  = require('dotenv')
const queryString = require('querystring');
// const session = require('express-session')
const axios = require('axios')
const cookieParser = require('cookie-parser')
const userRoutes = require('../backend/routes/user')

// Configuration
dotenv.config();
app.use(cookieParser());

// Middleware
app.use(cors({ credentials: true, origin: process.env.FRONTEND_PORT }));
app.use(express.urlencoded({ extended: true }));
app.use('/user',userRoutes)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Spotify login route
// app.get('/login', async (req, res) => {
//   const client_id = process.env.SPOTIFY_CLIENT_ID;
//   const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
//     //add jwt ???
// //   const accessToken = req.cookies.accessToken;
// //   if (!accessToken) {
// //     return res.status(401).json({ error: 'Access token not found' });
// //   }

// //   try {
// //     const response = await axios.get('https://api.spotify.com/v1/me', {
// //       headers: {
// //         Authorization: `Bearer ${accessToken}`,
// //       },
// //     });
// //     const userData = response.data;
// //     res.json(userData);
// //   } catch (error) {
// //     console.error('Error fetching user data from Spotify:', error);
// //     res.status(500).json({ error: 'Internal Server Error' });
// //   }

//   const state = randomstring.generate(16);
//   const scope = 'user-read-private user-read-email user-top-read playlist-modify-private';
//     console.log('https://accounts.spotify.com/authorize?' +
//     queryString.stringify({
//       response_type: 'code',
//       client_id: client_id,
//       scope: scope,
//       redirect_uri: redirect_uri,
//       state: state,
//     }))
//   res.redirect('https://accounts.spotify.com/authorize?' +
//     queryString.stringify({
//       response_type: 'code',
//       client_id: client_id,
//       scope: scope,
//       redirect_uri: redirect_uri,
//       state: state,
//     }));
// });


// Spotify callback route
app.get('/callback', async (req, res) => {
  
  console.log('callback has been called')
  try {
    const code = req.query.code;
    console.log('Received code:', code);

    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

    const authOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
      },
      body: queryString.stringify({
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code',
      }),
    };

    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', authOptions);
    const tokenData = await tokenResponse.json();

    // You might want to filter the response data here
    console.log('Token data:', tokenData);
    // Calculate the expiration time for the cookie based on 'expires_in' from 'tokenData'
    const expiresIn = tokenData.expires_in; // You might need to adjust this based on the format of 'expires_in' from Spotify's response

    // Set the access token as a cookie with an expiration time
    res.cookie('accessToken', tokenData.access_token, { httpOnly: true, maxAge: expiresIn * 1000 }); // Convert expiresIn to milliseconds
    res.cookie('refreshToken', tokenData.refresh_token);
    res.cookie('login', 'true')
    // Redirect the user to a frontend route after successful authentication
    console.log('res cookie dsafsdf')
    res.json('succesfull ?'); // Change the URL as needed
  } catch (error) {
    console.error('Error exchanging code for access token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    // Consider more specific error handling based on the type of error
  }
});

app.get('/profile/stat', async (req,res) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.status(401).json({ error: 'Access token not found' });
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userData = response.data;
    res.json(userData);
  } catch (error) {
    console.error('Error fetching user data from Spotify:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.get('/auth' ,(req,res) => {
  const state = req.cookies.login;
  console.log(state,'state')
  if (state === 'true') {
    res.send(true)
  } else {
    res.send(false)
  }

})

app.get('/top-artist',async (req,res) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.status(401).json({ error: 'Access token not found' });
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userData = response.data;
    res.json(userData);
  } catch (error) {
    console.error('Error fetching user data from Spotify:', error, 'wtf');
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.get('/top-tracks',async (req,res) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.status(401).json({ error: 'Access token not found' });
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userData = response.data;
    res.json(userData);
  } catch (error) {
    console.error('Error fetching user data from Spotify:', error, 'wtf');
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.get('/user-playlist',async (req,res) => {
  const accessToken = req.cookies.accessToken;
  const {id} = req.query
  console.log('playlist has been called')
  console.log(id,'user')
  if (!accessToken) {
    return res.status(401).json({ error: 'Access token not found' });
  }
 
  try {
    console.log('thjis too')
    const response = await axios.get(`https://api.spotify.com/v1/users/${id}/playlists`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const playlist = response.data;
    res.json(playlist);
  } catch (error) {
    console.error('Error fetching playlist from Spotify:', error, 'wtf');
    res.status(500).json({ error: 'Internal Server Error' });
  }
})


app.get('/refresh_token', async function(req, res) {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    console.log('refresh has been called')
  const refresh_token = req.cookies.refreshToken;
  console.log(refresh_token,'refreshtoken')
  const authOptions = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`
    },
    body:  queryString.stringify({
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    }),
  };
  console.log(authOptions, 'authopt')
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
    if (response.status === 200) {
      
      const data = await response.json();
      console.log(data,'data ferom fetch')
      // const access_token = data.access_token;
      const expiresIn = data.expires_in;
      console.log(expiresIn)
      console.log(data.access_token)
      //const refresh_token = data.refresh_token;
      res.cookie('accessToken', data.access_token, { maxAge: expiresIn * 1000 });
      res.json('succesfull ?');
      //res.cookie('accessToken', data.access_token);
    } else {
      // Handle the error response from Spotify
      console.error('Error refreshing access token:', await response.text());
      res.status(response.status).send('Error refreshing access token');
    }
  } catch (error) {
    console.error('Error refreshing access token:', error);
    res.status(500).send('Internal Server Error');
  }
});



app.get('/logout', (req,res) => {
  res.cookie('login', 'false')
  res.cookie('accessToken', '', { maxAge: 1 })
  res.cookie('refreshToken','', { maxAge: 1 })
  res.status(204).end();
})
