// export type Link = Entity & {
export type Connection = {
    id: string;
    from: string;
    to: string;
    title: string;
    source?: Array<any>;
    target?: Array<any>;
    visible: boolean;
}