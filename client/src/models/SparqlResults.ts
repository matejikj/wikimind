export type ResultItem = {
    entity: {
        type: string;
        value: string;
    };
    type: {
        type: string;
        value: string;
    };
    label: {
        type: string;
        "xml:lang": string;
        value: string;
    };
};

export type SparqlResults = {
    head: {
        link: string[];
        vars: string[];
    };
    results: {
        distinct: boolean;
        ordered: boolean;
        bindings: ResultItem[];
    };
};