import { LDOIRI } from "./LDOIRI";
import { Connection } from "./types/Connection";
import { Node } from "./types/Node";

export const rdf_type = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"

type LDOProperties<T> = {
    [Property in keyof T]: string;
}

export type LDO<T> = {
    identity: string;
    properties: LDOProperties<T>;
}