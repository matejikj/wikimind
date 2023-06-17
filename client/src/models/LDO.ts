import { LDOIRI } from "./LDOIRI";
import { Connection } from "./types/Connection";
import { Node } from "./types/Node";

type LDOProperties<T> = {
    [Property in keyof T]: LDOIRI | LDO<Node> | LDO<Connection>;
}

type LDOObjectIdType = LDOIRI & {
    subject: string;
}

export type LDO<T> = {
    identity: LDOObjectIdType;
    properties: LDOProperties<T>;
}