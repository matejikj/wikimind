import React, { useEffect, useState } from "react";
import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from "./pages/Dashboard";
import Container from 'react-bootstrap/Container';
import Sidenav from "./components/Sidenav";
import Visualisation from "./pages/Visualisation";
import { Session, fetch, getDefaultSession, handleIncomingRedirect, onSessionRestore } from "@inrupt/solid-client-authn-browser";
import { BrowserRouter } from 'react-router-dom';
import { checkStructure } from "./service/utils";
import { checkContainer } from "./service/containerService";
import Classes from "./pages/Classes";
import Messages from "./pages/Messages";
import ProfileView from "./pages/ProfileView";
import Class from "./pages/Class";
import { UserSession, defaultSessionValue } from "./models/types/UserSession";
import { SessionContext } from "./sessionContext";
import PrivateChat from "./pages/PrivateChat";
import Exam from "./pages/Exam";
import { AccessControlPolicy } from "./models/types/AccessControlPolicy";
import { createProfile, getProfile } from "./service/profileService";
import { Profile } from "./models/types/Profile";
import Creator from "./pages/Creator";

const App: React.FC = () => {

  const [sessionInfo, setSessionInfo]
    = React.useState<UserSession>(defaultSessionValue);

  useEffect(() => {
    handleIncomingRedirect({
      restorePreviousSession: true
    }).then((info) => {
      if (info?.isLoggedIn && info?.webId !== undefined) {
        try {
          checkContainer(info?.webId).then((value) => {
            console.log({
              isLogged: true,
              webId: info?.webId!,
              podUrl: value.podUrl,
              podAccessControlPolicy: value.accessControlPolicy
            })
            setSessionInfo({
              isLogged: true,
              webId: info?.webId!,
              podUrl: value.podUrl,
              podAccessControlPolicy: value.accessControlPolicy
            })
            console.log(sessionInfo)
            // try {
            //   getProfile(sessionInfo)
            // } catch (error) {
            //   const profile: Profile = {
            //     webId:sessionInfo.webId,
            //     name: "aaa",
            //     surname: "bbb"
            //   }
            //   createProfile(sessionInfo, profile)
            //   console.log(error)
            // }
          })
        } catch (error) {
          alert("There is problem with  logging.")
        }
      }
    })
  }, []);

  return (
    <SessionContext.Provider value={{
      sessionInfo,
      setSessionInfo
    }}>
      <BrowserRouter>
        {sessionInfo.isLogged ? (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/visualisation" element={<Visualisation />} />
            <Route path="/creator" element={<Creator />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/class" element={<Class />} />
            <Route path="/profile" element={<ProfileView />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/chat" element={<PrivateChat />} />
            <Route path="/exam" element={<Exam />} />
          </Routes>
        ) : (
          <Login></Login>
        )}
      </BrowserRouter>
    </SessionContext.Provider>

  );
};

export default App;
