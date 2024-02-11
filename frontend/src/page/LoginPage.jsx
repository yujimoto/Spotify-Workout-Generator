import axios from 'axios';
import React from 'react';
import { useContext } from 'react';

import { useAuth } from '../../AuthContext';

const LoginPage =  () => {
    const { isAuthenticated, login,logout } = useAuth();
 async function handleLogin() {

  try { 
    await axios.get('http://localhost:3000/auth', {withCredentials:true})
    .then((res) => {
    console.log(res, ' check login')
    login(true)
    })

} catch (error) {
    console.error('Error checking state:', error);
    // Handle error
}
if (!isAuthenticated) { 

  const client_id = import.meta.env.VITE_APP_SPOTIFY_CLIENT_ID; // Your client id
  const redirect_uri = import.meta.env.VITE_APP_SPOTIFY_REDIRECT_URI; // Your redirect uri
  const scopes = import.meta.env.VITE_APP_SPOTIFY_SCOPES // Example scopes
  const url = 'https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + encodeURIComponent(client_id) +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(redirect_uri);
  console.log(url,'url')
  window.location = url; 
}
  };

  return (
    <div className='login'>
        login
      <button className='login-btn' onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
};

export default LoginPage;
