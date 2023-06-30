import React, { useContext, useEffect, useRef, useState } from "react";
import Sidenav, { SideNavType } from "../components/Sidenav";
import Canvas from "../visualisation/Canvas";
import { SessionContext } from "../sessionContext";
import { MindMapDataset } from "../models/types/MindMapDataset";
import { useLocation, useNavigate } from "react-router-dom";
import { createConnection, createNode, getMindMap } from "../service/mindMapService";
import { fetch } from "@inrupt/solid-client-authn-browser";
import {
  WebsocketNotification,
} from "@inrupt/solid-client-notifications";
import { AddCoords, getIdsMapping } from "../visualisation/utils";
import { Button, Col, Container, Form, Row, Stack } from "react-bootstrap";
import { FaBackspace, FaInfo, FaMinus, FaMinusCircle, FaPlus, FaRemoveFormat } from "react-icons/fa";
import { Node } from "../models/types/Node";
import { getEntityNeighbours, getKeywords } from "../service/dbpediaService";
import { ResultItem } from "../models/ResultItem";
import ModalNodeCreate from "../visualisation/modals/ModalNodeCreate";
import { generate_uuidv4 } from "../service/utils";
import { Connection } from "../models/types/Connection";

const Visualisation: React.FC = () => {
  const d3Container = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const countRef = useRef(0);

  const ref = useRef(null);
  const [height, setHeight] = useState(4000);
  const [url, setUrl] = useState('');
  const [width, setWidth] = useState(4000);
  const [dataset, setDataset] = useState<MindMapDataset>();
  const sessionContext = useContext(SessionContext)
  const [mounted, setMounted] = useState(false); // <-- new state variable
  const wssUrl = new URL(sessionContext.sessionInfo.podUrl);
  wssUrl.protocol = 'wss';

  const [clickedNode, setClickedNode] = useState<Node>();
  const [searchedKeyword, setSearchedKeyword] = useState('');
  const [recommends, setRecommends] = useState<ResultItem[]>([]);

  const [creatorVisible, setCreatorVisible] = useState(false); // <-- new state variable
  const [modalNodeCreate, setModalNodeCreate] = useState(false); // <-- new state variable

  useEffect(() => {
    setMounted(true); // set the mounted state variable to true after the component mounts
  }, []);

  useEffect(
    () => {
      if (mounted) {
        if (location.state !== null && location.state.id !== null) {
          setUrl(location.state.id)
          const socket = new WebSocket(wssUrl, ['solid-0.1']);
          socket.onopen = function () {
            this.send(`sub ${location.state.id}`);
          };
          socket.onmessage = function (msg) {
            if (msg.data && msg.data.slice(0, 3) === 'pub') {
              if (msg.data === `pub ${location.state.id}`) {
                getMindMap(location.state.id).then((res: any) => {
                  const myr = res as MindMapDataset;
                  myr.links = AddCoords(myr.links, getIdsMapping(myr.nodes))
                  console.log(myr)
                  setDataset(() => (myr))
                })
              }
            }
          };
          const websocket4 = new WebsocketNotification(
            location.state.id,
            { fetch: fetch }
          );
          websocket4.on("message", (e: any) => {
            getMindMap(location.state.id).then((res: any) => {
              const myr = res as MindMapDataset;
              myr.links = AddCoords(myr.links, getIdsMapping(myr.nodes))
              console.log(myr)
              setDataset(() => (myr))
            })
          });
          websocket4.connect();
          console.log(location.state)
          getMindMap(location.state.id).then((res: any) => {
            const myr = res as MindMapDataset;
            myr.links = AddCoords(myr.links, getIdsMapping(myr.nodes))
            console.log(myr)
            setDataset(() => (myr))
          })
        } else {
          navigate('/')
        }
      }
    }, [mounted])

  const setPosition = (x: number, y: number, id: string) => {
    if (dataset) {
      dataset.nodes = dataset.nodes.map((todo) => {
        if (todo.id === id) {
          return { ...todo, cx: x, cy: y };
        }
        return todo;
      });
    }
  }

  function addNode(item: ResultItem) {
    const newNode: Node = {
      id: generate_uuidv4(),
      uri: item.entity.value,
      title: item.label.value,
      description: '',
      cx: 100,
      cy: 100,
      visible: true
    }
    if (clickedNode) {
      const newConnection: Connection = {
        id: generate_uuidv4(),
        from: clickedNode.id,
        to: newNode.id
      }
      createConnection(dataset?.id, sessionContext.sessionInfo, newConnection)
    }
    createNode(dataset?.id, sessionContext.sessionInfo, newNode)
  }

  async function searchKeyword() {
    const keywords = await getKeywords(searchedKeyword)
    if (keywords !== undefined) {
      setRecommends(keywords)
    }
  }

  async function getSimilar(item: ResultItem) {
    const a = await getEntityNeighbours(item.entity.value)
    if (a) {
      setRecommends(a)
    }
  }

  return (
    <div className="App">
      <Sidenav type={SideNavType.CANVAS} />
      <main ref={ref}>
        <ModalNodeCreate
          dataset={dataset}
          setModal={setModalNodeCreate}
          showModal={modalNodeCreate}
        />
        {creatorVisible &&
          <Container>
            <Row>
              <Stack direction="horizontal" gap={2}>
                <Form.Control
                  type="text"
                  placeholder="Keyword"
                  name="keyword"
                  value={searchedKeyword}
                  onChange={(e) => setSearchedKeyword(e.target.value)}
                />
                <Button onClick={searchKeyword}>Search</Button>
              </Stack>
            </Row>
          </Container>
        }
        {creatorVisible ? (
          <Button id="creator-btn-add" onClick={() => setCreatorVisible(false)} variant="success">
            <FaMinusCircle></FaMinusCircle>
          </Button>
        ) : (
          <Button id="creator-btn-add" onClick={() => setCreatorVisible(true)} variant="success">
            <FaPlus></FaPlus>
          </Button>
        )}
        <div className={creatorVisible ? "creator-top" : "creator-hidden"}>
          <Container>
            <Row>
              {(clickedNode !== undefined) &&
                <Stack direction="horizontal" gap={2}>
                  <Button>
                    {clickedNode.title}
                  </Button>
                  <Button onClick={() => { setClickedNode(undefined) }}><FaMinus></FaMinus></Button>
                </Stack>
              }
            </Row>

          </Container>
          <Container fluid>

            <Row>
              <Col sm="12">
                <div className="message-box">
                  <div className={'fckn-div'}>
                    <div className={'creator-div'}>
                      <button
                        className="creator-btn"
                        onClick={(e) => { e.stopPropagation(); setModalNodeCreate(true); }}
                      >
                        Add custom
                      </button>
                    </div>
                  </div>
                  {recommends.map((item, index) => {
                    return (
                      <div key={index} className={item.type.value === 'http://dbpedia.org/ontology/wikiPageWikiLink' ? 'fckn-div' : 'fckn-div-category'}>
                        <div className={item.type.value === 'http://dbpedia.org/ontology/wikiPageWikiLink' ? 'creator-div' : 'creator-div-category'}>
                          <button className={'creator-btn'} onClick={() => { getSimilar(item); }}>
                            {item.label.value}
                          </button>
                          <button className="creator-inline-btn" onClick={(e) => { e.stopPropagation(); alert('item') }}>
                            <FaInfo></FaInfo>
                          </button>
                          <button className="creator-inline-btn" onClick={(e) => { e.stopPropagation(); { addNode(item) }; }}>
                            {/* <button className="creator-inline-btn" onClick={(e) => { e.stopPropagation(); }}> */}
                            <FaPlus></FaPlus>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <div className={creatorVisible ? "creator-bottom" : "canvas-full"}>
          <Canvas clickedNode={clickedNode} setClickedNode={setClickedNode} data={dataset} height={height} width={width} setPosition={setPosition}></Canvas>
        </div>
      </main>
    </div>
  )
};

export default Visualisation;
