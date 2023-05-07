// export type Link = Entity & {
export type Link = {
    id: string;
    from: string;
    to: string;
    title: string;
    source?: Array<any>;
    target?: Array<any>;
}