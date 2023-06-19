// export type Link = Entity & {
export type Connection = {
    id: string;
    from: string;
    to: string;
    title: string;
    source?: any;
    target?: any;
    testable: boolean;
}