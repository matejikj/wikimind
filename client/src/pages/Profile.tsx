import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from "react";
import Sidenav from "../components/Sidenav";
import { getMindMapList } from "../service/containerService";
import Button from 'react-bootstrap/Button';
import { generate_uuidv4 } from "../service/utils";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import './Login.css';
import { createNewMindMap } from '../service/mindMapService';
import { SessionContext } from '../sessionContext';
import { getProfile } from '../service/profileService';

const authOptions = {
  clientName: "Learnee",
};

const Profile: React.FC = () => {

  const [profile, setProfile] = useState();

  const theme = useContext(SessionContext)


  useEffect(() => {
    const result = getProfile(theme.userData?.session).then((res) => {
      // setProfile(res)
    });

  }, []);

  return (
    <div className="App">
      <Sidenav props={{ message: "Basic" }} />
      <main>
        
      </main>
    </div>

  );
};

export default Profile;
