/**
 * Represents an item in a list with a URL and an optional title.
 */
export type ListItem = {
    /**
     * The URL associated with the list item.
     */
    url: string;
    
    /**
     * The title of the list item, or `null` if not available.
     */
    title: string | null;
  }
  