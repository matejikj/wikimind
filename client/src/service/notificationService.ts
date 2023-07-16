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
import { Chat } from "../models/types/Chat";
import { CHATS, SLASH, TTLFILETYPE, WIKIMIND } from "./containerService";
import { AccessControlPolicy } from "../models/types/AccessControlPolicy";

const messageService = new MessageService()

export async function wacChatWebSocket(chat: Chat, setMessageDataset: any) {
    if (chat.accessControlPolicy === AccessControlPolicy.WAC) {
        const wssUrl = new URL(chat.source);
        wssUrl.protocol = 'wss';


        const socket = new WebSocket(wssUrl, ['solid-0.1']);
        socket.onopen = function () {
            this.send(`sub ${chat.storage}`)
        };
        socket.onmessage = function (msg) {
            if (msg.data && msg.data.slice(0, 3) === 'pub') {
                if (msg.data === `pub ${chat.storage}`) {
                    messageService.getChat(chat.source + WIKIMIND + SLASH + CHATS + SLASH + chat.id + TTLFILETYPE).then((result: ChatDataset | undefined) => {
                        if (result) {
                            setMessageDataset(result)
                        }
                    })
                }
            }
        };

    } else {
        const websocket4 = new WebsocketNotification(
            chat.storage,
            { fetch: fetch }
        );
        websocket4.on("message", (e: any) => {
            messageService.getChat(chat.source + WIKIMIND + SLASH + CHATS + SLASH + chat.id + TTLFILETYPE).then((res: ChatDataset | undefined) => {
                if (res) {
                    setMessageDataset(res)
                }
            })
        });
        websocket4.connect();

    }

}
