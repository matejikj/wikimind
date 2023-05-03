import './Login.css';
import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { handleIncomingRedirect, login } from "@inrupt/solid-client-authn-browser";

const authOptions = {
  clientName: "Learnee",
};

const Login: React.FC = () => {
  const [currentProvider, setCurrentProvider] = useState<string>('');

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
            <option value="https://login.inrupt.com/">https://login.inrupt.com/</option>
          </Form.Select>
        </Col>
        <Col></Col>
      </Row>
      <Row>
        <Col></Col>
        <Col>
          <Form.Control
            type="text"
            placeholder="Id"
            value={currentProvider}
            name="id"
            onChange={(e) => {setCurrentProvider(e.target.value)}}
          />
        </Col>
        <Col></Col>
      </Row>
      <Row>
        <Col></Col>
        <Col>
          <Button onClick={() => {login({ oidcIssuer: currentProvider })}} variant="primary">LOGIN</Button>
        </Col>
        <Col></Col>
      </Row>
    </Container>

  );
};

export default Login;
