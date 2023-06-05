import './Login.css';
import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { handleIncomingRedirect, login } from "@inrupt/solid-client-authn-browser";
import { Card } from 'react-bootstrap';

const authOptions = {
  clientName: "Learnee",
};

const Login: React.FC = () => {
  const [currentProvider, setCurrentProvider] = useState<string>('');

  return (
    <div id="login">
      <Container className='center-container'>
        <Row>
          <Col sm={12}>
            <Card>
              <Card.Body>
                <Card.Title>Pod provider</Card.Title>
                <br />
                <Form.Select
                  onChange={(e) => { setCurrentProvider(e.target.value) }}
                  value={currentProvider}
                  aria-label="Default select example"
                  style={{ maxWidth: '600px' }}
                >
                  <option>Open this select menu</option>
                  <option value="https://datapod.igrant.io/">https://datapod.igrant.io/</option>
                  <option value="https://inrupt.net">https://inrupt.net</option>
                  <option value="https://use.id/matejikj">https://use.id/matejikj</option>
                  <option value="https://solidweb.org">https://solidweb.org</option>
                  <option value="https://login.inrupt.com/">https://login.inrupt.com/</option>
                </Form.Select>
                <br />
                <Form.Control
                  type="text"
                  placeholder="Id"
                  value={currentProvider}
                  name="id"
                  style={{ maxWidth: '600px' }}
                  onChange={(e) => { setCurrentProvider(e.target.value) }}
                />
                <br />
                <Button onClick={() => { login({ oidcIssuer: currentProvider }) }} variant="primary">LOGIN</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>


  );
};

export default Login;
