import { login } from "@inrupt/solid-client-authn-browser";
import React, { useState } from "react";
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import loginLocalization from "./locales/login.json";

import { LanguageLocalization } from "../models/UserSession";
import '../styles/style.css';

/**
 * LoginPage
 */
const LoginPage: React.FC = () => {
  const [currentProvider, setCurrentProvider] = useState<string>('');
  const [language, setLanguage] = useState<LanguageLocalization>(LanguageLocalization.CS);

  return (
    <div id="login">
      <Container className='center-container'>
        <Row>
          <Col sm={12}>
            <Card
              border="dark"
              text='dark'
            >
              <Card.Body>
                <Card.Subtitle>
                  {
                    language === LanguageLocalization.CS ?
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => setLanguage(LanguageLocalization.EN)}
                      >
                        🇨🇿
                      </Button> :
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => setLanguage(LanguageLocalization.CS)}
                      >
                        🇬🇧
                      </Button>
                  }
                </Card.Subtitle>
                <Card.Title>
                  {loginLocalization.podProvider[language]}
                </Card.Title>
                <br />
                <Form.Select
                  onChange={(e) => { setCurrentProvider(e.target.value) }}
                  value={currentProvider}
                  aria-label="Default select example"
                  style={{ maxWidth: '600px' }}
                >
                  <option>{loginLocalization.select[language]}</option>
                  <option value="https://datapod.igrant.io/">https://datapod.igrant.io/</option>
                  <option value="https://solid.redpencil.io/">https://solid.redpencil.io/</option>
                  <option value="https://login.inrupt.com/">https://login.inrupt.com/</option>
                </Form.Select>
                <br />
                <Form.Control
                  type="text"
                  placeholder={loginLocalization.placeholder[language]}
                  value={currentProvider}
                  name="id"
                  style={{ maxWidth: '600px' }}
                  onChange={(e) => { setCurrentProvider(e.target.value) }}
                />
                <br />
                <Button onClick={() => { login({ oidcIssuer: currentProvider }) }} variant="secondary">
                  {loginLocalization.login[language]}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
