import { fetch } from "@inrupt/solid-client-authn-browser";

import {
    createSolidDataset,
    saveSolidDatasetAt,
    universalAccess
} from "@inrupt/solid-client";



import { Class } from "../models/types/Class";
import { CHATS, CLASSES, MINDMAPS, PROFILE, REQUESTS, SLASH, TTLFILETYPE, WIKIMIND, getPodUrl } from "./containerService";
import { generate_uuidv4 } from "./utils";
// import { getProfile } from "./profileService";
import { AccessControlPolicy } from "../models/types/AccessControlPolicy";
import { Chat } from "../models/types/Chat";
import { ClassDataset } from "../models/types/ClassDataset";
import { Link } from "../models/types/Link";
import { LinkType } from "../models/types/LinkType";
import { Message } from "../models/types/Message";
import { MindMap } from "../models/types/MindMap";
import { Profile } from "../models/types/Profile";
import { Request } from "../models/types/Request";
import { RequestType } from "../models/types/RequestType";
import { UserSession } from "../models/types/UserSession";
import { ChatRepository } from "../repository/chatRepository";
import { ClassRepository } from "../repository/classRepository";
import { ExamRepository } from "../repository/examRepository";
import { LinkRepository } from "../repository/linkRepository";
import { MessageRepository } from "../repository/messageRepository";
import { MindMapRepository } from "../repository/mindMapRepository";
import { ProfileRepository } from "../repository/profileRepository";
import { RequestRepository } from "../repository/requestRepository";
import { initializeAcl } from "./accessService";



export class ClassService {
    private classRepository: ClassRepository;
    private messageRepository: MessageRepository;
    private profileRepository: ProfileRepository;
    private linkRepository: LinkRepository;
    private mindMapRepository: MindMapRepository;
    private requestRepository: RequestRepository;
    private chatRepository: ChatRepository;
    private examRepository: ExamRepository;

    constructor() {
        this.classRepository = new ClassRepository();
        this.profileRepository = new ProfileRepository();
        this.linkRepository = new LinkRepository();
        this.messageRepository = new MessageRepository();
        this.mindMapRepository = new MindMapRepository();
        this.requestRepository = new RequestRepository();
        this.chatRepository = new ChatRepository();
        this.examRepository = new ExamRepository();
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
                const classLinks = await this.linkRepository.getLinksList(classThing.storage)
                const exams = await this.examRepository.getExams(classThing.storage)

                const messages = await this.messageRepository.getMessages(classThing.storage)

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
                    messages: messages,
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
            source: userSession.podUrl,
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

        try {
            const requestUrl = userSession.podUrl + WIKIMIND + SLASH + REQUESTS + SLASH + REQUESTS + TTLFILETYPE

            const res = await this.requestRepository.getRequests(requestUrl)

            if (res) {
                await Promise.all(res.map(async (item) => {
                    if (item.requestType === RequestType.ADD_CLASS) {
                        const classDatasetUrl = userSession.podUrl + WIKIMIND + SLASH + CLASSES + SLASH + CLASSES + TTLFILETYPE

                        const datasetLink: Link = {
                            id: generate_uuidv4(),
                            url: item.subject,
                            linkType: LinkType.CLASS_LINK
                        }
                        await this.linkRepository.createLink(classDatasetUrl, datasetLink)
                    }
                    if (item.requestType === RequestType.ADD_CONTACT) {
                        const requestDatasetUrl = userSession.podUrl + WIKIMIND + SLASH + CHATS + SLASH + CHATS + TTLFILETYPE

                        const datasetLink: Link = {
                            id: generate_uuidv4(),
                            url: item.subject,
                            linkType: LinkType.CHAT_LINK
                        }
                        await this.linkRepository.createLink(requestDatasetUrl, datasetLink)
                    }
                    if (item.requestType === RequestType.REMOVE_CLASS) {
                        const classLinksUrl = `${userSession.podUrl}${WIKIMIND}/${CLASSES}/${CLASSES}${TTLFILETYPE}`;

                        const classLinks = await this.linkRepository.getLinksList(classLinksUrl);
                        const removedClass = classLinks?.find((item) => item.url === item.url)
                        if (removedClass) {
                            await this.linkRepository.removeLink(classLinksUrl, removedClass)

                        }

                    }
                    if (item.requestType !== RequestType.CLASS_REQUEST) {
                        await this.requestRepository.removeRequest(requestUrl, item)
                    }
                }))
                return res.filter((item) => item.requestType === RequestType.CLASS_REQUEST)
            }
        } catch {
            return undefined
        }
    }

