import { LDOIRI } from "./LDOIRI";
import { Link } from "./types/Link";
import { Node } from "./types/Node";

type LDOProperties<T> = {
    [Property in keyof T]: LDOIRI | LDO<Node> | LDO<Link>;
}

type LDOObjectIdType = LDOIRI & {
    subject: string;
}

export type LDO<T> = {
    identity: LDOObjectIdType;
    properties: LDOProperties<T>;
}