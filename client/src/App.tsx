import React, { useEffect, useState } from "react";
import logo from './logo.svg';
import { useSession } from "@inrupt/solid-ui-react";
import './App.css';
import { Route } from 'react-router-dom';

const App: React.FC = () => {
  const { session } = useSession();
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
