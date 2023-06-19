import { Chat } from "./Chat";
import { Class } from "./Class";
import { Exam } from "./Exam";
import { Message } from "./Message";
import { MindMap } from "./MindMap";
import { Profile } from "./Profile";

export type ChatDataset = Chat & {
    chat: Chat;
    messages: Message[];
}