/**
 * Represents a class or course.
 */
export type Class = {
  /**
   * The unique identifier of the class.
   */
  id: string;

  /**
   * The name or title of the class.
   */
  name: string;

  /**
   * The teacher or instructor of the class.
   */
  teacher: string;

  /**
   * The storage location of the class data.
   */
  storage: string;

  podUrl?: string;
}
