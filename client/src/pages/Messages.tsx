import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from "react";
import Sidenav from "../components/Sidenav";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import { createNewMindMap, getMindMApsList } from '../service/mindMapService';
import { SessionContext } from '../sessionContext';
import { Container, Row, Stack } from 'react-bootstrap';
import { BsFillSendFill } from 'react-icons/bs';
import { ListItem } from '../models/ListItem';
import '../styles/style.css';
import { MindMap } from '../models/types/MindMap';
import { MESSAGES, MINDMAPS, TTLFILETYPE, WIKIMIND } from '../service/containerService';
import { Chat } from '../models/types/Chat';
import { getMessages } from '../service/messageService';

const Messages: React.FC = () => {
  const [list, setList] = useState<Chat[]>([]);

  const sessionContext = useContext(SessionContext)

  const navigate = useNavigate();

  useEffect(() => {
    const result = getMessages(sessionContext.sessionInfo).then((res) => {
      setList(res)
    });
  }, []);


  const showMindMap = (e: Chat) => {
    const url = `${sessionContext.sessionInfo.podUrl}${WIKIMIND}/${MESSAGES}/${e.id}${TTLFILETYPE}`
    navigate('/visualisation/', {
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
                    {item.guest}
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

export default Messages;
