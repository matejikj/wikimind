import React, { useEffect, useState, useRef, useContext } from "react";
import { IProps } from "../models/types/types";
import Sidenav from "../components/Sidenav";
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

const defaultBlankDataset: MindMapDataset = {
  title: "",
  url: "",
  created: "",
  acccessType: "",
  id: "",
  links: [],
  nodes: []
}

const Visualisation: React.FC = () => {
  const d3Container = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location)

  const ref = useRef(null);
  const [height, setHeight] = useState(500);
  const [width, setWidth] = useState(500);
  const [dataset, setDataset] = useState<MindMapDataset>(defaultBlankDataset);
  const theme = useContext(SessionContext)
  useEffect(
    () => {
      const fetchData = async () => {
        if (!getDefaultSession().info.isLoggedIn) {
          await login({
            oidcIssuer: "https://login.inrupt.com/",
            redirectUrl: window.location.href,
            clientName: "My application"
          });
        } else {
          console.log('PRIHLASENO')
        }
      }
      fetchData()
        // make sure to catch any error
        .catch(console.error);

      const websocket4 = new WebsocketNotification(
        'https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/mindMaps/',
        { fetch: fetch }
      );
      websocket4.on("message", (e: any) => {
        console.log(e)
      });
      websocket4.connect();
      // const websocket3 = new WebsocketNotification(
      //   'https://storage.inrupt.com/46ada2e2-e4d0-4f63-85cc-5dbc467a527a/Wikie/mindMaps/mindMap2.ttl',
      //   { fetch: fetch }
      // );
      // websocket3.on("message", () => {
      //   console.log("vadvdavadvavddsvds")
      // });
      // websocket3.connect();
      if (location.state !== null && location.state.isNew !== null && location.state.id !== null) {
        if (location.state.isNew == false) {
          console.log(location.state)
          getMindMap(location.state.id).then((res: any) => {
            const myResult = res as MindMapDataset
            // setDataset(myResult)
            console.log(myResult)
          })
        }

      } else {
        navigate("/")
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
