import { logout } from "@inrupt/solid-client-authn-browser";
import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { ImMenu } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { LanguageLocalization } from "../models/UserSession";
import { AccessControlPolicy } from "../models/enums/AccessControlPolicy";
import { SessionContext } from "../sessionContext";
import '../styles/style.css';
import sidenavLocalization from "./locales/sidenav.json";

/**
 * Represents the Sidenav component.
 * This component provides a collapsible sidebar navigation menu.
 */
const Sidenav: React.FC = () => {
  const navigate = useNavigate();

  // Access the session context to get session information
  const sessionContext = useContext(SessionContext);

  /**
   * Handles the user logout action by calling the logout function from "@inrupt/solid-client-authn-browser" package.
   * After logout, it updates the session information with empty values and sets isLogged to false.
   */
  const logoutSession = async () => {
    logout().then(() => {
      sessionContext.setSessionInfo({
        webId: "",
        podUrl: "",
        isLogged: false,
        localization: LanguageLocalization.EN,
        podAccessControlPolicy: AccessControlPolicy.WAC
      })
    })
  }

  /**
   * Toggles the application language between Czech and English by updating the session information.
   */
  function switchLanguage() {
    sessionContext.sessionInfo.localization === LanguageLocalization.CS ?
      sessionContext.setSessionInfo({ ...sessionContext.sessionInfo, localization: LanguageLocalization.EN }) :
      sessionContext.setSessionInfo({ ...sessionContext.sessionInfo, localization: LanguageLocalization.CS })
  }

  return (
    <Navbar className="sidenav" key={"false"} bg="light" fixed="top" expand={false}>
      <Container fluid>
        {/* Toggle button for the offcanvas */}
        <Navbar.Toggle bsPrefix={"btn btn-sm"} aria-controls={`offcanvasNavbar-expand-${false}`}>
          <ImMenu></ImMenu>
        </Navbar.Toggle>

        {/* Logo */}
        <img alt="wikimind" className="logo" src={'../logo.png'} />

        {/* Language switch button */}
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

        {/* Offcanvas menu */}
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${false}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${false}`}
          placement="start"
        >
          {/* Offcanvas header */}
          <Offcanvas.Header closeButton>
            <img className="logo" src="../logo.png" />
          </Offcanvas.Header>

          {/* Offcanvas body */}
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              {/* Navigation link to the dashboard */}
              <Nav.Link onClick={() => { navigate('/') }}>
                {sidenavLocalization.dashboard[sessionContext.sessionInfo.localization]}
              </Nav.Link>
            </Nav>

            <Nav className="justify-content-end flex-grow-1 pe-3">
              {/* Navigation link to the user profile */}
              <Nav.Link onClick={() => { navigate('/profile') }}>
                {sidenavLocalization.profile[sessionContext.sessionInfo.localization]}
              </Nav.Link>
            </Nav>

            <Nav className="justify-content-end flex-grow-1 pe-3">
              {/* Navigation link to the classes */}
              <Nav.Link onClick={() => { navigate('/classes') }}>
                {sidenavLocalization.classes[sessionContext.sessionInfo.localization]}
              </Nav.Link>
            </Nav>

            <Nav className="justify-content-end flex-grow-1 pe-3">
              {/* Navigation link to the messages */}
              <Nav.Link onClick={() => { navigate('/chats') }}>
                {sidenavLocalization.messages[sessionContext.sessionInfo.localization]}
              </Nav.Link>
            </Nav>

            <Nav className="justify-content-end flex-grow-1 pe-3">
              {/* Logout link */}
              <Nav.Link onClick={logoutSession}>
                {sidenavLocalization.logout[sessionContext.sessionInfo.localization]}
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Sidenav;
