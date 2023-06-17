import { Connection } from "./Connection";
import { Node } from "./Node";

enum ACCESS_TYPE {
    PUBLIC,
    PRIVATE
}

export type MindMap = {
    id: string;
    title: string;
    url: string;
    acccessType: string;
    created: string;
}