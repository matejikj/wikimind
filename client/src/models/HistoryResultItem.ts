/**
 * Represents an item in a search result.
 */
export type HistoryResultItem = {
    entity: {
        type: string;
        value: string;
    };
    label: {
        type: string;
        "xml:lang": string;
        value: string;
    };
    propertyLabel: {
        type: string;
        "xml:lang": string;
        value: string;
    };
    value: {
        type: string;
        datatype: string;
        value: string;
    };
    abstract: {
        type: string;
        "xml:lang": string;
        value: string;
    };
}
