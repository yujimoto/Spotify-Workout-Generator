const express = require('express')
const router = express.Router();
const axios = require('axios')

router.get('/verify', async (req,res) => {
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
    console.log(userData, 'userdata from verify')
    if (userData.id != '') {
        res.json(true)
    } else {
        res.json(false)
    }
    
  } catch (error) {
    console.error('Error fetching user data from Spotify:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})
router.get('', function(req, res, next) {
    const {token} = req.cookies;
    console.log(token,'token from profile dfkjsdfkijds ifdsjfi jsdof jsdf???')
    if (!token) {
        return res.status(401).json('no token');
    }

       jwt.verify(token, process.env.JWT_SECRET,{},async (error,info)=>{
            console.log(info,'info from porfile')
        if(error){
            console.log(error+' assdfsdf')
        }
        console.log(process.env.ADMIN_EMAIL, ' admin email')
        if (info.email === process.env.ADMIN_EMAIL) {
            
            res.json({...info, admin:true})
            
        }
        else {
            // User is not admin
          
            res.json({ ...info, admin: false });
        }
    })
});

module.exports = router;