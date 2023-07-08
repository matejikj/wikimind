import { Class } from "./Class";
import { Exam } from "./Exam";
import { MindMap } from "./MindMap";
import { Profile } from "./Profile";

/**
 * Represents a class dataset that includes information about a class and its associated data.
 */
export type ClassDataset = {

  class: Class
  
  /**
   * An array of student profiles belonging to the class.
   */
  students: Profile[];
  
  /**
   * An array of mind maps created for the class.
   */
  mindMaps: MindMap[];
  
  /**
   * An array of exam results for the class.
   */
  testResults: Exam[];
}
