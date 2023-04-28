import { RDFPropertyType } from "../RDFPropertyType";
import { Node } from "../types/Node";
import { BaseLDO } from "./BaseLDO";
import { CRUDLDO } from "./CRUDLDO";

export class NodeLDO extends BaseLDO<Node> implements CRUDLDO<Node> {
    create(url: string, thing: Node) {
        this.rdf.properties.title.value;
    };
}
