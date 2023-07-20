import { fetch } from "@inrupt/solid-client-authn-browser";

import {
    createSolidDataset,
    saveSolidDatasetAt,
    universalAccess
} from "@inrupt/solid-client";



import { Class } from "../models/types/Class";
import { CHATS, CLASSES, MINDMAPS, PROFILE, REQUESTS, SLASH, TTLFILETYPE, WIKIMIND } from "./containerService";
import { generate_uuidv4 } from "./utils";
// import { getProfile } from "./profileService";
import { UserSession } from "../models/UserSession";
import { AccessControlPolicy } from "../models/enums/AccessControlPolicy";
import { LinkType } from "../models/enums/LinkType";
import { RequestType } from "../models/enums/RequestType";
import { Chat } from "../models/types/Chat";
import { ClassDataset } from "../models/types/ClassDataset";
import { Exam } from "../models/types/Exam";
import { Link } from "../models/types/Link";
import { Message } from "../models/types/Message";
import { MindMap } from "../models/types/MindMap";
import { Profile } from "../models/types/Profile";
import { Request } from "../models/types/Request";
import { ChatRepository } from "../repository/chatRepository";
import { ClassRepository } from "../repository/classRepository";
import { ExamRepository } from "../repository/examRepository";
import { LinkRepository } from "../repository/linkRepository";
import { MessageRepository } from "../repository/messageRepository";
import { MindMapRepository } from "../repository/mindMapRepository";
import { ProfileRepository } from "../repository/profileRepository";
import { RequestRepository } from "../repository/requestRepository";
import { getPodUrl, initializeAcl } from "./accessService";



