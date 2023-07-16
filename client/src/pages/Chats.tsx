import React, { useContext, useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Sidenav from "../components/Sidenav";

import { Container, Row } from 'react-bootstrap';
import { BsFillSendFill } from 'react-icons/bs';
import { Chat } from '../models/types/Chat';
import { CHATS, TTLFILETYPE, WIKIMIND } from '../service/containerService';
import { MessageService } from '../service/messageService';
import { SessionContext } from '../sessionContext';
import '../styles/style.css';

const Chats: React.FC = () => {
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
      <Sidenav/>
      <main className='dashboard-main'>
        <Container>
          <Row>
            <h1>Your messages!</h1>
          </Row>
          {list.map((item, index) => {
            return (
              <Row key={index}>
                <div className='aaa'>
                  <div className='my-stack'>
                    {item.guest === sessionContext.sessionInfo.webId ? item.host : item.guest}
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
              </Row>
            )
          })}
        </Container>
      </main>
    </div>

  );
};

export default Chats;
