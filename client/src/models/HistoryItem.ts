/**
 * Represents an item in a list with a URL and an optional title.
 */

export enum HistoryItemType {
    KEYWORD,
    ITEM
}

export type HistoryItem = {
    /**
     * The URL associated with the list item.
     */
    value: string;

        /**
     * The URL associated with the list item.
     */
        label: string;

    /**
     * The title of the list item, or `null` if not available.
     */
    type: HistoryItemType;
  }
  

  