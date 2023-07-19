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

const ChatListPage: React.FC = () => {
  const [list, setList] = useState<Chat[]>([]);

  const sessionContext = useContext(SessionContext)

  const navigate = useNavigate();

  const messageService = new MessageService()

  async function fetchChatList(): Promise<void> {
    try {
      const chats = await messageService.getChatList(sessionContext.sessionInfo.podUrl);
      chats && setList(chats)
    } catch (error) {
      // Handle the error, e.g., display an error message to the user or perform fallback actions
    }
  }

  useEffect(() => {
    fetchChatList();
  }, []);

  const showMindMap = (chat: Chat) => {
    const url = `${chat.source}${WIKIMIND}/${CHATS}/${chat.id}${TTLFILETYPE}`
    navigate('/chat/', {
      state: {
        id: url
      }
    })
  }

  return (
    <div className="App">
      <Sidenav />
      <main className='dashboard-main'>
        <Container>

          <Row>
            <Stack direction="horizontal" gap={1}>
              <h1>Your messages!</h1>
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
                <div>
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
