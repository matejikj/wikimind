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
    const [height, setHeight] = useState(1000);
    const [width, setWidth] = useState(1000);
    const [dataset, setDataset] = useState<MindMapDataset>(defaultBlankDataset);
    const theme = useContext(SessionContext)
    const [mounted, setMounted] = useState(false); // <-- new state variable

    return (
        <div className="App">
            <Sidenav props={{ message: "Basic" }} />
            <main ref={ref}>
                
            </main>
        </div>
    )

};

export default Visualisation;
