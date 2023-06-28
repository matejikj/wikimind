import { Chat } from "./Chat";
import { Message } from "./Message";

export type ChatDataset = Chat & {
    chat: Chat;
    messages: Message[];
}