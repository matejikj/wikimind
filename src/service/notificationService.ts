import { fetch } from "@inrupt/solid-client-authn-browser";

import { WebsocketNotification } from "@inrupt/solid-client-notifications";
import { AccessControlPolicy } from "../models/enums/AccessControlPolicy";
import { Chat } from "../models/types/Chat";
import { ChatDataset } from "../models/types/ChatDataset";
import { CHATS, REQUESTS, SLASH, TTLFILETYPE, WIKIMIND } from "./containerService";
import { MessageService } from "./messageService";
import { UserSession } from "../models/UserSession";

const messageService = new MessageService()

export async function messageNotificationsSubscription(chat: Chat, setMessageDataset: any) {
    if (chat.accessControlPolicy === AccessControlPolicy.WAC) {
        const wssUrl = new URL(chat.storage);
        wssUrl.protocol = 'wss';
        let socket;
        const connectWebSocket = () => {
            socket = new WebSocket(wssUrl, ['solid-0.1']);
            socket.onopen = function () {
                this.send(`sub ${chat.storage}`)
            };
            socket.onclose = function (event) {
                setTimeout(() => {
                    connectWebSocket();
                }, 100);
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
        }
        connectWebSocket()
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
