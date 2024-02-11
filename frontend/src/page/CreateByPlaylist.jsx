import React, { useEffect, useState } from 'react'
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import axios from 'axios'

const CreateByPlaylist = () => {
    const [playlistLength, setplaylistLength] = useState(0)
    const [type, settype] = useState('')
    const [playlistId, setplaylistId] = useState(null)
    const [playlists, setPlaylists] = useState(null)
    const [motivationPeriod, setmotivationPeriod] = useState([0,60])
    const [userInfo, setUserInfo] = useState(null)
    useEffect(() => {
      async function getProfile() {
        try {
          const res = await axios.get('http://localhost:3000/profile/stat', { withCredentials: true });
          console.log(res.data, 'userinfo');
          setUserInfo(res.data);
          // Directly use res.data.id here since userInfo state might not be updated yet
          await getPlaylist(res.data.id); // Pass the id directly to getPlaylist
        } catch (err) {
          console.log(err);
        }
      }
      getProfile();
    }, []);

    async function getPlaylist(userId) { // Use parameter for userId
      try {
        const res = await axios.get('http://localhost:3000/user-playlist', {
          params: { id: userId }, // Use the passed parameter
          withCredentials: true
        });
        console.log(res, 'playlist datas');
        setPlaylists(res.data.items);
      } catch (error) {
        console.log(error);
      }
    }
      
    // useEffect(() => {
    //   async function getPlaylist() {
          
    //     await axios.get('http://localhost:3000/user-playlist',{params: { userInfo.id },
    //     withCredentials:true})
    //     .then((res) => {
    //       console.log(res)
    //       setPlaylists(res.data.items)
    //     })
    //     .catch ((error) => {
    //       console.log(error)
    //     })
    //   }
    //   getPlaylist()
    // }, [])

   async function submitPlaylist() {


    }

    const handleChangePeriod = (event, newValue) => {
      setmotivationPeriod(newValue);
      console.log(motivationPeriod)
    };
    const handleLengthChange = (event,newvalue) => {
      setplaylistLength(newvalue)
      console.log(newvalue)
    }
  return (
    <div className='create-by-playlist-wrapper'> 
      <h1>Create using your own playlist!</h1>
      
     <div className='slider-wrapper'>
        <h2>Estimated length of playlist (in min)</h2>
        <Box sx={{ width: '100%' }}>
          <div>
            <Slider color="secondary" onChange={handleLengthChange} defaultValue={50} aria-label="Always visible" valueLabelDisplay="auto" />
            <p>{playlistLength}</p>
          </div>
        </Box>
    </div>

    <div className='slider-wrapper' >
      <h2>Pick a period when you need the most motivation</h2>
      <Box sx={{ width: '100%' }}>
        <div>
          <Slider aria-label="Always visible" value={motivationPeriod}  onChange={handleChangePeriod} valueLabelDisplay="auto"/>
          <p>{motivationPeriod[0]} - {motivationPeriod[1]}</p>
        </div>
      </Box>
    </div>
      <div>
      <ul>
        {playlists?.map((playlist) => (
            <div className="single-playlist">
            <h2>
                {playlist.name}
            </h2>
            <div className='playlist-img-wrap'>
                <p>click to visit playlist</p>
            <a target='blank' href={playlist.external_urls.spotify}><img className='playlist-img' src={playlist.images[0].url} alt="" /></a>
            </div>
            </div>
        ))}
    </ul>
      </div>
  </div>
   
  )
}

export default CreateByPlaylist