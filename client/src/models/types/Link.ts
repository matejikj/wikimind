import { Entity } from "./Entity";

// export type Link = Entity & {
export type Link = {
    from: string;
    to: string;
    title: string;
    source?: Array<any>;
    target?: Array<any>;
}