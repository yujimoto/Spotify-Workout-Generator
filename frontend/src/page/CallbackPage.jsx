import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useAuth } from '../../AuthContext';


 function  CallbackPage() {
    const { isAuthenticated, login,logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(null)

  useEffect(() => {
    // Check if access token is available in localStorage
    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    } else {
      // Access token is not in localStorage, fetch it
      async function fetchCallBack() {
        const code = new URLSearchParams(location.search).get('code');
        console.log(code, 'code');
        if (code) {
          try {
            const response = await axios.get(`${import.meta.env.VITE_APP_API}/callback?code=${code}`,
            {withCredentials:true});
            console.log(response.data, 'response from callback page');
          } catch (error) {
            console.error('Error exchanging the code:', error);
            // Handle error
          }
          localStorage.setItem('login', 'true');
          login(true)
          window.location.assign('/');
        }

      }
      fetchCallBack();
    }
  }, [location, navigate]);
  function checkCookie() {
    axios.get(`${import.meta.env.VITE_APP_API}/profile/stat`, {withCredentials:true})
  }

  function checkAccess() {
    const accessToken = Cookies.get('accessToken');
console.log(accessToken, 'checking access token');// Access the access token from cookies
  }
  return (
    <div>

      {!accessToken && (<>Loading...  <button onClick={checkCookie} >click</button></>) }
        {accessToken && (<>
        it has been arrived {accessToken}
        <button onClick={checkAccess} >click</button>
        </>)}
    </div> // Or some loading indicator
  );
}

export default CallbackPage;
