import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import axios from 'axios'
import { useEffect, useState } from 'react';

function NavbarComp() {
  const [auth, setAuth] = useState(false)
  useEffect(() => {
    axios.get('http://localhost:3000/user/verify', {withCredentials:true})
    .then((res) => {
        console.log(res.data ,'user status')
        setAuth(res.data)
    })
    .catch((err) => {
        console.log(err)
    })
},[])
  async function logout() {
    console.log('logout')
  }

  return (
    <Navbar bg="myColor" expand="lg" >
      <Container fluid>
        <Navbar.Brand as={Link} to="/">Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" >
            {!auth && (<Nav.Link as={Link} to="/login" >Login</Nav.Link>)}
            {auth && (<Nav.Link onClick={logout} >Logout</Nav.Link>)}
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComp;