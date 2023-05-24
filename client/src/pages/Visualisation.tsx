import React, { useEffect, useState, useRef, useContext } from "react";
import { IProps } from "../models/types/types";
import Sidenav, { SideNavType } from "../components/Sidenav";
import Canvas from "../visualisation/Canvas";
import { Node } from "../models/types/Node";
import Button from 'react-bootstrap/Button';
import { SessionContext } from "../sessionContext";
import { MindMapDataset } from "../models/types/MindMapDataset";
import { useNavigate, useLocation } from "react-router-dom";
import { getMindMap } from "../service/mindMapService";
import { getDefaultSession, fetch, login } from "@inrupt/solid-client-authn-browser";
import {
  WebsocketNotification,
} from "@inrupt/solid-client-notifications";
import { generate_uuidv4 } from "../service/utils";
import { AddCoords, getIdsMapping } from "../visualisation/utils";

const defaultBlankDataset: MindMapDataset = {
  id: "",
  title: "",
  url: "",
  created: "",
  acccessType: "",
  links: [],
  nodes: []
}

const Visualisation: React.FC = () => {
  const d3Container = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const countRef = useRef(0);

  const ref = useRef(null);
  const [height, setHeight] = useState(4000);
  const [width, setWidth] = useState(4000);
  const [dataset, setDataset] = useState<MindMapDataset>(defaultBlankDataset);
  const theme = useContext(SessionContext)
  const [mounted, setMounted] = useState(false); // <-- new state variable

  useEffect(() => {
    setMounted(true); // set the mounted state variable to true after the component mounts
  }, []);

  useEffect(
    () => {
      if (mounted) {
        if (location.state !== null && location.state.id !== null) {
          const websocket4 = new WebsocketNotification(
            location.state.id,
            { fetch: fetch }
          );
          websocket4.on("message", (e: any) => {
            getMindMap(location.state.id).then((res: any) => {
              const myr = res as MindMapDataset;
              myr.links = AddCoords(myr.links, getIdsMapping(myr.nodes))
              console.log(myr)
              setDataset(() => (myr))
            })
          });
          websocket4.connect();
          console.log(location.state)
          getMindMap(location.state.id).then((res: any) => {
            const myr = res as MindMapDataset;
            myr.links = AddCoords(myr.links, getIdsMapping(myr.nodes))
            console.log(myr)
            setDataset(() => (myr))
          })
      } else {
          navigate('/')
        }
      }
    }, [mounted])

    const setPosition = (x: number, y: number, id: string) => {
      dataset.nodes = dataset.nodes.map((todo) => {
        if (todo.id === id) {
          return { ...todo, cx: x, cy: y };
        }
        return todo;
      });
      // dataset.links = dataset.links.map((todo) => {
      //   if (todo.from === id) {
      //     return { ...todo, source: [x, y] };
      //   }
      //   if (todo.to === id) {
      //     return { ...todo, target: [x, y] };
      //   }
      //   return todo;
      // });
    }
  return (
    <div className="App">
      <Sidenav type={SideNavType.CANVAS} />
      <main ref={ref}>
        <Canvas data={dataset} height={height} width={width} setPosition={setPosition}></Canvas>
      </main>
    </div>
  )

};

export default Visualisation;
