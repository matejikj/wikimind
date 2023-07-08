import { fetch } from "@inrupt/solid-client-authn-browser";

import {
    createSolidDataset,
    getContainedResourceUrlAll,
    getSolidDataset,
    getThing,
    getThingAll,
    getUrlAll,
    removeThing, saveSolidDatasetAt,
    setThing,
    universalAccess,
} from "@inrupt/solid-client";



import { RDF } from "@inrupt/vocab-common-rdf";
import examDefinition from "../definitions/exam.json"
import chatDefinition from "../definitions/chat.json"
import classRequestDefinition from "../definitions/request.json"
import classRequestGrantDefinition from "../definitions/grant.json"
import profileDefinition from "../definitions/profile.json"
import classDefinition from "../definitions/class.json"
import mindMapDefinition from "../definitions/mindMap.json"
import datasetLinkDefinition from "../definitions/link.json"
import { MindMapDataset } from "../models/types/MindMapDataset";
import { LDO } from "../models/LDO";
import { CLASSES, CONTACTS, MESSAGES, PROFILE, REQUESTS, SLASH, TTLFILETYPE, WIKIMIND, getPodUrl } from "./containerService";
import { generate_uuidv4 } from "./utils";
import { Class } from "../models/types/Class";
import { ClassLDO } from "../models/things/ClassLDO";
// import { getProfile } from "./profileService";
import { Link } from "../models/types/Link";
import { LinkLDO } from "../models/things/LinkLDO";
import { LinkType } from "../models/types/LinkType";
import { UserSession } from "../models/types/UserSession";
import { ClassDataset } from "../models/types/ClassDataset";
import { Exam } from "../models/types/Exam";
import { Profile } from "../models/types/Profile";
import { ExamLDO } from "../models/things/ExamLDO";
import { ProfileLDO } from "../models/things/ProfileLDO";
import { Request } from "../models/types/Request";
import { AccessControlPolicy } from "../models/types/AccessControlPolicy";
import { initializeAcl } from "./accessService";
import { RequestLDO } from "../models/things/RequestLDO";
import { Grant } from "../models/types/Grant";
import { GrantLDO } from "../models/things/GrantLDO";
import { ChatLDO } from "../models/things/ChatLDO";
import { MindMap } from "../models/types/MindMap";
import { MindMapLDO } from "../models/things/MindMapLDO";
import { ProfileRepository } from "../repository/profileRepository";
import { ClassRepository } from "../repository/classRepository";
import { LinkRepository } from "../repository/linksRepository";
import { MindMapRepository } from "../repository/mindMapRepository";
import { RequestRepository } from "../repository/requestRepository";
import { GrantRepository } from "../repository/grantRepository";
import { Chat } from "../models/types/Chat";
import { ChatRepository } from "../repository/chatRepository";



export class ClassService {
    private classRepository: ClassRepository;
    private profileRepository: ProfileRepository;
    private linkRepository: LinkRepository;
    private mindMapRepository: MindMapRepository;
    private requestRepository: RequestRepository;
    private grantRepository: GrantRepository;
    private chatRepository: ChatRepository;

    constructor() {
        this.classRepository = new ClassRepository();
        this.profileRepository = new ProfileRepository();
        this.linkRepository = new LinkRepository();
        this.mindMapRepository = new MindMapRepository();
        this.requestRepository = new RequestRepository();
        this.grantRepository = new GrantRepository();
        this.chatRepository = new ChatRepository();
    }

