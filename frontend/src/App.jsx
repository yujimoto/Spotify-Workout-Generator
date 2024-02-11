import { useState } from 'react'
import './App.css'
import { AuthProvider } from '../AuthContext'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './page/Home'
import LoginPage from './page/LoginPage'
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComp from './components/NavbarComp'
import CallbackPage from './page/CallbackPage'
import CreateByPlaylist from './page/CreateByPlaylist'
function App() {
 

  return (
    <>
    <AuthProvider> 
    <body>
      <Router>
      
        <NavbarComp/>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<LoginPage/>} />
          <Route path='/callback' element={<CallbackPage/>} />
          <Route path='/createbyplaylist' element={<CreateByPlaylist/>} />
        </Routes>
        
      </Router>
      </body>
      </AuthProvider>
    </>
  )
}

export default App
