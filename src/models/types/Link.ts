import { LinkType } from "../enums/LinkType";

/**
 * Represents a hyperlink.
 */
export type Link = {
  /**
   * The unique identifier of the link.
   */
  id: string;

  /**
   * The URL associated with the link.
   */
  url: string;

  /**
   * The type of the link.
   */
  linkType: LinkType;
}
