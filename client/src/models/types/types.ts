import { Link } from './Link'
import { Node } from './Node'

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