    async addMindMap(userSession: UserSession, classThing: Class, name: string) {
        const mindMapStorageUrl = `${userSession.podUrl}${WIKIMIND}/${MINDMAPS}/${generate_uuidv4()}${TTLFILETYPE}`;

        const blankMindMap: MindMap = {
            id: generate_uuidv4(),
            name: name,
            source: userSession.podUrl,
            storage: mindMapStorageUrl,
            created: Date.now().toString(),
        };
        const mindMapUrl = `${userSession.podUrl}${WIKIMIND}/${MINDMAPS}/${blankMindMap.id}${TTLFILETYPE}`;
        const datasetLink: Link = {
            id: generate_uuidv4(),
            url: mindMapUrl,
            linkType: LinkType.GRAPH_LINK
        };
        await this.mindMapRepository.createMindMap(mindMapUrl, blankMindMap)
        this.linkRepository.createLink(classThing.storage, datasetLink)

        let mindMapStorage = createSolidDataset();
        await saveSolidDatasetAt(mindMapStorageUrl, mindMapStorage, { fetch });
        if (userSession.podAccessControlPolicy === AccessControlPolicy.WAC) {
            await initializeAcl(mindMapUrl);
            await initializeAcl(mindMapStorageUrl);
        }
        const classLinks = await this.linkRepository.getLinksList(classThing.storage)
        const profileLinks = classLinks.filter((link) => link.linkType === LinkType.PROFILE_LINK)

        profileLinks.map(async (item) => {
            const profileUrl = `${item.url}${WIKIMIND}/${PROFILE}/${PROFILE}${TTLFILETYPE}`;
            const profile = await this.profileRepository.getProfile(profileUrl);
            if (profile) {

                universalAccess.setAgentAccess(mindMapStorageUrl, profile.webId, {
                    append: true,
                    read: true,
                    write: false,
                },
                    { fetch: fetch }
                )
                universalAccess.setAgentAccess(mindMapUrl, profile.webId, {
                    append: true,
                    read: true,
                    write: false,
                },
                    { fetch: fetch }
                )

            }
        });
        return mindMapUrl;
    }

