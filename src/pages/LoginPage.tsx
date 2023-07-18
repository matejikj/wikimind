import { login } from "@inrupt/solid-client-authn-browser";
import React, { useState } from "react";
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import '../styles/style.css';

/**
 * Represents the LoginPage component that allows users to log in to their Solid pods.
 */
const LoginPage: React.FC = () => {
  // State to hold the selected pod provider's URL.
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
                {/* Dropdown to select a pod provider */}
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
                  <option value="https://solid.redpencil.io/">https://solid.redpencil.io/</option>
                  <option value="https://login.inrupt.com/">https://login.inrupt.com/</option>
                  <option value="https://solidweb.me/">https://solidweb.me/</option>
                </Form.Select>
                <br />
                {/* Input field to manually enter a pod provider's URL */}
                <Form.Control
                  type="text"
                  placeholder="Id"
                  value={currentProvider}
                  name="id"
                  style={{ maxWidth: '600px' }}
                  onChange={(e) => { setCurrentProvider(e.target.value) }}
                />
                <br />
                {/* Button to initiate the login process */}
                <Button onClick={() => { login({ oidcIssuer: currentProvider }) }} variant="primary">LOGIN</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;