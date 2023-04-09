import { LoginButton } from "@inrupt/solid-ui-react";
import './Login.css';
import React, { useEffect, useState, useRef } from "react";
import Sidenav from "../components/Sidenav";
import Canvas from "../components/Canvas";

const authOptions = {
  clientName: "Learnee",
};

const data = {
  "nodes": [
    {
      "title": "Karel IV",
      "description": "kral ceskych zemi",
      "cx": 100,
      "cy": 50,
      "r": 5,
      "id": "id32",
    },
    {
      "title": "dsa",
      "description": "dsa dsa bcv",
      "cx": 200,
      "cy": 100,
      "r": 8,
      "id": "id432",
    },
    {
      "title": "nvbcnbcvnx",
      "description": "nbv aaaaa lkkl",
      "cx": 10,
      "cy": 100,
      "r": 10,
      "id": "id3543",
    }    
  ],
  "links": [
    {
      "from": "id32",
      "to": "id432",
      "title": "mama"      
    }
  ]
}

const VisualisationBrowser: React.FC = () => {

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
