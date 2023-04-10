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

const App: React.FC = () => {
  const { session } = useSession();
  
  return (
    true ? (
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
