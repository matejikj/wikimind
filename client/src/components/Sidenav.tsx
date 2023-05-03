import { NavLink } from "react-router-dom";
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
            <Navbar.Brand href="#">Navbar Offcanvas</Navbar.Brand>
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
                  <Nav.Link href="#action1">Home</Nav.Link>
                  <Nav.Link href="#action2">Link</Nav.Link>
                  <NavDropdown
                    title="Dropdown"
                    id={`offcanvasNavbarDropdown-expand-${"sm"}`}
                  >
                    <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action4">
                      Another action
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action5">
                      Something else here
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
                <Form className="d-flex">
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                  />
                  <Button variant="outline-success">Search</Button>
                </Form>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>

    );
};

export default Sidenav;
