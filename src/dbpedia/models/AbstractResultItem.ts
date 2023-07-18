/**
 * Represents an item in a search result.
 */
export type AbstractResultItem = {
    abstract: {
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
  }
