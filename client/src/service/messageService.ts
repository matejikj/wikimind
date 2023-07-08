import { fetch } from "@inrupt/solid-client-authn-browser";

import {
    getSolidDataset,
    getThing,
    getThingAll,
    setThing,
    saveSolidDatasetAt,
    getUrlAll,
} from "@inrupt/solid-client";



import { RDF } from "@inrupt/vocab-common-rdf";
import profileDefinition from "../definitions/profile.json"
import chatDefinition from "../definitions/chat.json"
import messageDefinition from "../definitions/message.json"
import mindMapDefinition from "../definitions/mindMap.json"
import linkDefinition from "../definitions/link.json"
import { LDO } from "../models/LDO";
import { CONTACTS, MESSAGES, TTLFILETYPE, WIKIMIND, getPodUrl } from "./containerService";
import { LinkLDO } from "../models/things/LinkLDO";
import { LinkType } from "../models/types/LinkType";
import { UserSession } from "../models/types/UserSession";
import { Profile } from "../models/types/Profile";
import { ProfileLDO } from "../models/things/ProfileLDO";
import { MessageLDO } from "../models/things/MessageLDO";
import { Message } from "../models/types/Message";
import { ChatLDO } from "../models/things/ChatLDO";
import { Chat } from "../models/types/Chat";
import { ChatDataset } from "../models/types/ChatDataset";
import { ChatRepository } from "../repository/chatRepository";
import { MessageRepository } from "../repository/messageRepository";
import { LinkRepository } from "../repository/linksRepository";

export class MessageService {
  private chatRepository: ChatRepository;
  private messageRepository: MessageRepository;
  private linkRepository: LinkRepository;

  constructor() {
    this.chatRepository = new ChatRepository();
    this.messageRepository = new MessageRepository();
    this.linkRepository = new LinkRepository();
  }

  async getChatList(podUrl: string): Promise<Chat[] | undefined> {
    try {
      const chats: Chat[] = []
      const chatLinksUrl = `${podUrl}${WIKIMIND}/${MESSAGES}/${CONTACTS}${TTLFILETYPE}`;
      const chatLinks = await this.linkRepository.getLinksList(chatLinksUrl);
      await Promise.all(chatLinks.map(async (link) => {
        const chat = await this.chatRepository.getChat(link.url)
        chat && chats.push(chat)
      }));
      return chats
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getChat(chatUrl: string): Promise<ChatDataset | undefined> {
    try {
      const chat = await this.chatRepository.getChat(chatUrl)
      if (chat) {
        const res: any = await this.messageRepository.getMessages(chat.storage)
        const chatDataset: ChatDataset = {
          chat: chat,
          messages: res.links
        };
        return chatDataset;
      }
    }

    catch (error) {
      console.error(error);
      return undefined;
    }
  }
}

export async function getMessages(userSession: UserSession) {
    const chats: Chat[] = []
    const classesListUrl = `${userSession.podUrl}${WIKIMIND}/${MESSAGES}/${CONTACTS}${TTLFILETYPE}`;
  
    const myDataset = await getSolidDataset(
      classesListUrl,
      { fetch: fetch }
    );

    const things = await getThingAll(myDataset);
    const datasetLinkBuilder = new LinkLDO(linkDefinition)
    await Promise.all(things.map(async (thing) => {
      const types = getUrlAll(thing, RDF.type);
      if (types.some(type => type === linkDefinition.identity)) {
        const link = datasetLinkBuilder.read(thing)
        if (link.linkType === LinkType.CHAT_LINK) {
          const myDataset = await getSolidDataset(
            link.url,
            { fetch: fetch }
          );
          const things = await getThingAll(myDataset);
          const chatLDO = new ChatLDO(chatDefinition)
          things.forEach(thing => {
            const types = getUrlAll(thing, RDF.type);
            if (types.some(type => type === chatDefinition.identity)) {
              chats.push(chatLDO.read(thing))
            }
          });
        }
      }
    }));
    return chats;
}

export async function getChat(path: string) {
    let chat: Chat | undefined
    const chatDataset = await getSolidDataset(
      path,
      { fetch: fetch }
    );

    const chatThings = await getThingAll(chatDataset);
    const msgLDO = new MessageLDO(messageDefinition)
    const chatLDO = new ChatLDO(chatDefinition)

    chatThings.map(async (thing) => {
      const types = getUrlAll(thing, RDF.type);
      if (types.some(type => type === chatDefinition.identity)) {
        chat = (chatLDO.read(thing))
          }});

          if (chat) {
            const a = Date.now()
            const messages: Message[] = []
            const myDataset = await getSolidDataset(
              chat.storage,
              { fetch: fetch }
            );
        
            const things = await getThingAll(myDataset);
            things.map((thing) => {
              const types = getUrlAll(thing, RDF.type);
              if (types.some(type => type === messageDefinition.identity)) {
                messages.push(msgLDO.read(thing))
                }
            });
            
    
              const dataset: ChatDataset = {
                chat: chat,
                messages: messages.sort((a, b) => a.date - b.date)
              }
              return dataset
            
          }
    
}


export async function sendMessage(chat: Chat, message: Message) {
  const url = `${chat.ownerPod}${WIKIMIND}/${MESSAGES}/${chat.storage}${TTLFILETYPE}`
  let chatDataset = await getSolidDataset(
    chat.storage,
    { fetch: fetch }
  );

  const newMessage = new MessageLDO(messageDefinition).create(message)
  chatDataset = setThing(chatDataset, newMessage)
  await saveSolidDatasetAt(
    chat.storage,
    chatDataset,
    { fetch: fetch }
);

}
  

//   export async function getMindMap(url: string): Promise<ChatDataset | null> {
//     const chats: Chat[] = []
//     const classesListUrl = `${userSession.podUrl}${WIKIMIND}/${MESSAGES}/${CONTACTS}${TTLFILETYPE}`;
  
//     const myDataset = await getSolidDataset(
//       classesListUrl,
//       { fetch: fetch }
//     );


    
//     const mindmapDataset = await getSolidDataset(url, { fetch });
//     const mindMapThings = await getThingAll(mindmapDataset);
  
//     const mindMapLDO = new MindMapLDO(mindMapDefinition);
//     let mindMap: MindMap | null = null;
  
//     mindMapThings.forEach((thing) => {
//       const types = getUrlAll(thing, RDF.type);
//       if (types.includes(mindMapDefinition.identity)) {
//         mindMap = mindMapLDO.read(thing);
//       }
//     });
  
//     if (mindMap !== null) {
//       mindMap = mindMap as MindMap;
//       const mindmapStorageDataset = await getSolidDataset(mindMap.storage, { fetch });
//       const mindMapStorageThings = await getThingAll(mindmapStorageDataset);
//       const nodes: Node[] = [];
//       const nodeLDO = new NodeLDO(nodeDefinition);
//       const links: Connection[] = [];
//       const connectionLDO = new ConnectionLDO(connectionDefinition);
  
//       mindMapStorageThings.forEach((thing) => {
//         const types = getUrlAll(thing, RDF.type);
//         if (types.includes(nodeDefinition.identity)) {
//           nodes.push(nodeLDO.read(thing));
//         }
//         if (types.includes(connectionDefinition.identity)) {
//           links.push(connectionLDO.read(thing));
//         }
//       });
//       const mindMapDataset: MindMapDataset = {
//         id: mindMap.id,
//         name: mindMap.name,
//         storage: mindMap.storage,
//         created: mindMap.created,
//         links: links,
//         nodes: nodes,
//       };
//       return mindMapDataset;
//     } else {
//       return null
//     }
//   }
  