    async removeClass(userSession: UserSession, classThing: Class) {
        const classUrl = userSession.podUrl + WIKIMIND + SLASH + CLASSES + SLASH + classThing.id + TTLFILETYPE
        const classLinksUrl = `${userSession.podUrl}${WIKIMIND}/${CLASSES}/${CLASSES}${TTLFILETYPE}`;
        const classLinks = await this.linkRepository.getLinksList(classLinksUrl);
        const removedClass = classLinks?.find((item) => item.url === classUrl)

        try {
            if (removedClass) {
                const classLinks = await this.linkRepository.getLinksList(classThing.storage)
                const exams = await this.examRepository.getExams(classThing.storage)
                const profileLinks = classLinks.filter((link) => link.linkType === LinkType.PROFILE_LINK)
                const mindMapLinks = classLinks.filter((link) => link.linkType === LinkType.GRAPH_LINK)
                const profiles: Profile[] = []
                await Promise.all(mindMapLinks.map(async (item) => {
                    const mindMap = await this.mindMapRepository.getMindMap(item.url)
                    if (mindMap) {
                        await this.mindMapRepository.removeMindMap(mindMap.storage)
                        const url = `${userSession.podUrl}${WIKIMIND}/${MINDMAPS}/${mindMap.id}${TTLFILETYPE}`;
                        await this.mindMapRepository.removeMindMap(url)
                    }
                }));
                await this.linkRepository.removeLink(classLinksUrl, removedClass)
                profileLinks.map(async (item) => {
                    const profileUrl = `${item.url}${WIKIMIND}/${PROFILE}/${PROFILE}${TTLFILETYPE}`;
                    const profile = await this.profileRepository.getProfile(profileUrl);
                    if (profile) {
                        const grant: Request = {
                            id: generate_uuidv4(),
                            subject: classUrl,
                            requestor: userSession.webId,
                            requestType: RequestType.REMOVE_CLASS
                        }
                        const grantUrl = profile.source + WIKIMIND + SLASH + REQUESTS + SLASH + REQUESTS + TTLFILETYPE
                        this.requestRepository.createRequest(grantUrl, grant)
                    }
                });
                await this.mindMapRepository.removeMindMap(classThing.storage)
                const url = `${userSession.podUrl}${WIKIMIND}/${CLASSES}/${classThing.id}${TTLFILETYPE}`;
                await this.mindMapRepository.removeMindMap(url)

                return true;
            }
            return false;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }

    async requestClass(userSession: UserSession, classUri: string) {
        const paramString = classUri.split('?')[1];
        const webId = classUri.split('?')[0];
        const urlParams = new URLSearchParams(paramString);
        const classId = (urlParams.get("classId"))
        const podUrls = await getPodUrl(webId)
        if (podUrls) {
            const newRequst: Request = {
                id: generate_uuidv4(),
                subject: podUrls[0] + WIKIMIND + SLASH + CLASSES + SLASH + classId + TTLFILETYPE,
                requestType: RequestType.CLASS_REQUEST,
                requestor: userSession.webId
            }
            const requestUrl = podUrls[0] + WIKIMIND + SLASH + REQUESTS + SLASH + REQUESTS + TTLFILETYPE
            const createRequestRes = this.requestRepository.createRequest(requestUrl, newRequst)
            await Promise.all([createRequestRes]);
        }
    }

    async createNewAnnouncement(classThing: Class, message: Message): Promise<boolean> {
        try {
            const mindMapStorageUrl = `${classThing.source}${WIKIMIND}/${MINDMAPS}/${classThing.id}${TTLFILETYPE}`;
            await this.messageRepository.createMessage(classThing.storage, message)
            return true
        } catch (error) {
            return false
        }
    }
    async removeAnnouncement(classThing: Class, message: Message): Promise<boolean> {
        try {
            const mindMapStorageUrl = `${classThing.source}${WIKIMIND}/${MINDMAPS}/${classThing.id}${TTLFILETYPE}`;
            await this.messageRepository.removeMessage(classThing.storage, message)
            return true
        } catch (error) {
            return false
        }
    }

    async allowClassAccess(classRequest: Request, userSession: UserSession): Promise<void> {
        const messageDatasetId = generate_uuidv4();
        const messageDatasetUrl = userSession.podUrl + WIKIMIND + SLASH + CHATS + SLASH + messageDatasetId + TTLFILETYPE;
        const messageStorageUrl = userSession.podUrl + WIKIMIND + SLASH + CHATS + SLASH + generate_uuidv4() + TTLFILETYPE;
        try {
            const podUrls = await getPodUrl(classRequest.requestor);

            if (podUrls !== null) {

                const classThing = await this.classRepository.getClass(classRequest.subject)
                if (classThing) {
                    const datasetLink: Link = {
                        id: generate_uuidv4(),
                        url: podUrls[0],
                        linkType: LinkType.PROFILE_LINK,
                    };
                    const saveLinkForStudent = this.linkRepository.createLink(classThing.storage, datasetLink)

                    const setAgentAccessPromises = [
                        universalAccess.setAgentAccess(classRequest.subject, classRequest.requestor, {
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
                        const grant: Request = {
                            id: generate_uuidv4(),
                            subject: classRequest.subject,
                            requestor: userSession.webId,
                            requestType: RequestType.ADD_CLASS
                        }
                        const grantUrl = podUrls[0] + WIKIMIND + SLASH + REQUESTS + SLASH + REQUESTS + TTLFILETYPE
                        this.requestRepository.createRequest(grantUrl, grant)
                    })();

                    const createChatPromise = (async () => {
                        const classThing: Chat = {
                            id: messageDatasetId,
                            host: userSession.webId,
                            source: userSession.podUrl,
                            accessControlPolicy: userSession.podAccessControlPolicy!,
                            guest: classRequest.requestor,
                            modified: Date.now().toString(),
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
                            userSession.podUrl + WIKIMIND + SLASH + CHATS + SLASH + CHATS + TTLFILETYPE, newChatLink)

                        const contactRequest: Request = {
                            id: generate_uuidv4(),
                            subject: messageDatasetUrl,
                            requestor: userSession.webId,
                            requestType: RequestType.ADD_CONTACT
                        }
                        const grantUrl = podUrls[0] + WIKIMIND + SLASH + REQUESTS + SLASH + REQUESTS + TTLFILETYPE
                        await this.requestRepository.createRequest(grantUrl, contactRequest)

                        // fdsfad
                        // await this.linkRepository.createLink(
                        //     podUrls[0] + WIKIMIND + SLASH + MESSAGES + SLASH + CONTACTS + TTLFILETYPE, newChatLink)

                    })();
                    await Promise.all([...setAgentAccessPromises, saveLinkForStudent, grantRequestPromise, createChatPromise, createChatLinkPromise]);
                }
            }
            await this.requestRepository.removeRequest(
                userSession.podUrl + WIKIMIND + SLASH + REQUESTS + SLASH + REQUESTS + TTLFILETYPE, classRequest)
        }
        catch (error) {
            console.error(error);
            return undefined;
        }

    }

}

