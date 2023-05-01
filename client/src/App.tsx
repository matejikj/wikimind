import React, { useEffect, useState } from "react";
import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from "./pages/Dashboard";
import Container from 'react-bootstrap/Container';
import Sidenav from "./components/Sidenav";
import Visualisation from "./pages/Visualisation";
import { handleIncomingRedirect, onSessionRestore } from "@inrupt/solid-client-authn-browser";
import { BrowserRouter } from 'react-router-dom';
import { UserData, defaultSessionValue, SessionContext } from "./sessionContext";

const App: React.FC = () => {

  const [userData, setUserData]
    = React.useState<UserData>(defaultSessionValue);
  const value = {
    userData,
    setUserData
  };

  useEffect(() => {
    handleIncomingRedirect({
      restorePreviousSession: true
    }).then((info) => {
      info?.isLoggedIn && info?.webId !== undefined ? setUserData({
        podUrl: 'fdas',
        isLogged: true,
        session: info?.webId
      }) :
        console.log(info)
    })
  }, []);

  return (
    <SessionContext.Provider value={value}>
      <BrowserRouter>
        {userData.isLogged ? (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/visualisation" element={<Visualisation />} />
          </Routes>
        ) : (
          <Login></Login>
        )}
      </BrowserRouter>
    </SessionContext.Provider>

  );
};

export default App;
