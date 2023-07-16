import React, { useContext, useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Sidenav from "../components/Sidenav";

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Profile } from '../models/types/Profile';
import { ProfileService } from "../service/profileService";
import { SessionContext } from '../sessionContext';
import '../styles/style.css';

const ProfileView: React.FC = () => {
  const sessionContext = useContext(SessionContext)

  const [profile, setProfile] = useState<Profile>();

  const profileService = new ProfileService();

  async function fetchProfile(): Promise<void> {
    try {
      const profile = await profileService.getProfile(sessionContext.sessionInfo.podUrl);
      setProfile(profile)
    } catch (error) {
      // Handle the error, e.g., display an error message to the user or perform fallback actions
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  async function profileSaved(): Promise<void> {
    if (profile) {
      profileService.updateProfile(sessionContext.sessionInfo.podUrl, profile)
    }
  }

  function handleChange(event: any): void {
    const key = event.target.name;
    const value = event.target.value;
    key && value && profile && setProfile({ ...profile, [key]: value })
  }

  return (
    <div className="App">
      <Sidenav />
      <main>
        <Container className='center-container'>
          {/* <Row>
            <Button onClick={() => aaa()}>fdsfsd</Button>
          </Row> */}
          <Row>
            <Col sm={12}>
              <Card border="success" style={{ width: '18rem' }}>
                <Card.Body>
                  <Card.Title>Profile info:</Card.Title>
                  <Card.Subtitle>{profile?.webId || ""}</Card.Subtitle>
                  <br />
                  <Form.Label htmlFor="name">Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="name"
                    name="name"
                    style={{ maxWidth: '500px' }}
                    id="name"
                    value={profile?.name || ""}
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
                    value={profile?.surname || ""}
                    onChange={handleChange}
                  />
                </Card.Body>
                <Card.Footer>
                  <Button variant="outline-success" onClick={profileSaved}>Confirm</Button>
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
