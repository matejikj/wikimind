/**
 * Represents a mind map.
 */
export type MindMap = {
  /**
   * The unique identifier of the mind map.
   */
  id: string;

  /**
   * The name of the mind map.
   */
  name: string;

  /**
   * The storage location of the mind map data.
   */
  storage: string;

  /**
   * The source from which the mind map data originates.
   */
  source: string;

  /**
   * The creation date of the mind map.
   */
  created: string;
}
