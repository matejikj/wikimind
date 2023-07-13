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
import { WebsocketNotification } from "@inrupt/solid-client-notifications";
import { ChatDataset } from "../models/types/ChatDataset";
import { MessageService } from "./messageService";

const messageService = new MessageService()

export async function assignWebSocketACP(url: string, setMessageDataset: any) {
    const websocket4 = new WebsocketNotification(
        url,
        { fetch: fetch }
    );
    websocket4.on("message", (e: any) => {
        messageService.getChat(url).then((res: ChatDataset | undefined) => {
            if (res) {
                setMessageDataset(res)
            }
        })
    });
    websocket4.connect();
}
