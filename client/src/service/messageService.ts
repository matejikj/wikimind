import { fetch } from "@inrupt/solid-client-authn-browser";

import {
    getSolidDataset,
    getThing,
    getThingAll,
    getUrlAll,
} from "@inrupt/solid-client";



import { RDF } from "@inrupt/vocab-common-rdf";
import profileDefinition from "../definitions/profile.json"
import messageDefinition from "../definitions/message.json"
import mindMapDefinition from "../definitions/mindMap.json"
import datasetLinkDefinition from "../definitions/link.json"
import { LDO } from "../models/LDO";
import { getPodUrl } from "./containerService";
import { LinkLDO } from "../models/things/LinkLDO";
import { LinkType } from "../models/types/LinkType";
import { UserSession } from "../models/types/UserSession";
import { Profile } from "../models/types/Profile";
import { ProfileLDO } from "../models/things/ProfileLDO";
import { MessageLDO } from "../models/things/MessageLDO";
import { Message } from "../models/types/Message";
import { ChatLDO } from "../models/things/ChatLDO";
import chatDefinition from "../definitions/chat.json"

export async function getProfiles(userSession: UserSession) {

    const datasetLinkBuilder = new LinkLDO(datasetLinkDefinition)
    const profiles: Profile[] = []

    const msgDataset = await getSolidDataset(
        userSession.podUrl + "Wikie/messages/contacts.ttl",
        { fetch: fetch }
    );

    const things = await getThingAll(msgDataset);

    await Promise.all(things.map(async (thing) => {
        const types = getUrlAll(thing, RDF.type);
        if (types.some(type => type === datasetLinkDefinition.identity)) {
            const newLink = datasetLinkBuilder.read(thing)

            if (newLink.linkType === LinkType.CHAT_LINK) {
                const chatDataset = await getSolidDataset(
                    newLink.url,
                    { fetch: fetch }
                )

                const chatThing = getThing(chatDataset, newLink.url + '#Wikie')

                const newChat = new ChatLDO(chatDefinition).read(chatThing)

                let podUrls = null
                if (newChat.owner === userSession.webId) {
                    podUrls = await getPodUrl(newChat.guest)
                } else {
                    podUrls = await getPodUrl(newChat.owner)
                }

                if (podUrls !== null) {
                    const dataset = await getSolidDataset(
                        podUrls[0] + 'Wikie/profile/profile.ttl',
                        { fetch: fetch }
                    )

                    const bb = getThing(dataset, podUrls[0] + 'Wikie/profile/profile.ttl#Wikie');
                    const profileBuilder = new ProfileLDO((profileDefinition as LDO<Profile>))
                    const userProfile = profileBuilder.read(bb)
                    console.log(userProfile)
                    profiles.push(userProfile)


                }

            }
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
        const datasetUrl = userSession.podUrl + "Wikie/messages/" + encodeURIComponent(userId) + ".ttl"
        const dataset = await getSolidDataset(datasetUrl,)
        const things = await getThingAll(dataset);

        const messageBuilder = new MessageLDO(messageDefinition)
        const messages: Message[] = [];

        things.forEach(thing => {
            const types = getUrlAll(thing, RDF.type);
            console.log(types)
            if (types.some(type => type === mindMapDefinition.identity)) {
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
                const datasetUrl = podUrls[0] + "Wikie/messages/" + encodeURIComponent(userSession.webId) + ".ttl"
                const dataset = await getSolidDataset(
                    datasetUrl,
                    { fetch: fetch }
                )
                const things = await getThingAll(dataset);

                const messageBuilder = new MessageLDO(messageDefinition)
                const messages: Message[] = [];

                things.forEach(thing => {
                    const types = getUrlAll(thing, RDF.type);
                    console.log(types)
                    if (types.some(type => type === mindMapDefinition.identity)) {
                        console.log(thing)
                        const message = messageBuilder.read(thing)
                        messages.push(message)
                    }
                })

                return messages;

            } catch (e) {
                const messages: Message[] = [];
                return messages;
            }
        }
    }
}

