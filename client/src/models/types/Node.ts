import { Entity } from "./Entity";

export type Node = Entity & {
    title: string;
    description: string;
    cx: number;
    cy: number;
}