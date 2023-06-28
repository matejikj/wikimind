import { ThingLocal } from '@inrupt/solid-client';
  
export interface CRUDLDO<T> {
    create: (object: T) => ThingLocal
    read: (thing: ThingLocal) => T
}