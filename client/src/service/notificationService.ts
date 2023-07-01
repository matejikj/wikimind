import { fetch } from "@inrupt/solid-client-authn-browser";

import {
    getSolidDataset,
    saveSolidDatasetAt,
    setThing,
} from "@inrupt/solid-client";
import examDefinition from "../definitions/exam.json"
import { UserSession } from "../models/types/UserSession";
import { Exam } from "../models/types/Exam";
import { ExamLDO } from "../models/things/ExamLDO";


// if (location.state !== null && location.state.id !== null) {
//     setUrl(location.state.id)
//     const socket = new WebSocket(wssUrl, ['solid-0.1']);
//     socket.onopen = function () {
//       this.send(`sub ${location.state.id}`);
//     };
//     socket.onmessage = function (msg) {
//       if (msg.data && msg.data.slice(0, 3) === 'pub') {
//         if (msg.data === `pub ${location.state.id}`) {
//           getMindMap(location.state.id).then((res: any) => {
//             const myr = res as MindMapDataset;
//             myr.links = AddCoords(myr.links, getIdsMapping(myr.nodes))
//             console.log(myr)
//             setDataset(() => (myr))
//           })
//         }
//       }
//     };
//     const websocket4 = new WebsocketNotification(
//       location.state.id,
//       { fetch: fetch }
//     );
//     websocket4.on("message", (e: any) => {
//       getMindMap(location.state.id).then((res: any) => {
//         const myr = res as MindMapDataset;
//         myr.links = AddCoords(myr.links, getIdsMapping(myr.nodes))
//         console.log(myr)
//         setDataset(() => (myr))
//       })
//     });
//     websocket4.connect();
//     console.log(location.state)
//   } else {
//     navigate('/')
//   }