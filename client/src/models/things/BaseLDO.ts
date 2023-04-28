import { LDO } from "../LDO";
import { CRUDLDO } from "./CRUDLDO";

export class BaseLDO<T> {
    
    protected rdf: LDO<T>;

    constructor(rdf: LDO<T>) {
        this.rdf = rdf;
    }

}