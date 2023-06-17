import { login, handleIncomingRedirect, getDefaultSession, fetch } from "@inrupt/solid-client-authn-browser";

import {
    addUrl,
    getThing,
    getSolidDataset,
    addStringNoLocale,
    buildThing,
    getPodOwner,
    createSolidDataset,
    createThing,
    setThing,
    getFile, getProfileAll,
    deleteFile,
    setUrl,
    getThingAll,
    getSolidDatasetWithAcl,
    createContainerAt,
    getResourceInfo,
    getStringNoLocale,
    getUrlAll,
    getUrl, getContainedResourceUrlAll,
    getAgentAccessAll,
    saveFileInContainer, getSourceUrl,
    universalAccess,
    Thing,
    getLinkedResourceUrlAll,
    saveSolidDatasetAt,
} from "@inrupt/solid-client";
import {
    AccessGrant,
    approveAccessRequest,
    denyAccessRequest
}
    from "@inrupt/solid-client-access-grants"
import { SCHEMA_INRUPT, RDF } from "@inrupt/vocab-common-rdf";
import { Node } from "../models/types/Node";
import { MindMapLDO } from "../models/things/MindMapLDO";
import examDefinition from "../definitions/examDefinition.json"
import profileDefinition from "../definitions/profile.json"
import messageDefinition from "../definitions/messageDefinition.json"
import nodeDefinition from "../definitions/node.json"
import linkDefinition from "../definitions/link.json"
import mindMapDefinition from "../definitions/mindMapMetaData.json"
import classDefinition from "../definitions/class.json"
import datasetLinkDefinition from "../definitions/datasetLink.json"
import { MindMapDataset } from "../models/types/MindMapDataset";
import { LDO } from "../models/LDO";
import { NodeLDO } from "../models/things/NodeLDO";
import { Connection } from "../models/types/Connection";
import { LinkLDO } from "../models/things/LinkLDO";
import { MindMap } from "../models/types/MindMap";
import { getPodUrl } from "./containerService";
import { generate_uuidv4 } from "./utils";
import { Class as TeachClass } from "../models/types/Class";
import { ClassLDO } from "../models/things/ClassLDO";
import { getProfile } from "./profileService";
import { Link } from "../models/types/Link";
import { DatasetLinkLDO } from "../models/things/DatasetLinkLDO";
import { LinkType } from "../models/types/LinkType";
import { AccessRequest, issueAccessRequest, redirectToAccessManagementUi } from "@inrupt/solid-client-access-grants";
import { UserSession } from "../models/types/UserSession";
import { ClassDataset } from "../models/types/ClassDataset";
import { Exam } from "../models/types/Exam";
import { Profile } from "../models/types/Profile";
import { ExamLDO } from "../models/things/ExamLDO";
import { ProfileLDO } from "../models/things/ProfileLDO";
import { Request } from "../models/types/Request";
import { MessageLDO } from "../models/things/MessageLDO";
import { Message } from "../models/types/Message";

export async function getProfiles(userSession: UserSession) {

    let datasetLinkBuilder = new DatasetLinkLDO(datasetLinkDefinition)
    let profiles: Profile[] = []

    let msgDataset = await getSolidDataset(
        userSession.podUrl + "Wikie/messages/contacts.ttl",
        { fetch: fetch }
    );

    const things = await getThingAll(msgDataset);

    await Promise.all(things.map(async (thing) => {
        const types = getUrlAll(thing, RDF.type);
        if (types.some(type => type === datasetLinkDefinition.identity.subject)) {
            const newLink = datasetLinkBuilder.read(thing)
            profiles.push({
                webId: newLink.url,
                name: '',
                surname: ''
            })

            // if (newLink.linkType === LinkType.PROFILE_LINK) {
            //     const pupilProfiles = await getProfileAll(newLink.url, { fetch });

                // let myExtendedProfile = pupilProfiles.altProfileAll[0];

                // const podUrls = await getPodUrl(newLink.url)
                // if (podUrls !== null) {
                //     const podUrl = podUrls[0]
                //     let bb = getThing(myExtendedProfile, podUrl + "profile#Wikie");
                //     let profileBuilder = new ProfileLDO((profileDefinition as LDO<Profile>))
                //     let userProfile = profileBuilder.read(bb)
                //     console.log(userProfile)
                //     profiles.push(userProfile)
                // }
            // }
        }
    }))

    console.log(profiles)





    // const newProfileLink = new DatasetLinkLDO(datasetLinkDefinition).read()


    // let minMapBuilder = new MindMapLDO(mindMapDefinition)
    // let mindMap: MindMap | null = null;
    // let nodes: Node[] = []
    // let nodeBuilder = new NodeLDO(nodeDefinition)
    // let links: Link[] = []
    // let linkBuilder = new LinkLDO(linkDefinition)

    return profiles
}

export async function getFriendMessages(userSession: UserSession, userId: string) {
    try {
        const dataset = await getSolidDataset(userSession.podUrl + "Wikie/messages/" + encodeURIComponent(userId) + ".ttl")
        const things = await getThingAll(dataset);

        let messageBuilder = new MessageLDO(messageDefinition)
        let messages: Message[] = [];

        things.forEach(thing => {
            const types = getUrlAll(thing, RDF.type);
            console.log(types)
            if (types.some(type => type === mindMapDefinition.identity.subject)) {
                console.log(thing)
                const message = messageBuilder.read(thing)
                messages.push(message)
            }
        })

        return messages;

    } catch (e) {
        const podUrls = await getPodUrl(userId)
        if (podUrls !== null) {
            const dataUrl = podUrls[0] + "Wikie/classes/requests/"
            try {
                const dataset = await getSolidDataset(podUrls[0] + "Wikie/messages/" + encodeURIComponent(userSession.webId) + ".ttl",
                    { fetch: fetch })
                const things = await getThingAll(dataset);

                let messageBuilder = new MessageLDO(messageDefinition)
                let messages: Message[] = [];

                things.forEach(thing => {
                    const types = getUrlAll(thing, RDF.type);
                    console.log(types)
                    if (types.some(type => type === mindMapDefinition.identity.subject)) {
                        console.log(thing)
                        const message = messageBuilder.read(thing)
                        messages.push(message)
                    }
                })

                return messages;

            } catch (e) {
                let messages: Message[] = [];
                return messages;
            }
        }
    }
}

