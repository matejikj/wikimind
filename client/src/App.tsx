import React, { useEffect, useState } from "react";
import logo from './logo.svg';
import { useSession } from "@inrupt/solid-ui-react";
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from "./pages/Dashboard";
import Container from 'react-bootstrap/Container';
import Sidenav from "./components/Sidenav";
import Visualisation from "./pages/Visualisation";
import { handleIncomingRedirect, onSessionRestore } from "@inrupt/solid-client-authn-browser";

const App: React.FC = () => {
  const [sessionRestored, setSessionRestored] = useState(false);

  const { session } = useSession();
  
  useEffect(() => {
    handleIncomingRedirect({
      restorePreviousSession: true
    }).then((info) => {
      console.log(info)
      setSessionRestored(true)
    })
  }, []);

  return (
    sessionRestored || session.info.isLoggedIn ? (
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/visualisation" element={<Visualisation />} />
      </Routes>
    ) : (
      <Login></Login>
    )
  );
};

export default App;
