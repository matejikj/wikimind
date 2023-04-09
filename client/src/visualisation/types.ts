export interface Node {
    title: string;
    description: string;
    cx: number;
    cy: number;
    r: number;
    id: string
}

export interface Link {
    from: string;
    to: string;
    title: string;
}

export interface IProps {
    nodes: Node[];
    links: Link[];
}
