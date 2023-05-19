import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from "react";
import Sidenav, { SideNavType } from "../components/Sidenav";
import { getMindMapList } from "../service/containerService";
import Button from 'react-bootstrap/Button';
import { generate_uuidv4 } from "../service/utils";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

import './ProfileView.css';
import { createNewMindMap } from '../service/mindMapService';
import { SessionContext } from '../sessionContext';
import { getProfile } from '../service/profileService';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Profile } from '../models/types/Profile';

const ProfileView: React.FC = () => {

  const [profile, setProfile] = useState<Profile>({
    name: "",
    surname: ""
  });

  const theme = useContext(SessionContext)


  useEffect(() => {
    const result = getProfile(theme.sessionInfo.webId).then((res: any) => {
      if (res !== undefined) { setProfile(res) }

      console.log(res)
    });

  }, []);

  const updateProfile = (e: any) => {

  }
  function handleChange(event: any) {
    const key = event.target.name;
    const value = event.target.value;
    setProfile({ ...profile, [key]: value })
  }
  return (
    <div className="App">
      <Sidenav type={SideNavType.COMMON} />
      <main>
        <Container className='center-container'>
          <Row>
            <Col sm={12}>
              <Card border="success" style={{ width: '18rem' }}>
                <Card.Body>
                  <Card.Title>Profile info:</Card.Title>

                  <Form.Label htmlFor="name">Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="name"
                    name="name"
                    style={{ maxWidth: '500px' }}
                    id="name"
                    value={profile.name}
                    onChange={handleChange}
                  />
                  <br />
                  <Form.Label htmlFor="surname">Surname</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="surname"
                    name="surname"
                    id="surname"
                    style={{ maxWidth: '500px' }}
                    value={profile.surname}
                    onChange={handleChange}
                  />
                </Card.Body>
                <Card.Footer>
                  <Button variant="outline-success" onClick={updateProfile}>Confirm</Button>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
    </div>

  );
};

export default ProfileView;
