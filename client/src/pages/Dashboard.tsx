import { LoginButton } from "@inrupt/solid-ui-react";
import './Login.css';
import React, { useEffect, useState } from "react";
import Sidenav from "../components/Sidenav";

const authOptions = {
  clientName: "Learnee",
};

const Visualisation: React.FC = () => {
  const providerOptions = [
    'https://datapod.igrant.io/',
    'https://inrupt.net'
  ];
  const [currentProvider, setCurrentProvider] = useState<string>('');
  return (
    <div className="App">
      <Sidenav message="Basic"/>
      <main>
        <h1>Dashboard</h1>
        </main>
    </div>
    
  );
};

export default Visualisation;
