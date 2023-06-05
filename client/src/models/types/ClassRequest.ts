import { Exam } from "./Exam";
import { MindMap } from "./MindMap";
import { Profile } from "./Profile";

export type ClassRequest = {
    id: string;
    requestor: string;
    class: string;
}