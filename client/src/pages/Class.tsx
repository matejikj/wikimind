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
import { DatasetLink } from "../models/types/DatasetLink";
import { getClassDataset } from "../service/classService";

const Class: React.FC = () => {
  const d3Container = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useContext(SessionContext)

  const ref = useRef(null);
  const [height, setHeight] = useState(1000);
  const [width, setWidth] = useState(1000);

  const [mounted, setMounted] = useState(false); // <-- new state variable

  useEffect(() => {
    setMounted(true); // set the mounted state variable to true after the component mounts
  }, []);

  useEffect(
    () => {
      if (mounted) {
        if (location.state !== null && location.state.url !== null) {
          // const websocket4 = new WebsocketNotification(
          //   location.state.url,
          //   { fetch: fetch }
          // );
          // websocket4.on("message", (e: any) => {
          //   getClassDataset(location.state.url).then((res: any) => {
          //   })
          // });
          // websocket4.connect();
          console.log(location.state)
          if (theme.sessionInfo.isLogged) {
            getClassDataset(theme.sessionInfo, location.state.url).then((res: any) => {
              console.log(res)
            })
          }
          
      } else {
          navigate('/')
        }
      }
    }, [mounted])
    
  return (
    <div className="App">
      <Sidenav type={SideNavType.COMMON} />
      <main ref={ref}>
      </main>
    </div>
  )

};

export default Class;
