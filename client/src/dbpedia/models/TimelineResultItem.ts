/**
 * Represents an item in a search result.
 */
export type TimelineResultItem = {
    entity: {
        type: string; // Type of the entity
        value: string; // Value of the entity
    };
    thumbnail: {
        type: string; // Type of the entity
        value: string; // Value of the entity
    };
    label: {
        type: string; // Type of the label
        "xml:lang": string; // Language of the label
        value: string; // Value of the label
    };
    propertyLabel: {
        type: string; // Type of the property label
        "xml:lang": string; // Language of the property label
        value: string; // Value of the property label
    };
    value: {
        type: string; // Type of the value
        datatype: string; // Data type of the value
        value: string; // Actual value
    };
    abstract: {
        type: string; // Type of the abstract
        "xml:lang": string; // Language of the abstract
        value: string; // Value of the abstract
    };
}
