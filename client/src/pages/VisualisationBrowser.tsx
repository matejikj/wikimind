import { LoginButton } from "@inrupt/solid-ui-react";
import './Login.css';
import React, { useEffect, useState } from "react";
import Sidenav from "../components/Sidenav";
import Canvas from "../components/Canvas";

const authOptions = {
  clientName: "Learnee",
};

const data = {
  "data": [
    {
      "title": "Karel IV",
      "description": "kral ceskych zemi",
      "cx": 100,
      "cy": 50,
      "r": 5,
    },
    {
      "title": "dsa",
      "description": "dsa dsa bcv",
      "cx": 200,
      "cy": 100,
      "r": 8,
    },
    {
      "title": "nvbcnbcvnx",
      "description": "nbv aaaaa lkkl",
      "cx": 10,
      "cy": 100,
      "r": 10
    }    
  ]
}

const VisualisationBrowser: React.FC = () => {
  const providerOptions = [
    'https://datapod.igrant.io/',
    'https://inrupt.net'
  ];
  const [draggedData, setDragData] = useState(null);
  const [currentProvider, setCurrentProvider] = useState<string>('');
  return (
    <div className="App">
      <Sidenav props={{message: "Basic"}} />
      <main>
        <Canvas props={data}></Canvas>
      </main>
    </div>

  );
};

export default VisualisationBrowser;
