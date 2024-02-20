const express = require('express')
const router = express.Router();
const axios = require('axios')


async function getAudioStat(trackId,accessToken) {
    try {
        const response = await axios.get(`https://api.spotify.com/v1/audio-features/${trackId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = response.data;
        //console.log(data)
        return data
      } catch (error) {
        console.error('Error fetching playlist from Spotify:', error, 'erro with audio feature');
        return ('error')
      }
}

async function getAudioFeaturesForTracks(trackIds, accessToken) {
  try {
      // Spotify API endpoint for getting audio features for multiple tracks
      const endpoint = `https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`;

      const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      // The response.data.audio_features is an array of audio features objects
      return response.data.audio_features;
  } catch (error) {
      console.error('Error fetching audio features from Spotify:', error);
      return []; // Return an empty array or handle the error as needed
  }
}
function scoreTrack(track) {
  // Adjust weights as needed
  const tempoWeight = 0.30;
  const energyWeight = 0.40;
  const danceabilityWeight = 0.30;

  return (track.tempo * 0.001 * tempoWeight) + (track.energy * energyWeight) + (track.danceability * danceabilityWeight);
}
function sortTracksForMotivation(playlist) {
  return playlist.sort((a, b) => scoreTrack(b) - scoreTrack(a));
}
function orderPlaylist(playlistUnordered,playlistLength,warmupLength,motivationPeriod) {
  const totalDurationMs = playlistLength * 60 * 1000; // Convert minutes to milliseconds
  const warmupDurationMs = warmupLength * 60 * 1000;
  let currentDurationMs = 0;

  // Sort tracks by score
  const sortedTracks = sortTracksForMotivation(playlistUnordered);

  //console.log(sortedTracks)
  // Placeholder for the final ordered playlist
  const reducedPlaylist = [];

  for (const track of sortedTracks) {
      if (currentDurationMs + track.duration_ms > totalDurationMs) {
          break; // Stop if adding the current track would exceed the total duration
      }
      reducedPlaylist.push(track);
      currentDurationMs += track.duration_ms;
  }
  // console.log(reducedPlaylist, 'reducedddddd')

  let currentWarmupDuration = 0;
  const warmupTracks = [];
  // Iterate from the end of the reduced playlist to accumulate low-scoring tracks for warmup
  // Reverse iterate through the reduced playlist to find low-scoring tracks for the warmup
  for (let i = reducedPlaylist.length - 1; i >= 0; i--) {
    const track = reducedPlaylist[i];

    // Ensure at least one track is added to the warmup, even if it exceeds the warmup length
    if (warmupTracks.length === 0 || currentWarmupDuration + track.duration_ms <= warmupDurationMs) {
      warmupTracks.unshift(track); // Add to the beginning of warmupTracks
        currentWarmupDuration += track.duration_ms;
        reducedPlaylist.splice(i, 1); // Remove this track from reducedPlaylist
    }
    // After the first track is added, break if the next track exceeds the warmup period
    if (warmupTracks.length > 0 && currentWarmupDuration + track.duration_ms > warmupDurationMs) {
        break;
    }
  }
  const motivationPeriodMs = (motivationPeriod[1]* 60 * 1000 - motivationPeriod[0] * 60 * 1000);
  let motivationTracks = [];
  let remainingTracks = []; // Tracks not selected for warmup or motivation, to be filled around them
  
  let motivationDuration = 0;
  for (const track of reducedPlaylist) {
      if (motivationDuration < motivationPeriodMs || motivationTracks.length === 0) {
          motivationDuration += track.duration_ms;
          motivationTracks.push(track);
      } else {
          remainingTracks.push(track); // Tracks for the general session
      }
  }

  let currentPlaylistDuration = warmupTracks.reduce((acc, track) => acc + track.duration_ms, 0);
  const finalPlaylist = [...warmupTracks]; // Start with warmup tracks
  // Add tracks to the general session until reaching the motivation start time
  for (const track of remainingTracks) {
    if (currentPlaylistDuration >= warmupDurationMs && currentPlaylistDuration < motivationDuration) {
        finalPlaylist.push(track);
        currentPlaylistDuration += track.duration_ms;
    }
  }
  // Add motivation tracks
  finalPlaylist.push(...motivationTracks);

  // Continue filling with remaining tracks until reaching the total playlist length
  for (const track of remainingTracks) {
      if (!finalPlaylist.includes(track) && currentPlaylistDuration < totalDurationMs) { // Ensure the track isn't already added
          finalPlaylist.push(track);
          currentPlaylistDuration += track.duration_ms;
      }
  }
  return finalPlaylist;
}

router.post('/create/byplaylist/pre', async (req,res) => {
    const {playlistId,playlistLength,warmupLength,motivationPeriod,userId,playlistName} = req.body
    // console.log(playlistId,motivationPeriod,playlistLength,warmupLength)
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
    return res.status(401).json({ error: 'Access token not found' });
    }
    try {
        console.log('thjis too')
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const playlistItems = response.data.tracks.items;
        const validPlaylistItems = playlistItems.filter(item => item.track && item.track.id);
        const playlistTrackIds = validPlaylistItems.map(item => item.track.id);
        // console.log(playlistItems[0], 'debug')
        // const playlistTrackIds = playlistItems.map(item => item.track.id);
        // const playlistTrackIds = playlistItems.map((item,index) => {
        //   // if (!item.track || !item.track.id) {
        //   //   console.log("A track with a null ID was found:",index, item);
        //   //   return null; // or however you wish to handle this case in your array
        //   // }
        //   console.log("A track",index, item);
        //   return item.track.id;
        // });
      
        const audioFeatures = await getAudioFeaturesForTracks(playlistTrackIds,accessToken)
        //add stuff so if there are more than 100 tracks then it will split it up and call the getAudioFeat m,ultiple times
        const playlistOrdered = orderPlaylist(audioFeatures,playlistLength,warmupLength,motivationPeriod)
        res.json(playlistOrdered);
      } catch (error) {
        console.error('Error fetching playlist from Spotify:', error, 'wtf');
        // const retryAfter = error.response.headers['retry-after'];
        res.status(500).json({ error: 'Internal Server Error' });
      }
})

async function addTracksToPlaylist(playlistId, playlistTracks, accessToken) {
  const uris = playlistTracks.map(track => `spotify:track:${track.id}`);
  console.log(uris)
  await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
  {uris:uris}, { headers: { Authorization: `Bearer ${accessToken}` } })
  .then((response) => {
    console.log(response, 'res from adding trakcs to palylist')
  }).catch((err) => {
    console.log(err, 'error adding tracks')
  })
}

router.post('/create/byplaylist/confirm', async (req, res) => {
  const { playlistTracks, userId, playlistName } = req.body;
  const accessToken = req.cookies.accessToken;
  
  console.log('called')
  if (!accessToken) {
    return res.status(401).json({ error: 'Access token not found' });
  }
  try {
    //Create a new playlist
    const data = { name: playlistName}
    const response = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      data,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    console.log(response.data, 'response from creating playlist');
    
    const playlistId = response.data.id;
     await addTracksToPlaylist(playlistId, playlistTracks, accessToken);
    
    //res.json({ message: 'success', playlistId: response.data.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create playlist' });
  }
});


module.exports = router;