/**
 * Represents an item in a search result.
 */
export type ResultItem = {
    /**
     * The entity information of the result item.
     */
    entity: {
      /**
       * The type of the entity.
       */
      type: string;
      
      /**
       * The value of the entity.
       */
      value: string;
    };
    
    /**
     * The type information of the result item.
     */
    type: {
      /**
       * The type of the type.
       */
      type: string;
      
      /**
       * The value of the type.
       */
      value: string;
    };
    
    /**
     * The label information of the result item.
     */
    label: {
      /**
       * The type of the label.
       */
      type: string;
      
      /**
       * The XML language of the label.
       */
      "xml:lang": string;
      
      /**
       * The value of the label.
       */
      value: string;
    };
  };
  