import React, { useEffect, useRef } from 'react'
import axios from 'axios'
import {motion, useInView} from 'framer-motion'
import { useHref } from 'react-router-dom'
import image1 from '../img/spotifyimage1.webp'
import image2 from '../img/running-image.webp'
import image3 from '../img/runningman2.avif'
import Loading from '../components/Loading'
const Home = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, {once:true})

    useEffect(() => {
        console.log("Is in view ->", isInView)
    },[isInView])

    useEffect(() => {
        async function profileGet() {
            await axios.get(`${import.meta.env.VITE_API_PORT}/profile`, {withCredentials:true})
            .then((res) => {
                console.log(res.data,'home page')
            })
            .catch ((error) => {
                console.log('error', error.response)
                if (error.response.status === 401) {
                    logout();
                }
            })
        }
        profileGet()
    },[])

    useEffect(() => {
        axios.get('http://localhost:3000/user/verify', {withCredentials:true})
        .then((res) => {
            console.log(res.data ,'user status')
        })
        .catch((err) => {
            console.log(err)
        })
    },[])
  return (
    <div className='home-page-wrapper'>
        <h1>Spotify Workout Generator - Revolutionize Your Fitness Routine</h1>
        <h3>Welcome to Spotify Workout Generator – your ultimate companion for personalized workout playlists. 
            Say goodbye to endless scrolling and uninspired music selections. 
            Our innovative website harnesses the power of Spotify's extensive music library to 
            create custom playlists that match the intensity and duration of your workouts.</h3>
            <motion.div
            
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 5,type: "spring"}}
            className='motion-text-wrapper'
            >
       <div className='home-image-wrapper'>
            <img className='home-image-1' src={image1} alt="" />
            <div className='home-image-wrapper-right'>
                <div className='home-image-wrapper-right-inner'>
                <img className='home-image-2' src={image2} alt="" />
                <img className='home-image-2' src={image2} alt="" />
                </div>
                
                <img className='home-image-3' src={image3} alt="" />
            </div>
            </div>
            
    </motion.div>
            
            
            <div className='motion-text-wrapper'
            
        ref={ref}
        style={{
             background: isInView? 'rgb(85, 200, 85)' :'white',
             color:'white',
            transform: isInView ? "none" : "translateX(-200px)",
          opacity: isInView ? 1 : 0,
          transition: "all 3s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
        }}>
           <h3 style={{marginLeft:5}}>Features:</h3>
       <ul>
        <li>Custom Workout Playlists: Tailor your music to the type of workout you're doing, whether it's a high-intensity interval training session, a relaxing yoga flow, or anything in between. Choose your workout duration, intensity, and preferred music genres to get started.</li>
        <li>Diverse Music Selection: With access to Spotify's vast music library, find songs and beats that keep you motivated and moving. From the latest hits to timeless classics, discover the perfect soundtrack for your fitness journey.</li>
        <li>Intelligent Audio Feature Integration: Utilize Spotify's audio features like tempo, energy, and danceability to ensure each track fits the workout phase – from warm-up to high-intensity and cool-down.</li>
        <li>User-Friendly Interface: Our intuitive design makes it simple for you to get your personalized playlist quickly. No complicated setups or overwhelming options – just your music, tailored to your workout, ready in seconds.</li>
       </ul>
        </div>
        <motion.div
            
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 8,type: "spring"}}
            className='motion-text-wrapper'
            >
        <h4>Elevate Your Workout Experience</h4>
        <p>At Spotify Workout Generator, we believe music is a powerful motivator. That's why we've created a tool that adapts to your fitness routine, offering musical inspiration that pushes you to perform your best. Whether you're a seasoned athlete looking for an extra edge or someone just starting their fitness journey, our site provides the perfect backdrop for every workout.</p>
            <h4>Start Now</h4>
            <p>Transform your workouts with music that moves with you. Visit Spotify Workout Generator today and unleash the potential of every beat. Because when the right song hits at the right moment, there's no limit to what you can achieve.</p>
    </motion.div>
        
    </div>
  )
}

export default Home