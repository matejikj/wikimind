import * as d3 from "d3";
import { ResultItem } from "../models/SparqlResults";
import { Connection } from "../models/types/Connection";
import { Node } from "../models/types/Node";
import { generate_uuidv4 } from "./utils";
import { SessionContext } from "../sessionContext";
import { UserSession } from "../models/types/UserSession";
import { createPreparedMindMap } from "./mindMapService";

export type TreeNode = {
    value: ResultItem,
    parent: TreeNode | undefined,
    children: TreeNode[],
    id?: string
}

function isInLinks(links: any, source: string, target: string, type: string): boolean {
    let result = false;
    links.forEach((link: any) => {
        if (link.source === source && link.target === target && link.type === type) {
            result = true
        }
    })
    return result
}

export async function addLink(addedItem: ResultItem, connectionNode: ResultItem, node: TreeNode) {
    
    if (connectionNode === undefined) {
        const isAddedInNode = node.children.find((item) => (item.value.entity.value === addedItem.entity.value && item.value.label.value === addedItem.label.value ))
        if (isAddedInNode === undefined) {
            const newNode: TreeNode = {
                value: addedItem,
                parent: node,
                children: []
            }
            node.children.push(newNode)
        }    
    } else {
        const isConnectionInNodes = node.children.find((item) => (item.value.entity.value === connectionNode.entity.value && item.value.label.value === connectionNode.label.value ))
        if (isConnectionInNodes === undefined) {
            const newNode: TreeNode = {
                value: connectionNode,
                parent: node,
                children: []
            }
            node.children.push(newNode)
            const newChild: TreeNode = {
                value: addedItem,
                parent: newNode,
                children: []
            }
            newNode.children.push(newChild)
            
        } else {
            const newChild: TreeNode = {
                value: addedItem,
                parent: isConnectionInNodes,
                children: []
            }
            isConnectionInNodes.children.push(newChild)
        }

    }
}

export function bfs(root: TreeNode, name: string, sessionContext: UserSession): void {
    const nodes: Node[] = []
    const links: Connection[] = []

    const visNodes: any[] = []
    const visLinks: any[] = []

    const idQueue: TreeNode[] = [root];
  
    while (idQueue.length > 0) {
      const current = idQueue.shift();
      if (current) {
        if (current.id === undefined) {
            current.id = generate_uuidv4()
        }
        visNodes.push(current)
        // Enqueue the children of the current node
        current.children.forEach((child) => {
            if (child.id === undefined) {
                child.id = generate_uuidv4()
            }
            visLinks.push({
                source: current.id,
                target: child.id
            })            
            idQueue.push(child);
        });
      }
    }

    const simulation = d3.forceSimulation(visNodes)
        // @ts-ignore
        .force("link", d3.forceLink(visLinks).id(d => d.id))
        .force("center", d3.forceCenter(1000 / 2, 1000 / 2))
        .force("collide", d3.forceCollide())
        .force("charge", d3.forceManyBody().strength(-1000))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .stop()
        .tick(100)

        visNodes.forEach((item: any) => {
            nodes.push({
                id: item.id,
                title: item.value.label.value,
                uri: item.value.entity.value,
                description: '',
                cx: item.x,
                cy: item.y,
                visible: true
            })
        })

        visLinks.forEach((item: any) => {
            links.push({
                id: generate_uuidv4(),
                title: '',
                from: item.source.id,
                to: item.target.id,
                testable: true
            })
        })
        createPreparedMindMap(nodes, links, name, sessionContext)

    
    console.log("fadss")



}
  


// export async function addLink(addedItem: ResultItem, connectionNode: ResultItem, path: any, nodes: any[], links: any) {
//     console.log(connectionNode)

//     // pridam obsah cele cesty -> az po node ktera ukazuje do me pridavane
//     for (let i = 0; i < path.length - 1; i++) {
//         let from: ResultItem = path[i];
//         let to: ResultItem = path[i + 1]
//         if (!isInLinks(links, from.entity.value, to.entity.value, to.type.value)) {
//             const isPathTargetInNodes = path.find((item: any) => item.entity.value === from.entity.value)
//             if (isPathTargetInNodes === undefined) {
//                 nodes.push(from)
//             }
//             const isPathSourceInNodes = nodes.find((item) => item.entity.value === to.entity.value)
//             if (isPathSourceInNodes === undefined) {
//                 nodes.push(to)
//             }
//             links.push({ source: from.entity.value, target: to.entity.value, type: to.type.value })
//         }
//     }

//     const lastElement = path[path.length - 1];

//     const isTargetInNodes = nodes.find((item) => item.entity.value === addedItem.entity.value)
//     if (isTargetInNodes === undefined) {
//         nodes.push(addedItem)
//     }
//     const isSourceInNodes = nodes.find((item) => item.entity.value === lastElement.entity.value)
//     if (isSourceInNodes === undefined) {
//         nodes.push(lastElement)
//     }

//     if (connectionNode === undefined) {
//         links.push({ source: lastElement.entity.value, target: addedItem.entity.value, type: addedItem.type.value })
//     } else {
//         // pokud pridavana Node je z dbpedie, pak jen spojim a pridam
//         if (connectionNode.type.value === 'CUSTOM') {

//             // mezinode mezi nodes?
//             const isMiddleInNodes = nodes.filter((item) => item.label.value === connectionNode.label.value)
//             if (isMiddleInNodes === undefined) {
//                 // CUSTOM NODE se stejnym nazvem jeste mezi nodes neni => jen pridam a pridam spojeni a htoovo
//                 connectionNode.entity.value = generate_uuidv4()
//                 nodes.push(connectionNode)
//                 links.push({ source: lastElement.entity.value, target: connectionNode.entity.value, type: connectionNode.type.value })
//                 links.push({ source: connectionNode.entity.value, target: addedItem.entity.value, type: connectionNode.type.value })
//             } else {
//                 // JIZ EXSITUJE CUSTOM NODE se stejnym nazvem => Muism zjistit jestli jde ze stejne node nebo je uplne nesouvisejici
                
//                 const isCustomInLinks = links.find((item: any) => item.source === lastElement.entity.value && item.target === isMiddleInNodes.entity.value)
//                 if (isCustomInLinks === undefined) {
//                     //JE NESOUVISEJICI => Pridam jako novou
//                     nodes.push(connectionNode)

//                     links.push({ source: lastElement.entity.value, target: connectionNode.entity.value, type: connectionNode.type.value })
//                     links.push({ source: connectionNode.entity.value, target: addedItem.entity.value, type: connectionNode.type.value })
    
//                 } else {
//                     // JIZ EXISTUJE Z POSELDNI NODY CUSTOM SPOJENI SE STEJNYM NAZVEM TUDIZ SPOJIM jen konec s connection
//                     links.push({ source: connectionNode.entity.value, target: addedItem.entity.value, type: connectionNode.type.value })
//                 }
//             }

//         } else {
//             const isMiddleInNodes = nodes.find((item) => item.entity.value === connectionNode.entity.value)
//             if (isMiddleInNodes === undefined) {
//                 nodes.push(connectionNode)

//                 links.push({ source: lastElement.entity.value, target: connectionNode.entity.value, type: connectionNode.type.value })
//                 links.push({ source: connectionNode.entity.value, target: addedItem.entity.value, type: connectionNode.type.value })

//             } else {
//                 links.push({ source: lastElement.entity.value, target: connectionNode.entity.value, type: connectionNode.type.value })
//                 links.push({ source: connectionNode.entity.value, target: addedItem.entity.value, type: connectionNode.type.value })

//             }
//         }
//     }


// }
