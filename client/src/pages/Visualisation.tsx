import React, { useEffect, useState, useRef, useContext } from "react";
import { IProps } from "../models/types/types";
import Sidenav from "../components/Sidenav";
import Canvas from "../visualisation/Canvas";
import { Node } from "../models/types/Node";
import Button from 'react-bootstrap/Button';
import { loginAndFetch } from '../service/profile';
import { checkStructure } from "../service/folderStructure";
import { SessionContext } from "../sessionContext";
import { MindMapDataset } from "../models/types/MindMapDataset";
import { useNavigate, useLocation } from "react-router-dom";
import { getMindMap } from "../service/mindMap";

const Visualisation: React.FC = () => {
  const d3Container = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location)

  const ref = useRef(null);
  const [height, setHeight] = useState(500);
  const [width, setWidth] = useState(500);
  const [dataset, setDataset] = useState({
    title: "mindMap_1",
    id: "fdas",
    url: "fdsa",
    acccessType: "fdas",
    created: "fdsa",
    nodes: [
      {
        "title": "Karel IV",
        "description": "kral ceskych zemi",
        "cx": 100,
        "cy": 50,
        "id": "id32",
      },
      {
        "title": "fdsa",
        "description": "kral ceskych zemi",
        "cx": 423,
        "cy": 87,
        "id": "id43",
      },
      {
        "title": "dsa",
        "description": "dsa dsa bcv",
        "cx": 200,
        "cy": 100,
        "id": "id432",
      },
      {
        "title": "nvbcnbcvnx",
        "description": "nbv aaaaa lkkl",
        "cx": 10,
        "cy": 100,
        "id": "id3543",
      }
    ],
    "links": [
      {
        "from": "id32",
        "to": "id432",
        "title": "mama",
        "id": "id3543"
      },
      {
        "from": "id32",
        "to": "id43",
        "title": "mama",
        "id": "id3543"
      }
    ]
  });
  const theme = useContext(SessionContext)
    useEffect(
    () => {
      if (location.state?.id !== null) {
        getMindMap(location.state.id).then((res) => {
          console.log(res)
        })
      }
    }
  )

  // useEffect(
  //   () => {
  //     if (ref.current !== null) {
  //       const containerRect = (ref.current as any).getBoundingClientRect();
  //       const height = containerRect.height;
  //       const width = containerRect.width;
  //       setHeight(containerRect.height)
  //       setWidth(containerRect.width)
  //       console.log(containerRect)
  //     }
  //   }
  // )
  return (
    <div className="App">
      <Sidenav props={{ message: "Basic" }} />
      <main ref={ref}>
        <Canvas data={dataset} height={height} width={width}></Canvas>
      </main>
    </div>
  )

};

export default Visualisation;
