import React, { useEffect, useState } from "react";
import logo from './logo.svg';
import { useSession } from "@inrupt/solid-ui-react";
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import VisualisationBrowser from "./pages/VisualisationBrowser";
import Dashboard from "./pages/Dashboard";
import Container from 'react-bootstrap/Container';
import Sidenav from "./components/Sidenav";

const App: React.FC = () => {
  const { session } = useSession();
  
  return (
    session.info.isLoggedIn ? (
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/visualisation" element={<VisualisationBrowser />} />
      </Routes>
    ) : (
      <Login></Login>
    )
  );
};

export default App;
