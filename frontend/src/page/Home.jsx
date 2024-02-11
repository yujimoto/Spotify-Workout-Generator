import React, { useEffect } from 'react'
import axios from 'axios'
const Home = () => {
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
    <div>Home</div>
  )
}

export default Home