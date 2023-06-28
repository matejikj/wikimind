import { LDO } from "../LDO";

export class BaseLDO<T> {
    
    protected rdf: LDO<T>;

    constructor(rdf: LDO<T>) {
        this.rdf = rdf;
    }
}
