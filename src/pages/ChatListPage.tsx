import React, { useContext, useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Sidenav from "../components/Sidenav";
import { Card, Container, Row, Stack } from 'react-bootstrap';
import { BsFillSendFill } from 'react-icons/bs';
import { Chat } from '../models/types/Chat';
import { CHATS, TTLFILETYPE, WIKIMIND } from '../service/containerService';
import { MessageService } from '../service/messageService';
import { SessionContext } from '../sessionContext';
import '../styles/style.css';
import { MdRefresh } from "react-icons/md";
import chatListLocalization from "./locales/chatList.json";

/**
 * Chat List page.
 */
const ChatListPage: React.FC = () => {
  const [list, setList] = useState<Chat[]>([]);

  const sessionContext = useContext(SessionContext);

  const navigate = useNavigate();

  const messageService = new MessageService();

  /**
   * Fetches the list of chats from the server and updates the state.
   */
  async function fetchChatList(): Promise<void> {
    try {
      const chats = await messageService.getChatList(sessionContext.sessionInfo.podUrl);
      chats && setList(chats);
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    fetchChatList();
  }, []);

  /**
   * Navigates to the chat page with the selected chat's URL.
   * @param chat - The chat object containing the URL.
   */
  const showMindMap = (chat: Chat) => {
    const url = `${chat.source}${WIKIMIND}/${CHATS}/${chat.id}${TTLFILETYPE}`;
    navigate('/chat/', {
      state: {
        id: url
      }
    });
  };

  return (
    <div className="App">
      <Sidenav />
      <main className='dashboard-main'>
        <Container>
          <Row>
            <Stack direction="horizontal" gap={1}>
              <h1>{chatListLocalization.header[sessionContext.sessionInfo.localization]}</h1>
              <Button
                className="rounded-circle"
                size="sm"
                onClick={() => fetchChatList()}
              >
                <MdRefresh>
                </MdRefresh>
              </Button>
            </Stack>
          </Row>
          <Stack >
            {list.map((item, index) => {
              return (
                <div key={index}>
                  <Stack >
                    <div style={{ fontSize: "0.7em" }}>
                      {item.guest === sessionContext.sessionInfo.webId ? item.host : item.guest}
                    </div>
                    <div className='stack-row'>
                      <div className='my-stack'>
                        {item.lastMessage}
                      </div>
                      <div className='my-stack-reverse'>
                        <Button
                          size='sm'
                          className='class-btn rounded-circle'
                          onClick={() => showMindMap(item)}
                          variant="success"
                        >
                          <BsFillSendFill></BsFillSendFill>
                        </Button>
                      </div>
                    </div>
                  </Stack>
                </div>
              )
            })}
          </Stack>
        </Container>
      </main>
    </div>

  );
};

export default ChatListPage;
