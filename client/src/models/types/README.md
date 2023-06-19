type Class = {
    id: string;
    name: string;
    teacher: string;
    storage: string;
}

type Connection = {
    id: string;
    from: string;
    to: string;
    title: string;
    source?: any;
    target?: any;
    testable: boolean;
}

type Exam = {
    id: string,
    profile: string;
    mindMap: string;
    max: number;
    result: number;
}

type Grant = {
    id: string;
    class: string;
}

enum LinkType {
    GRAPH_LINK = 'GRAPH',
    CLASS_LINK = 'CLASS',
    PROFILE_LINK = 'PROFILE'
}

type Link = {
    id: string;
    url: string;
    linkType: LinkType;
}

type Message = {
    id: string;
    from: string;
    to: string;
    text: string;
    date: string
}

type MindMap = {
    id: string;
    created: string;
}

type Node = {
    id: string;
    title: string;
    uri: string;
    description: string;
    cx: number;
    cy: number;
    visible: boolean;
}

type Profile = {
    webId: string;
    name: string;
    surname: string;
    profileImage: string;
}

type Request = {
    id: string;
    requestor: string;
    class: string;
}