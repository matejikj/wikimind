import { Entity } from "./Entity";

export 

I have this typescript types:

type Node = {
    title: string;
    description: string;
    cx: number;
    cy: number;
}

type NodeList = {
    title: string;
    nodes: Node[]
}

let myNodeList: NodeList = {
    title: "AHOJ",
    nodes: [
        {
            title: "ytrdg",
            description: "hfg",
            cx: 5,
            cy: 7,    
        },
        {
            title: "tretr",
            description: "gfdgd",
            cx: 25,
            cy: 72,    
        },
        {
            title: "gfd",
            description: "strgfding",
            cx: 89,
            cy: 7,    
        }
    ]
}

How to save myNodeList in inrupt solid? NodeList is dataset and Node is Thing in dataset