import { ResultItem } from "./ResultItem";

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