import {
    createSolidDataset,
    deleteSolidDataset,
    getSolidDataset,
    getThing,
    saveSolidDatasetAt,
    setThing
  } from "@inrupt/solid-client";
  import { fetch } from "@inrupt/solid-client-authn-browser";
  import classDefinition from "../definitions/class.json";
  import { ClassLDO } from "../models/things/ClassLDO";
  import { Class } from "../models/types/Class";
  import { getNumberFromUrl } from "./utils";
  
  /**
   * Represents a repository for managing class data using Solid data storage.
   */
  export class ClassRepository {
    private classLDO: ClassLDO;
  
    /**
     * Creates a new instance of the ClassRepository class.
     */
    constructor() {
      this.classLDO = new ClassLDO(classDefinition);
    }
  
    /**
     * Retrieves class data from Solid data storage.
     * @param classUrl - The URL of the class to retrieve.
     * @returns A Promise that resolves to the Class object if found, or undefined if not found.
     */
    async getClass(classUrl: string): Promise<Class | undefined> {
      const classDataset = await getSolidDataset(classUrl, { fetch });
      const thingId = `${classUrl}#${getNumberFromUrl(classUrl)}`;
      return this.classLDO.read(getThing(classDataset, thingId));
    }
  
    /**
     * Creates a new class and saves it to Solid data storage.
     * @param classUrl - The URL where the new class will be saved.
     * @param classObject - The Class object representing the class to be created.
     * @returns A Promise that resolves when the class is successfully created and saved.
     */
    async createClass(classUrl: string, classObject: Class): Promise<void> {
      let classDataset = createSolidDataset();
      classDataset = setThing(classDataset, this.classLDO.create(classObject));
      await saveSolidDatasetAt(classUrl, classDataset, { fetch });
    }
  
    /**
     * Removes a class from Solid data storage.
     * @param classUrl - The URL of the class to be removed.
     * @returns A Promise that resolves when the class is successfully deleted.
     */
    async removeClass(classUrl: string): Promise<void> {
      await deleteSolidDataset(classUrl, { fetch: fetch });
    }
  }
  