import { HistoryItemType } from "./HistoryItemType";

/**
 * Represents an item in a list with a URL and an optional title.
 */
export type HistoryItem = {
    /**
     * The URL associated with the list item.
     */
    value: string;
  
    /**
     * The label associated with the list item.
     */
    label: string;
  
    /**
     * The type of the list item, indicating if it represents a keyword or an item.
     */
    type: HistoryItemType;
  }
  