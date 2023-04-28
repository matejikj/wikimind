import { Thing } from '@inrupt/solid-client';
import { DCTERMS, RDF } from '@inrupt/vocab-common-rdf';
import { solid, schema, foaf, vcard } from 'rdf-namespaces';
import { LDO } from '../LDO';
  
export interface CRUDLDO<T> {
    create: (url: string, thing: T) => void
}