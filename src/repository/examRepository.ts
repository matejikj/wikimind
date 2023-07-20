import {
    createSolidDataset,
    getSolidDataset,
    getThingAll,
    getUrlAll,
    saveSolidDatasetAt,
    setThing,
    getThing,
    removeThing
  } from "@inrupt/solid-client";
  import { fetch } from "@inrupt/solid-client-authn-browser";
  import { RDF } from "@inrupt/vocab-common-rdf";
  import examDefinition from "../definitions/exam.json";
  import { ExamLDO } from "../models/things/ExamLDO";
  import { Exam } from "../models/types/Exam";
  
  /**
   * Represents a repository for managing exam data using Solid data storage.
   */
  export class ExamRepository {
    private examLDO: ExamLDO;
  
    /**
     * Creates a new instance of the ExamRepository class.
     */
    constructor() {
      this.examLDO = new ExamLDO(examDefinition);
    }
  
    /**
     * Creates a new exam and saves it to Solid data storage.
     * @param classUrl - The URL where the new exam will be saved.
     * @param examObject - The Exam object representing the exam to be created.
     * @returns A Promise that resolves when the exam is successfully created and saved.
     */
    async createExam(classUrl: string, examObject: Exam): Promise<void> {
      let classDataset = await getSolidDataset(classUrl, { fetch });
      classDataset = setThing(classDataset, this.examLDO.create(examObject));
      await saveSolidDatasetAt(classUrl, classDataset, { fetch });
    }
  
    /**
     * Retrieves all exams from Solid data storage under the given storage URL.
     * @param storageUrl - The URL of the storage where the exams are located.
     * @returns A Promise that resolves to an array of Exam objects found in the storage.
     */
    async getExams(storageUrl: string): Promise<Exam[]> {
      const classStorageDataset = await getSolidDataset(storageUrl, { fetch });
      const classStorageThings = await getThingAll(classStorageDataset);
      const exams: Exam[] = [];
      classStorageThings.forEach((thing) => {
        const types = getUrlAll(thing, RDF.type);
        if (types.includes(examDefinition.identity)) {
          exams.push(this.examLDO.read(thing));
        }
      });
      return exams;
    }

        /**
     * Remove exam from Solid data storage under the given storage URL.
     * @param storageUrl - The URL of the storage where the exams are located.
     * @param exam - exam.
     * @returns A Promise that resolves to an array of Exam objects found in the storage.
     */
    async removeExam(listUrl: string, exam: Exam): Promise<void> {
      let messageListDataset = await getSolidDataset(listUrl, { fetch });
      const thingId = `${listUrl}#${exam.id}`;
      const thing = getThing(messageListDataset, thingId);
      if (thing) {
        messageListDataset = removeThing(messageListDataset, thing);
        await saveSolidDatasetAt(listUrl, messageListDataset, { fetch });
      }
    }

  }
  