import React, { useEffect, useState } from 'react'
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import axios from 'axios'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Loading from '../components/Loading';
const CreateByPlaylist = () => {
  // include warmup time????
  // include warmup time????
  // include warmup time????
  
    const [playlistLength, setplaylistLength] = useState(0)
    const [playlistName, setPlaylistName] = useState('')
    const [warmupTime, setWarmupTime] = useState(0)
    const [type, settype] = useState('')
    const [playlistId, setplaylistId] = useState(null)
    const [playlists, setPlaylists] = useState(null)
    const [motivationPeriod, setmotivationPeriod] = useState([0,60])
    const [userInfo, setUserInfo] = useState(null)
    const [prePlaylist, setPrePlaylist] = useState(null);
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    useEffect(() => {
      async function getProfile() {
        try {
          const res = await axios.get('http://localhost:3000/profile/stat', { withCredentials: true });
          console.log(res.data, 'userinfo');
          setUserInfo(res.data);
          await getPlaylist(res.data.id); // Pass the id directly to getPlaylist
        } catch (err) {
          console.log(err);
        }
      }
      getProfile();
    }, []);

    async function getPlaylist(userId) { // Use parameter for userId
      try {
        const res = await axios.get(`${import.meta.env.VITE_APP_API}/user-playlist`, {
          params: { id: userId }, // Use the passed parameter
          withCredentials: true
        });
        console.log(res, 'playlist datas');
        setPlaylists(res.data.items);
      } catch (error) {
        console.log(error);
      }
    }

    const handlePlaylistNameChange = (event,newValue) => {
      console.log('chnage')
      console.log(event.target.value)
      setPlaylistName(event.target.value);
    }
    const handleChangePeriod = (event, newValue) => {
      setmotivationPeriod(newValue);
      console.log(motivationPeriod)
    };
    const handleLengthChange = (event,newvalue) => {
      setplaylistLength(newvalue)
    }
    const handleWarmupChange = (event,newvalue) => {
      setWarmupTime(newvalue)
    }

    const handleRadioChange = (event) => {
      setplaylistId(event.target.value)
    }

    async function handleSubmit() {
      const data = {
        playlistId,
        playlistLength,
        warmupLength:warmupTime,
        motivationPeriod,
        userId:userInfo.id,
        playlistName
      }
      setLoading(true)
      await axios.post(`${import.meta.env.VITE_APP_API}/playlist/create/byplaylist/pre`, data, {withCredentials:true})
      .then((res) => {
        setPrePlaylist(res.data)
        console.log(res, 'here we go')
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
      })

      console.log(data,'submitting this data')
    }

    async function handleConfirmGeneration() {
      setLoading2(true)
      const data = {playlistTracks:prePlaylist,userId:userInfo.id,playlistName}
      await axios.post(`${import.meta.env.VITE_APP_API}/playlist/create/byplaylist/confirm`, data, {withCredentials:true})
      .then((res) => {
        console.log(res)
        setLoading2(false)
      })
      .catch((err) => {
        console.log(err,'error creating playlist')
      })
    }
  return (
    <div className='create-by-playlist-wrapper'> 
      <h1>Create using your own playlist!</h1>
      <Form.Label htmlFor="playlistName">Playlist Name</Form.Label>
      <Form.Control
        style={{border:'1px solid #81abdd'}}
        type="text"
        id="playlistName"
        value={playlistName}
        onChange={handlePlaylistNameChange}
      />
     <div className='slider-wrapper'>
        <h2>Estimated length of playlist (in min)</h2>
        <Box sx={{ width: '100%' }}>
          <div>
            <Slider color="secondary" onChange={handleLengthChange} defaultValue={50} aria-label="Always visible" valueLabelDisplay="auto" />
            <p>{playlistLength}</p>
          </div>
        </Box>
    </div>

    <div className='slider-wrapper'>
        <h2>Length of Warmup?</h2>
        <Box sx={{ width: '100%' }}>
          <div>
            <Slider color="warning" onChange={handleWarmupChange} defaultValue={0} max={playlistLength} aria-label="Always visible" valueLabelDisplay="auto" />
            <p>{warmupTime}</p>
          </div>
        </Box>
    </div>

    <div className='slider-wrapper' >
      <h2>Pick a period when you need the most motivation</h2>
      <Box sx={{ width: '100%' }}>
        <div>
          <Slider aria-label="Always visible" value={motivationPeriod} max={playlistLength || 100}  onChange={handleChangePeriod} valueLabelDisplay="auto"/>
          <p>{motivationPeriod[0]} - {motivationPeriod[1]}</p>
        </div>
      </Box>
    </div>
    <h2>Pick your playlist to generate from</h2>
      <div className='playlist-display-wrapper'>
      <ul>
        {!playlists && (<><Loading/></>)}
        {playlists?.map((playlist,index) => (
            <div className="single-playlist">
            <h2>
            {playlist.name.length > 20 ? playlist.name.substring(0, 17) + '...' : playlist.name}
            </h2>
            <div className='playlist-img-wrap'>
                <p>click to visit playlist</p>
                <a target='blank' href={playlist.external_urls.spotify}><img className='playlist-img' src={playlist.images[0].url} alt="" /></a>
                <Form.Check
              
                name= 'playlist'
                type={'radio'}
                id={`inline-'radio'-${index}`}
                value={playlist.id}
                onChange={handleRadioChange}
              />
            </div>
          </div>
        ))}
    </ul>
      </div>
      <Button onClick={handleSubmit} variant="primary">Generate</Button>
      {loading && (<><Loading/></>)}
      <div>
        {prePlaylist && <h2>Your Playlist is ready! Check below to confirm</h2>}
        
        {prePlaylist?.map((track) => (<>
          <iframe 
            style={{ borderRadius: '12px' }}
            src={`https://open.spotify.com/embed/track/${track.id}?utm_source=generator`} 
            width="100%" height="152" frameBorder="0" allowfullscreen="" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy">
            </iframe>
          </>))}
      </div>
      {prePlaylist && <><h2>Does it look good? Click below to confirm playlist generation!</h2>
      <Button onClick={handleConfirmGeneration} variant="primary">Get this in my Spotify!</Button></>}
      {loading2 != false && prePlaylist != null && (<><Loading/></>)}
  </div>
   
  )
}

export default CreateByPlaylist