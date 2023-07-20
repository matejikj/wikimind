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
import profileLocalization from "./locales/profile.json";

import '../styles/style.css';

/**
 * ProfilePage.
 */
const ProfilePage: React.FC = () => {
  const sessionContext = useContext(SessionContext);
  const [profile, setProfile] = useState<Profile | undefined>();
  const profileService = new ProfileService();

  /**
   * Fetches the user's profile from the backend API.
   */
  async function fetchProfile(): Promise<void> {
    try {
      const profile = await profileService.getProfile(sessionContext.sessionInfo.podUrl);
      setProfile(profile);
    } catch (error) {
      // Handle the error, e.g., display an error message to the user or perform fallback actions.
    }
  }

  // Fetch the user's profile on component mount.
  useEffect(() => {
    fetchProfile();
  }, []);

  /**
   * Saves the user's profile to the backend API.
   */
  async function profileSaved(): Promise<void> {
    if (profile) {
      profileService.updateProfile(sessionContext.sessionInfo.podUrl, profile);
    }
  }

  /**
   * Handles the change in form input fields and updates the profile state accordingly.
   * @param event - The change event from the input field.
   */
  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const key = event.target.name;
    const value = event.target.value;
    if (key && value !== undefined && profile) {
      setProfile({ ...profile, [key]: value });
    }
  }

  return (
    <div className="App">
      <Sidenav />
      <main>
        <Container className='center-container'>
          <Row>
            <Col sm={12}>
              {
                profile &&
                <Card border="success" style={{ width: '18rem' }}>

                  <Card.Body>
                    <Card.Title>
                      {profileLocalization.profileInfo[sessionContext.sessionInfo.localization]}
                    </Card.Title>
                    <Card.Subtitle>{profile?.webId || ""}</Card.Subtitle>
                    <br />
                    <Form.Label htmlFor="name">{profileLocalization.name[sessionContext.sessionInfo.localization]}</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      style={{ maxWidth: '500px' }}
                      id="name"
                      value={profile?.name}
                      onChange={handleChange}
                    />
                    <br />
                    <Form.Label htmlFor="surname">{profileLocalization.surname[sessionContext.sessionInfo.localization]}</Form.Label>
                    <Form.Control
                      type="text"
                      name="surname"
                      id="surname"
                      style={{ maxWidth: '500px' }}
                      value={profile?.surname}
                      onChange={handleChange}
                    />
                  </Card.Body>
                  <Card.Footer>
                    <Button variant="outline-success" onClick={profileSaved}>{profileLocalization.confirm[sessionContext.sessionInfo.localization]}</Button>
                  </Card.Footer>
                </Card>
              }
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default ProfilePage;
