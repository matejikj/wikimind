import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { SessionContext } from "../sessionContext";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import '../styles/style.css';
import { MdOutlineCancel } from "react-icons/md";
import { ImMenu } from "react-icons/im";
import { logout } from "@inrupt/solid-client-authn-browser";

const Sidenav: React.FC = () => {
  const navigate = useNavigate();

  const sessionContext = useContext(SessionContext);
  const logoutSession = async () => {
    logout().then(() => {
      sessionContext.setSessionInfo({
        webId: "",
        podUrl: "",
        isLogged: false,
        podAccessControlPolicy: null
      })
    })
  }

  return (
    <Navbar className="sidenav" key={"false"} bg="light" fixed="top" expand={false}>
      <Container fluid>
        <Navbar.Toggle bsPrefix={"btn btn-sm"} aria-controls={`offcanvasNavbar-expand-${false}`}>
          <ImMenu></ImMenu>
        </Navbar.Toggle>
        <img className="logo" src={'../logo.png'} />

        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${false}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${false}`}
          placement="start"
        >
          <Offcanvas.Header closeButton>
            <img className="logo" src="../logo.png" />
          </Offcanvas.Header>
          <Offcanvas.Body>
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
              <Nav.Link onClick={() => { navigate('/history') }}>History</Nav.Link>
            </Nav>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link onClick={logoutSession}>Logout</Nav.Link>
            </Nav>

          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Sidenav;