    async getClassList(podUrl: string): Promise<Class[] | undefined> {
        try {
            const classList: Class[] = []
            const classLinksUrl = `${podUrl}${WIKIMIND}/${CLASSES}/${CLASSES}${TTLFILETYPE}`;
            const classLinks = await this.linkRepository.getLinksList(classLinksUrl);
            await Promise.all(classLinks.map(async (link) => {
                const newClass = await this.classRepository.getClass(link.url)
                newClass && classList.push(newClass)
            }));
            return classList
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    async getClass(classUrl: string): Promise<ClassDataset | undefined> {
        try {
            const classThing = await this.classRepository.getClass(classUrl)
            if (classThing) {
                const classLinks = await this.classRepository.getClassLinks(classThing.storage)
                const exams = await this.classRepository.getExams(classThing.storage)
                const profileLinks = classLinks.filter((link) => link.linkType === LinkType.PROFILE_LINK)
                const mindMapLinks = classLinks.filter((link) => link.linkType === LinkType.GRAPH_LINK)
                const profiles: Profile[] = []
                await Promise.all(profileLinks.map(async (item) => {
                    const profileUrl = `${item.url}${WIKIMIND}/${PROFILE}/${PROFILE}${TTLFILETYPE}`;
                    const result = await this.profileRepository.getProfile(profileUrl);
                    if (result) {
                        profiles.push(result)
                    }
                }));
                const mindMaps: MindMap[] = []
                await Promise.all(mindMapLinks.map(async (item) => {
                    const result = await this.mindMapRepository.getMindMap(item.url);
                    if (result) {
                        mindMaps.push(result)
                    }
                }));
                return {
                    testResults: exams,
                    class: classThing,
                    students: profiles,
                    mindMaps: mindMaps
                };
            }
        }
        catch (error) {
            console.error(error);
            return undefined;
        }
    }

    async createNewClass(name: string, userSession: UserSession): Promise<string | undefined> {
        const classesListUrl = `${userSession.podUrl}${WIKIMIND}/${CLASSES}/${CLASSES}${TTLFILETYPE}`;
        const classStorageUrl = `${userSession.podUrl}${WIKIMIND}/${CLASSES}/${generate_uuidv4()}${TTLFILETYPE}`;

        const blankClass: Class = {
            id: generate_uuidv4(),
            name: name,
            ownerPod: userSession.podUrl,
            storage: classStorageUrl,
            teacher: userSession.webId,
        };
        const classUrl = `${userSession.podUrl}${WIKIMIND}/${CLASSES}/${blankClass.id}${TTLFILETYPE}`;
        const datasetLink: Link = {
            id: generate_uuidv4(),
            url: classUrl,
            linkType: LinkType.CLASS_LINK
        };
        const createLinkPromise = this.linkRepository.createLink(classesListUrl, datasetLink)
        const createClassPromise = this.classRepository.createClass(classUrl, blankClass)
        let mindMapStorage = createSolidDataset();
        await saveSolidDatasetAt(classStorageUrl, mindMapStorage, { fetch });

        if (userSession.podAccessControlPolicy === AccessControlPolicy.WAC) {
            await Promise.all([createLinkPromise, createClassPromise]);
            initializeAcl(classUrl);
            initializeAcl(classStorageUrl);
        }
        return classUrl;
    }

    async getRequests(userSession: UserSession) {
        const res = await this.grantRepository.getGrantsAndRequests(
            userSession.podUrl + WIKIMIND + SLASH + CLASSES + SLASH + REQUESTS + TTLFILETYPE)

        await Promise.all(res.grants.map(async (item) => {
            const datasetLink: Link = {
                id: generate_uuidv4(),
                url: item.class,
                linkType: LinkType.CLASS_LINK
            }
            this.linkRepository.createLink(
                userSession.podUrl + WIKIMIND + SLASH + CLASSES + SLASH + CLASSES + TTLFILETYPE, datasetLink)
            const classLDO = new LinkLDO(datasetLinkDefinition).create(datasetLink)
        }))

        return res.requests
    }

    async requestClass(userSession: UserSession, classUri: string) {
        const paramString = classUri.split('?')[1];
        const webId = classUri.split('?')[0];
        const urlParams = new URLSearchParams(paramString);
        const classId = (urlParams.get("classId"))

        const podUrls = await getPodUrl(webId)

        if (podUrls) {

            const agentAccess = universalAccess.setAgentAccess(
                userSession.podUrl + WIKIMIND + SLASH + MESSAGES + SLASH + CONTACTS + TTLFILETYPE,
                webId,
                { append: true, read: true, write: false },
                { fetch: fetch }
            )

            const newRequst = {
                id: generate_uuidv4(),
                class: podUrls[0] + WIKIMIND + SLASH + CLASSES + SLASH + classId + TTLFILETYPE,
                requestor: userSession.webId
            }
            const requestUrl = podUrls[0] + WIKIMIND + SLASH + CLASSES + SLASH + REQUESTS + TTLFILETYPE

            const createRequestRes = this.requestRepository.createRequest(requestUrl, newRequst)
            await Promise.all([agentAccess, createRequestRes]);

        }
    }

    async allowClassAccess(classRequest: Request, userSession: UserSession): Promise<void> {
        const messageDatasetId = generate_uuidv4();
        const messageDatasetUrl = userSession.podUrl + WIKIMIND + SLASH + MESSAGES + SLASH + messageDatasetId + TTLFILETYPE;
        const messageStorageUrl = userSession.podUrl + WIKIMIND + SLASH + MESSAGES + SLASH + generate_uuidv4() + TTLFILETYPE;

        try {
            const podUrls = await getPodUrl(classRequest.requestor);

            if (podUrls !== null) {
                const classThing = await this.classRepository.getClass(classRequest.class)
                if (classThing) {
                    const datasetLink: Link = {
                        id: generate_uuidv4(),
                        url: podUrls[0],
                        linkType: LinkType.PROFILE_LINK,
                    };
                    const saveLinkForStudent = this.linkRepository.createLink(classThing.storage, datasetLink)

                    const setAgentAccessPromises = [
                        universalAccess.setAgentAccess(classRequest.class, classRequest.requestor, {
                            append: true,
                            read: true,
                            write: false,
                        },
                            { fetch: fetch }
                        ),
                        universalAccess.setAgentAccess(classThing.storage, classRequest.requestor, {
                            append: true,
                            read: true,
                            write: false,
                        },
                            { fetch: fetch }
                        )
                    ];

                    const grantRequestPromise = (async () => {
                        const grant: Grant = {
                            id: generate_uuidv4(),
                            class: classRequest.class,
                        }
                        const grantUrl = podUrls[0] + WIKIMIND + SLASH + CLASSES + SLASH + REQUESTS + TTLFILETYPE
                        this.grantRepository.createGrant(grantUrl, grant)
                    })();

                    const createChatPromise = (async () => {
                        const classThing: Chat = {
                            id: messageDatasetId,
                            host: userSession.webId,
                            ownerPod: userSession.podUrl,
                            guest: classRequest.requestor,
                            modified: '19.6.2023',
                            lastMessage: '',
                            storage: messageStorageUrl,
                        }

                        await this.chatRepository.createChat(messageDatasetUrl, classThing)

                        const chatStorageSolidDataset = createSolidDataset();
                        await saveSolidDatasetAt(messageStorageUrl, chatStorageSolidDataset, { fetch: fetch });

                        if (userSession.podAccessControlPolicy === AccessControlPolicy.WAC) {
                            const initializeAclPromises = [initializeAcl(messageDatasetUrl), initializeAcl(messageStorageUrl)];
                            await Promise.all(initializeAclPromises);
                        }

                        universalAccess.setAgentAccess(messageDatasetUrl, classRequest.requestor, {
                            append: true,
                            read: true,
                            write: false
                        },
                            { fetch: fetch }
                        )
                        universalAccess.setAgentAccess(messageStorageUrl, classRequest.requestor, {
                            append: true,
                            read: true,
                            write: false
                        },
                            { fetch: fetch }
                        )

                    })();

                    const createChatLinkPromise = (async () => {
                        const newChatLink = {
                            id: generate_uuidv4(),
                            linkType: LinkType.CHAT_LINK,
                            url: messageDatasetUrl,
                        }

                        await this.linkRepository.createLink(
                            userSession.podUrl + WIKIMIND + SLASH + MESSAGES + SLASH + CONTACTS + TTLFILETYPE, newChatLink)

                        await this.linkRepository.createLink(
                            podUrls[0] + WIKIMIND + SLASH + MESSAGES + SLASH + CONTACTS + TTLFILETYPE, newChatLink)

                    })();
                    await Promise.all([...setAgentAccessPromises, saveLinkForStudent, grantRequestPromise, createChatPromise, createChatLinkPromise]);
                }
            }
        }
        catch (error) {
            console.error(error);
            return undefined;
        }

    }
}



export async function denyRequest(userSession: UserSession, classRequest: Request) {
    console.log("aa")
}



export async function addGraphToClass(userSession: UserSession, graphUrl: string, classUrl: string) {

    // const clasDataset = await getSolidDataset(classUrl, { fetch });
    // const classThings = await getThingAll(clasDataset);

    // const cclassO = new ClassLDO(classDefinition);
    // let classMeta: Class | null = null;

    // classThings.forEach((thing) => {
    //     const types = getUrlAll(thing, RDF.type);
    //     if (types.includes(classDefinition.identity)) {
    //         classMeta = cclassO.read(thing);
    //     }
    // });

    // if (classMeta !== null) {
    //     classMeta = classMeta as Class;
    //     let classStorageDataset = await getSolidDataset(classMeta.storage, { fetch });

    //     const datasetLink: Link = {
    //         id: generate_uuidv4(),
    //         url: graphUrl,
    //         linkType: LinkType.GRAPH_LINK
    //     }
    //     const classLDO = new LinkLDO(datasetLinkDefinition).create(datasetLink)
    //     classStorageDataset = setThing(classStorageDataset, classLDO)
    //     const savedSolidDatasetContainer = await saveSolidDatasetAt(
    //         classMeta.storage,
    //         classStorageDataset,
    //         { fetch: fetch }
    //     );
    //     universalAccess.setPublicAccess(
    //         graphUrl,         // Resource
    //         { append: true, read: true, write: false },          // Access object
    //         { fetch: fetch }                         // fetch function from authenticated session
    //     ).then((newAccess) => {
    //         console.log("newAccess       contacts.ttl")
    //     });

    // }
}
