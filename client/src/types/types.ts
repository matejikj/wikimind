import Link from './'

export interface Coord {
    x: number;
    y: number;
}

export interface IProps {
    nodes: Node[];
    links: Link[];
    add?: Function;
    save(a: number): void;
}

export interface IAction {
    action: any;
    title: string;
}
