import { Thing, ThingLocal } from '@inrupt/solid-client';
import { DCTERMS, RDF } from '@inrupt/vocab-common-rdf';
import { solid, schema, foaf, vcard } from 'rdf-namespaces';
import { LDO } from '../LDO';
  
export interface CRUDLDO<T> {
    create: (object: T) => ThingLocal
    // read: (thing: ThingLocal) => T
}