/**
 * ClassService class provides methods for interacting with classes and related data.
 */
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

    /**
     * Retrieves the list of classes associated with a Pod.
     * @param podUrl - The URL of the Pod.
     * @returns A Promise that resolves to an array of Class objects.
     */
    async getClassList(podUrl: string): Promise<Class[]> {
        const classList: Class[] = []

        try {
            const classLinksUrl = `${podUrl}${WIKIMIND}/${CLASSES}/${CLASSES}${TTLFILETYPE}`;
            const classLinks = await this.linkRepository.getLinksList(classLinksUrl);
            await Promise.all(classLinks.map(async (link) => {
                try {
                    const newClass = await this.classRepository.getClass(link.url)
                    newClass && classList.push(newClass)
                } catch (error) {
                    console.debug('Problem when getting class: ', error)
                }
            }));
        } finally {
            return classList;
        }
    }

    /**
     * Retrieves the details of a specific class.
     * @param classUrl - The URL of the class.
     * @returns A Promise that resolves to the ClassDataset object if found, otherwise undefined.
     */
    async getClass(classUrl: string): Promise<ClassDataset | undefined> {
        try {
            const classThing = await this.classRepository.getClass(classUrl);
            if (!classThing) return undefined;

            const classLinks = await this.linkRepository.getLinksList(classThing.storage);
            const profileLinks = classLinks.filter((link) => link.linkType === LinkType.PROFILE_LINK);
            const mindMapLinks = classLinks.filter((link) => link.linkType === LinkType.GRAPH_LINK);

            const profilePromises: Promise<Profile | undefined>[] = profileLinks.map(async (item) => {
                const profileUrl = `${item.url}${WIKIMIND}/${PROFILE}/${PROFILE}${TTLFILETYPE}`;
                try {
                    return await this.profileRepository.getProfile(profileUrl);
                } catch (error) {
                    console.debug('Problem when getting class: ', error)
                    // console.error(error);
                    const profile: Profile = {
                        webId: item.url,
                        source: item.url,
                        name: '',
                        surname: ''
                    }
                    return profile
                }
            });

            const mindMapPromises: Promise<MindMap | undefined>[] = mindMapLinks.map(async (item) => {
                try {
                    return await this.mindMapRepository.getMindMap(item.url);
                } catch (error) {
                    console.error(error);
                    return undefined;
                }
            });

            const [profiles, mindMaps, exams, messages] = await Promise.allSettled([
                Promise.all(profilePromises),
                Promise.all(mindMapPromises),
                this.examRepository.getExams(classThing.storage),
                this.messageRepository.getMessages(classThing.storage),
            ]);

            const resolvedProfiles = (profiles.status === 'fulfilled' ? profiles.value : []) as Profile[];
            const resolvedMindMaps = (mindMaps.status === 'fulfilled' ? mindMaps.value : []) as MindMap[];

            return {
                testResults: exams.status === 'fulfilled' ? exams.value : [],
                messages: messages.status === 'fulfilled' ? messages.value : [],
                class: classThing,
                students: resolvedProfiles,
                mindMaps: resolvedMindMaps,
            };
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    /**
     * Creates a new class and saves it to the Pod.
     * @param name - The name of the new class.
     * @param userSession - The UserSession object representing the current user's session.
     * @returns A Promise that resolves to the URL of the newly created class.
     */
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

    /**
     * Retrieves the list of class requests from the Pod.
     * @param userSession - The UserSession object representing the current user's session.
     * @returns A Promise that resolves to an array of Request objects.
     */
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

        universalAccess.setPublicAccess(mindMapStorageUrl, {
            append: true,
            read: true,
            write: false,
        },
            { fetch: fetch }
        )
        universalAccess.setPublicAccess(mindMapUrl, {
            append: true,
            read: true,
            write: false,
        },
            { fetch: fetch }
        )

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
                        await this.mindMapRepository.removeMindMapDataset(mindMap.storage)
                        const url = `${userSession.podUrl}${WIKIMIND}/${MINDMAPS}/${mindMap.id}${TTLFILETYPE}`;
                        await this.mindMapRepository.removeMindMapDataset(url)
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
                await this.mindMapRepository.removeMindMapDataset(classThing.storage)
                const url = `${userSession.podUrl}${WIKIMIND}/${CLASSES}/${classThing.id}${TTLFILETYPE}`;
                await this.mindMapRepository.removeMindMapDataset(url)

                return true;
            }
            return false;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     * Sends a request to join a class.
     * @param userSession - The UserSession object representing the current user's session.
     * @param classUri - The URL of the class to join.
     */
    async requestClass(userSession: UserSession, classUri: string) {
        const paramString = classUri.split('?')[1];
        const webId = classUri.split('?')[0];
        const urlParams = new URLSearchParams(paramString);
        const classId = (urlParams.get("classId"))
        const podUrl = await getPodUrl(webId);
        if (podUrl) {
            const newRequst: Request = {
                id: generate_uuidv4(),
                subject: podUrl + WIKIMIND + SLASH + CLASSES + SLASH + classId + TTLFILETYPE,
                requestType: RequestType.CLASS_REQUEST,
                requestor: userSession.webId
            }
            const requestUrl = podUrl + WIKIMIND + SLASH + REQUESTS + SLASH + REQUESTS + TTLFILETYPE
            const createRequestRes = this.requestRepository.createRequest(requestUrl, newRequst)
            await Promise.all([createRequestRes]);
        }
    }

    /**
     * Creates a new announcement for a class.
     * @param classThing - The Class object representing the class to add the announcement to.
     * @param message - The Message object representing the announcement.
     * @returns A Promise that resolves to true if the announcement is created successfully, otherwise false.
     */
    async createNewAnnouncement(classThing: Class, message: Message): Promise<boolean> {
        try {
            await this.messageRepository.createMessage(classThing.storage, message)
            return true
        } catch (error) {
            return false
        }
    }

    /**
     * Removes an announcement from a class.
     * @param classThing - The Class object representing the class to remove the announcement from.
     * @param message - The Message object representing the announcement to be removed.
     * @returns A Promise that resolves to true if the announcement is removed successfully, otherwise false.
     */
    async removeAnnouncement(classThing: Class, message: Message): Promise<boolean> {
        try {
            const mindMapStorageUrl = `${classThing.source}${WIKIMIND}/${MINDMAPS}/${classThing.id}${TTLFILETYPE}`;
            await this.messageRepository.removeMessage(classThing.storage, message)
            return true
        } catch (error) {
            return false
        }
    }

    /**
     * Denies a class request.
     * @param classRequest - The Request object representing the class request to be denied.
     * @param userSession - The UserSession object representing the current user's session.
     * @returns A Promise that resolves to void.
     */
    async denyClassRequest(classRequest: Request, userSession: UserSession): Promise<void> {
        try {
            const requestsUrl = `${userSession.podUrl}${WIKIMIND}/${REQUESTS}/${REQUESTS}${TTLFILETYPE}`;
            await this.requestRepository.removeRequest(requestsUrl, classRequest)
        } catch (error) {
            return undefined
        }
    }

    /**
     * Allows access to a class for a specific user.
     * @param classRequest - The Request object representing the class request to be allowed.
     * @param userSession - The UserSession object representing the current user's session.
     * @returns A Promise that resolves to void.
     */
    async allowClassAccess(classRequest: Request, userSession: UserSession): Promise<void> {
        const chatLinksUrl = `${userSession.podUrl}${WIKIMIND}/${CHATS}/${CHATS}${TTLFILETYPE}`;
        const chatLinks = await this.linkRepository.getLinksList(chatLinksUrl);

        const chats: Chat[] = []
        const promiseList = (chatLinks.map(async (link) => {
            const chat = await this.chatRepository.getChat(link.url)
            chat && chats.push(chat)
        }));

        const messageDatasetId = generate_uuidv4();
        const messageDatasetUrl = userSession.podUrl + WIKIMIND + SLASH + CHATS + SLASH + messageDatasetId + TTLFILETYPE;
        const messageStorageUrl = userSession.podUrl + WIKIMIND + SLASH + CHATS + SLASH + generate_uuidv4() + TTLFILETYPE;
        try {

            const podUrl = await getPodUrl(classRequest.requestor);
            if (podUrl) {

                const classThing = await this.classRepository.getClass(classRequest.subject)
                if (classThing) {
                    const datasetLink: Link = {
                        id: generate_uuidv4(),
                        url: podUrl,
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
                        const grantUrl = podUrl + WIKIMIND + SLASH + REQUESTS + SLASH + REQUESTS + TTLFILETYPE
                        this.requestRepository.createRequest(grantUrl, grant)
                    })();

                    const createChatPromise = (async () => {

                        await Promise.all(promiseList)
                        const existingChat = chats.find((item) => (item.guest === classRequest.requestor ||
                            item.host === classRequest.requestor))

                        if (existingChat == undefined) {
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
                                write: true
                            },
                                { fetch: fetch }
                            )
                            universalAccess.setAgentAccess(messageStorageUrl, classRequest.requestor, {
                                append: true,
                                read: true,
                                write: true
                            },
                                { fetch: fetch }
                            )
                        }
                    })();
                    const createChatLinkPromise = (async () => {
                        await Promise.all(promiseList)
                        const existingChat = chats.find((item) => (item.guest === classRequest.requestor ||
                            item.host === classRequest.requestor))

                        if (existingChat == undefined) {
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
                            const grantUrl = podUrl + WIKIMIND + SLASH + REQUESTS + SLASH + REQUESTS + TTLFILETYPE
                            await this.requestRepository.createRequest(grantUrl, contactRequest)

                        }
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

    /**
     * Removes an exam from a class.
     * @param exam - The Exam object representing the exam to be removed.
     * @param classThing - The Class object representing the class from which the exam will be removed.
     * @returns A Promise that resolves to true if the exam is removed successfully, otherwise false.
     */
    async removeExam(exam: Exam, classThing: Class): Promise<boolean> {
        try {
            await this.examRepository.removeExam(classThing.storage, exam)
            return true
        } catch (error) {
            return false
        }
    }

    /**
     * Removes a mind map from a class.
     * @param mindMap - The MindMap object representing the mind map to be removed.
     * @param classThing - The Class object representing the class from which the mind map will be removed.
     * @returns A Promise that resolves to true if the mind map is removed successfully, otherwise false.
     */
    async removeClassMindMap(mindMap: MindMap, classThing: Class): Promise<boolean> {
        try {
            const mindMapLinks = await this.linkRepository.getLinksList(classThing.storage);

            await this.mindMapRepository.removeMindMapDataset(mindMap.storage)
            const url = `${mindMap.source}${WIKIMIND}/${MINDMAPS}/${mindMap.id}${TTLFILETYPE}`;
            await this.mindMapRepository.removeMindMapDataset(url)

            const link = mindMapLinks.find((item) => item.url === url)
            if (link) {
                await this.linkRepository.removeLink(classThing.storage, link)
            }
            return true;
        }
        catch (error) {
            return false;
        }
    }

    /**
     * Adds an exam result to a class.
     * @param classUrl - The URL of the class to which the exam result will be added.
     * @param exam - The Exam object representing the exam result to be added.
     * @returns A Promise that resolves to true if the exam result is added successfully, otherwise false.
     */
    async addExamResult(classUrl: string, exam: Exam) {
        try {
            const mindMapStorageUrl = `${classUrl}${WIKIMIND}/${MINDMAPS}/${exam.id}${TTLFILETYPE}`;
            await this.examRepository.createExam(classUrl, exam)
            return true
        } catch (error) {
            return false
        }
    }
}

