
export type Class = {
    id: string;
    name: string;
    teacher: string;
    storage: string;
}


export type ClassDataset = Class & {
    pupils: Profile[];
    mindMaps: MindMap[];
    testResults: Exam[];
}

export type ClassRequest = {
    id: string;
    requestor: string;
    class: string;
}


export type ClassRequestGrant = {
    id: string;
    class: string;
}

export type Link = {
    id: string;
    from: string;
    to: string;
    title: string;
    source?: Array<any>;
    target?: Array<any>;
    visible: boolean;
}


export enum AccessControlPolicy {
    WAC,
    ACP
}

export type MindMap = {
    id: string;
    title: string;
    url: string;
    acccessType: string;
    created: string;
}

export type UserSession = {
    webId: string;
    podUrl: string;
    isLogged: boolean;
    podAccessControlPolicy: AccessControlPolicy | null
}

export type DatasetLink = {
    id: string;
    url: string;
    linkType: LinkType;
}

export type Exam = {
    id: string,
    profile: string;
    mindMap: string;
    max: number;
    result: number;
}

export enum LinkType {
    GRAPH_LINK = 'graphLink',
    CLASS_LINK = 'classLink',
    PROFILE_LINK = 'profileLink'
}

export type Message = {
    id: string;
    from: string;
    to: string;
    text: string;
    date: string
}


enum ACCESS_TYPE {
    PUBLIC,
    PRIVATE
}

export type MindMapDataset = MindMap & {
    links: Link[];
    nodes: Node[];
}

export type Node = {
    id: string;
    title: string;
    description: string;
    cx: number;
    cy: number;
    visible: boolean;
}

export type Profile = {
    webId: string;
    name: string;
    surname: string;
}