import { NavLink, useNavigate } from "react-router-dom";
import { TiThMenu, TiThMenuOutline, TiTag, TiVendorAndroid, TiLockOpenOutline } from 'react-icons/ti';
import styles from "./Sidenav.module.css"
import { useContext, useState } from "react";
import { handleIncomingRedirect, onSessionRestore, logout, getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { SessionContext } from "../sessionContext";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import './Sidenav.css';

export enum SideNavType {
  COMMON,
  CANVAS
}

const Sidenav: React.FC<{ type: SideNavType }> = ({ type }) => {
  const navigate = useNavigate();

  const [open, setopen] = useState(true)
  const toggleOpen = () => {
    setopen(!open)
  }

  const theme = useContext(SessionContext);

  const logout = async () => {
    // const logged = await logout()
    theme.setSessionInfo({
      webId: "",
      podUrl: "",
      isLogged: false,
      podAccessControlPolicy: null
    })
  }

  return (
    <Navbar key={"false"} bg="light" expand={false}>
      <Container fluid>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${false}`} />
        <img className="logo" src={'../logo.png'}/>

        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${false}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${false}`}
          placement="start"
        >
          <Offcanvas.Header closeButton>
          <img className="logo" src="../logo.png"/>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {/* {(type === SideNavType.CANVAS) &&
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link onClick={() => { navigate('/') }}>Home</Nav.Link>
              </Nav>
            } */}
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link onClick={() => { navigate('/') }}>Home</Nav.Link>
            </Nav>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link onClick={() => { navigate('/profile') }}>Profile</Nav.Link>
            </Nav>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link onClick={() => { navigate('/classes') }}>Classes</Nav.Link>
            </Nav>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link onClick={() => { navigate('/messages') }}>Messages</Nav.Link>
            </Nav>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            </Nav>

          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Sidenav;
