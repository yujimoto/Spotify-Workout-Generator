import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useEffect, useState } from 'react';

function NavbarComp() {
  const [auth, setAuth] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    async function verifyUser() {
      await axios.get('http://localhost:3000/user/verify', {withCredentials:true})
    .then((res) => {
        console.log(res.data ,'user status')
        setAuth(res.data)
    })
    .catch( async (err) => {
        console.log(err)
        if (err.response?.data?.error === 'Access token not found') {
          const refreshTokenResponse = await axios.get(`${import.meta.env.VITE_APP_API}/refresh_token?refresh_token`, { withCredentials: true });
          console.log(refreshTokenResponse, 'refresh token endpoint response');
      }
    })
    }
    verifyUser()
},[])
  async function logout() {
    await axios.get(`${import.meta.env.VITE_APP_API}/logout`, {withCredentials:true})
    .then((res) => {
      console.log(res)
      console.log('logout')
      window.location.assign('/');
    }).catch((err) => {
      console.log(err)
    })
    
  }

  return (
    <Navbar bg="myColor" expand="lg" >
      <Container fluid>
        <Navbar.Brand as={Link} to="/">Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" >
            {!auth && (<Nav.Link as={Link} to="/login" >Login</Nav.Link>)}
            {auth && (<Nav.Link as={Link} to="/createbyplaylist" >Create your Playlist</Nav.Link>)}
            {/* <Nav.Link href="#link">Link</Nav.Link> */}
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              {/* <NavDropdown.Item href="/createbyplaylist">Create</NavDropdown.Item> */}
             
              <NavDropdown.Item as={Link} to="/about">About</NavDropdown.Item>
              <NavDropdown.Divider />
              {/* {auth && (<Nav.Link onClick={logout} >Logout</Nav.Link>)} */}
              {auth &&<NavDropdown.Item onClick={logout}>logout</NavDropdown.Item>}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComp;