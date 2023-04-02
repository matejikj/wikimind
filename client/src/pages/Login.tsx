import { LoginButton } from "@inrupt/solid-ui-react";
import './Login.css';
import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const authOptions = {
  clientName: "Learnee",
};

const Login: React.FC = () => {
  const providerOptions = [
    'https://datapod.igrant.io/',
    'https://inrupt.net'
  ];
  const [currentProvider, setCurrentProvider] = useState<string>('');
  return (
    <Container fluid>
      <Row>
        <Col></Col>
        <Col>
          <Form.Select onChange={(e) => {setCurrentProvider(e.target.value)}} value={currentProvider} aria-label="Default select example">
            <option>Open this select menu</option>
            <option value="https://datapod.igrant.io/">https://datapod.igrant.io/</option>
            <option value="https://inrupt.net">https://inrupt.net</option>
          </Form.Select>
        </Col>
        <Col></Col>
      </Row>
      <Row>
        <Col></Col>
        <Col>
          <LoginButton
            oidcIssuer={currentProvider}
            redirectUrl={window.location.href}
            authOptions={authOptions}
          >
            <Button variant="primary">Primary</Button>{' '}
          </LoginButton>
        </Col>
        <Col></Col>
      </Row>
    </Container>
    
  );
};

export default Login;
