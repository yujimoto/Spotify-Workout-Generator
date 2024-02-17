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
import About from './page/About'
import FooterComp from './components/FooterComp'
function App() {
 

  return (
    <>
    <AuthProvider> 
    <body>
      <Router>
      <div className="app-container">
        <NavbarComp/>
        <div className="content-wrap">
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<LoginPage/>} />
          <Route path='/callback' element={<CallbackPage/>} />
          <Route path='/createbyplaylist' element={<CreateByPlaylist/>} />
          <Route path='/about' element={<About/>} />
          </Routes>
          </div>
          </div>
        </Router>
        </body>
        <FooterComp/>
      
      </AuthProvider>
      
    </>
  )
}

export default App
