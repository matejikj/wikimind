import { Entity } from "./Entity";
import { Link } from "./Link";
import { Node } from "./Node";

enum ACCESS_TYPE {
    PUBLIC,
    PRIVATE
}

export type MindMap = Entity & {
    title: string;
    url: string;
    acccessType: string;
    created: string;
}