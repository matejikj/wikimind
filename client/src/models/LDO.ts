import { LDOId } from "./LDOId";
import { LDOProperty } from "./LDOProperty";

type LDOProperties<T> = {
    [Property in keyof T]: LDOProperty;
}

export type LDO<T> = {
    identity: LDOId;
    properties: LDOProperties<T>;
}