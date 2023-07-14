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
import { LanguageLocalization } from "../models/types/UserSession";
import sidenavLocalization from "../localizations/sidenav.json";
import { Button } from "react-bootstrap";

const Sidenav: React.FC = () => {
  const navigate = useNavigate();

  const sessionContext = useContext(SessionContext);
  const logoutSession = async () => {
    logout().then(() => {
      sessionContext.setSessionInfo({
        webId: "",
        podUrl: "",
        isLogged: false,
        localization: LanguageLocalization.EN,
        podAccessControlPolicy: null
      })
    })
  }

  function switchLanguage() {
    sessionContext.sessionInfo.localization === LanguageLocalization.CS ?
      sessionContext.setSessionInfo({ ...sessionContext.sessionInfo, localization: LanguageLocalization.EN }) :
      sessionContext.setSessionInfo({ ...sessionContext.sessionInfo, localization: LanguageLocalization.CS })
  }

  return (
    <Navbar className="sidenav" key={"false"} bg="light" fixed="top" expand={false}>
      <Container fluid>
        <Navbar.Toggle bsPrefix={"btn btn-sm"} aria-controls={`offcanvasNavbar-expand-${false}`}>
          <ImMenu></ImMenu>
        </Navbar.Toggle>
        {sessionContext.sessionInfo.localization === LanguageLocalization.CS ?
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => switchLanguage()}
          >
            🇨🇿
          </Button> :
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => switchLanguage()}
          >
            🇬🇧
          </Button>
        }
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
              <Nav.Link onClick={() => { navigate('/') }}>{sidenavLocalization.dashboard[sessionContext.sessionInfo.localization]}</Nav.Link>
            </Nav>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link onClick={() => { navigate('/profile') }}>{sidenavLocalization.profile[sessionContext.sessionInfo.localization]}</Nav.Link>
            </Nav>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link onClick={() => { navigate('/classes') }}>{sidenavLocalization.classes[sessionContext.sessionInfo.localization]}</Nav.Link>
            </Nav>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link onClick={() => { navigate('/chats') }}>{sidenavLocalization.messages[sessionContext.sessionInfo.localization]}</Nav.Link>
            </Nav>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link onClick={logoutSession}>{sidenavLocalization.logout[sessionContext.sessionInfo.localization]}</Nav.Link>
            </Nav>

          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Sidenav;
