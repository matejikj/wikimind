export interface Binding {
  p: {
    type: string;
    value: string;
  };
  a?: {
    type: string;
    value: string;
  };
  count?: {
    type: string;
    datatype: string;
    value: string;
  };
}