import { Binding } from "./Binding";

export interface Result {
    head: {
      link: any[];
      vars: string[];
    };
    results: {
      distinct: boolean;
      ordered: boolean;
      bindings: Binding[];
    };
  }