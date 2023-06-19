import { Message } from "./Message";

export type Chat = {
    id: string;
    owner: string;
    guest: string;
    storage: string;
    lastMessage: string;
    modified: string;
}