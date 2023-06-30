/**
 * Represents a connection between two entities.
 */
export type Connection = {
    /**
     * The unique identifier of the connection.
     */
    id: string;
    
    /**
     * The identifier of the entity where the connection originates from.
     */
    from: string;
    
    /**
     * The identifier of the entity where the connection leads to.
     */
    to: string;
        
    /**
     * The source information related to the connection.
     */
    source?: any;
    
    /**
     * The target information related to the connection.
     */
    target?: any;
}
  