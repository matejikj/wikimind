import { LoginButton } from "@inrupt/solid-ui-react";
import './Login.css';
import React, { useEffect, useState, useContext } from "react";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { handleIncomingRedirect, ILoginInputOptions, login, onSessionRestore, logout } from "@inrupt/solid-client-authn-browser";
import { SessionContext, UserData } from "../sessionContext";

const authOptions = {
  clientName: "Learnee",
};

const Login: React.FC = () => {
  const providerOptions = [
    'https://datapod.igrant.io/',
    'https://inrupt.net',
    'https://use.id'
  ];
  const [currentProvider, setCurrentProvider] = useState<string>('');
  const theme = useContext(SessionContext);

  const aaa: UserData = {
    session: undefined,
    name: "fdsafas",
    isLogged: true,
  }

  const a = async () => {
    console.log('fdsafs')
    console.log(theme.userData)
    const logged = await login({oidcIssuer: "https://inrupt.net"})
    // setContextMenu({
    //   ...contextMenu,
    //   x: e.x,
    //   y: e.y,
    //   visibility: "visible"
    // })
    console.log(logged)
    theme.setUserData({
      name: 'fdas',
      isLogged: true,
      session: null
    })
    console.log(theme.userData)

  }

  return (
    <Container fluid>
      <Row>
        <Col></Col>
        <Col>
          <Form.Select onChange={(e) => { setCurrentProvider(e.target.value) }} value={currentProvider} aria-label="Default select example">
            <option>Open this select menu</option>
            <option value="https://datapod.igrant.io/">https://datapod.igrant.io/</option>
            <option value="https://inrupt.net">https://inrupt.net</option>
            <option value="https://use.id/matejikj">https://use.id/matejikj</option>
          </Form.Select>
        </Col>
        <Col></Col>
      </Row>
      <Row>
        <Col></Col>
        <Col>
          <Button onClick={a} variant="primary">saas</Button>
          <h1>{theme.userData?.name}</h1>
          {/* <LoginButton
            oidcIssuer={currentProvider}
            redirectUrl={window.location.href}
          >
            <Button variant="primary">Primary</Button>{' '}
          </LoginButton> */}
        </Col>
        <Col></Col>
      </Row>
    </Container>

  );
};

export default Login;
