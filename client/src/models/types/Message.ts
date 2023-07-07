/**
 * Represents a message sent between two entities.
 */
export type Message = {
    /**
     * The unique identifier of the message.
     */
    id: string;
    
    /**
     * The identifier of the entity that sent the message.
     */
    from: string;
        
    /**
     * The text content of the message.
     */
    text: string;
    
    /**
     * The date when the message was sent.
     */
    date: number;
  }
  