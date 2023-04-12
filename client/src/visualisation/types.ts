export interface Node {
    title: string;
    description: string;
    cx: number;
    cy: number;
    id: string
}

export interface Link {
    from: string;
    to: string;
    title: string;
    source?: Array<any>;
    target?: Array<any>;
}

export interface Coord {
    x: number;
    y: number;
}

export interface IProps {
    nodes: Node[];
    links: Link[];
}

export interface IAction {
    action: any;
    title: string;
}
