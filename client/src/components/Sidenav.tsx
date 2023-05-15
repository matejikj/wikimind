import { NavLink, useNavigate } from "react-router-dom";
import { TiThMenu, TiThMenuOutline, TiTag, TiVendorAndroid, TiLockOpenOutline } from 'react-icons/ti';
import styles from "./Sidenav.module.css"
import { useContext, useState } from "react";
import { handleIncomingRedirect, onSessionRestore, logout } from "@inrupt/solid-client-authn-browser";
import { SessionContext, UserData } from "../sessionContext";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';

export const navData = [
    {
        id: 0,
        text: "Home",
        link: "/",
        icon: <TiTag />
    }
]

type AppProps = { message: string };

const Sidenav: React.FC<{ props: AppProps }> = ({ props }) => {
  const navigate = useNavigate();

    const [open, setopen] = useState(true)
    const toggleOpen = () => {
        setopen(!open)
    }

    const theme = useContext(SessionContext);

    const a = async () => {
        console.log('fdsafs')
        console.log(theme.userData)
        const logged = await logout()
        console.log(logged)
        theme.setUserData({
            isLogged: false,
            session: null
        })
        console.log(theme.userData)
    }

    return (
        <Navbar key={"sm"} bg="light" expand={"sm"} className="mb-3">
          <Container fluid>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${"sm"}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${"sm"}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${"sm"}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${"sm"}`}>
                  Offcanvas
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link onClick={() => {navigate('/')}}>Home</Nav.Link>
                </Nav>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link onClick={() => {navigate('/profile')}}>Profile</Nav.Link>
                </Nav>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link onClick={() => {navigate('/classes')}}>Classes</Nav.Link>
                </Nav>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link onClick={() => {navigate('/messages')}}>Messages</Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>

    );
};

export default Sidenav;
