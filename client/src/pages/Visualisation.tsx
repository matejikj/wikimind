import React, { useContext, useEffect, useRef, useState } from "react";
import Sidenav from "../components/Sidenav";
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
import { HiMagnifyingGlass } from "react-icons/hi2";
import { ImInfo } from "react-icons/im";
import { BsNodePlus } from "react-icons/bs";
import { Node } from "../models/types/Node";
import { getEntityNeighbours, getKeywords } from "../service/dbpediaService";
import { ResultItem } from "../models/ResultItem";
import ModalNodeCreate from "../visualisation/modals/ModalNodeCreate";
import { generate_uuidv4 } from "../service/utils";
import { Connection } from "../models/types/Connection";
import { MdColorLens, MdDriveFileRenameOutline, MdKeyboardReturn, MdOutlineCancel } from "react-icons/md";
import { HistoryItem, HistoryItemType } from "../models/HistoryItem";

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
  const [recommendPath, setRecommendPath] = useState<HistoryItem[]>([]);
  const [lastQuery, setLastQuery] = useState<HistoryItem | undefined>( undefined);

  const [creatorVisible, setCreatorVisible] = useState(false); // <-- new state variable
  const [modalNodeCreate, setModalNodeCreate] = useState(false); // <-- new state variable

  useEffect(() => {
    setMounted(true); // set the mounted state variable to true after the component mounts
  }, []);

  useEffect(
    () => {

      if (mounted) {
        if (location.state !== null && location.state.id !== null) {
          getMindMap(location.state.id).then((res: MindMapDataset | null) => {
            if (res) {
              res.links = AddCoords(res.links, getIdsMapping(res.nodes))
              setDataset(res)
            }
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
      color: "#8FBC8F",
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
    // zazoomovat na novou node po
  }

  async function searchKeyword() {
    const keywords = await getKeywords(searchedKeyword)
    if (keywords !== undefined) {
      if (lastQuery) {
        recommendPath.push(lastQuery)
      }
      setLastQuery({
        type: HistoryItemType.KEYWORD,
        value: searchedKeyword,
        label: searchedKeyword
      })
      setRecommends(keywords)
    }
  }

  async function getSimilar(item: ResultItem) {
    const a = await getEntityNeighbours(item.entity.value)
    if (a) {
      if (lastQuery) {
        recommendPath.push(lastQuery)
      }
      setLastQuery({
        type: HistoryItemType.ITEM,
        value: item.entity.value,
        label: item.label.value        
      })
      setSearchedKeyword(item.label.value)
      setRecommends(a)
    }
  }

  async function getPreviousItem() {
    if (recommendPath.length > 0) {
      const lastItem = recommendPath.pop()
      if (lastItem) {
        setLastQuery(lastItem)
        setSearchedKeyword(lastItem.label)
        if (lastItem.type === HistoryItemType.KEYWORD) {
          const a = await getKeywords(lastItem.value)
          if (a) {
            setRecommends(a)
          }
        } else {
          const a = await getEntityNeighbours(lastItem.value)
          if (a) {
            setRecommends(a)
          }
        }
      }
    }
  }

  return (
    <div className="App">
      <Sidenav/>
      <main className="visualisation-tools" ref={ref}>
        <ModalNodeCreate
          dataset={dataset}
          setModal={setModalNodeCreate}
          showModal={modalNodeCreate}
        />
        {creatorVisible &&
          <Container className="visualisation-searchbar-container">
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
                <Button size="sm" className="rounded-circle" onClick={() => { getPreviousItem() }}><MdKeyboardReturn></MdKeyboardReturn></Button>
              </Stack>
            </Row>
            <Row>
              {(clickedNode !== undefined) &&
                <Stack className="visualisation-active-container" direction="horizontal" gap={1}>
                  <Button disabled size="sm">
                    {clickedNode.title.length > 15 ? clickedNode.title.slice(0, 15) + '...' : clickedNode.title}
                  </Button>
                  <Button size="sm" className="rounded-circle" onClick={() => { setClickedNode(undefined) }}><ImInfo></ImInfo></Button>
                  <Button size="sm" className="rounded-circle" onClick={() => { setClickedNode(undefined) }}><MdDriveFileRenameOutline></MdDriveFileRenameOutline></Button>
                  <Button size="sm" className="rounded-circle" onClick={() => { setClickedNode(undefined) }}><HiMagnifyingGlass></HiMagnifyingGlass></Button>
                  <Button size="sm" className="rounded-circle" onClick={() => { setClickedNode(undefined) }}><BsNodePlus></BsNodePlus></Button>
                  <Button size="sm" className="rounded-circle" onClick={() => { setClickedNode(undefined) }}><MdColorLens></MdColorLens></Button>
                  <Button size="sm" className="rounded-circle" onClick={() => { setClickedNode(undefined) }}><MdOutlineCancel></MdOutlineCancel></Button>
                </Stack>
              }
              {(clickedNode === undefined) &&
                <Stack className="visualisation-active-container" direction="horizontal" gap={1}>
                  <Button disabled variant="light" size="sm">
                    {"No active node"}
                  </Button>
                </Stack>
              }
            </Row>
          </Container>
        }
        {creatorVisible ? (
          <Button size="sm" className="rounded-circle" id="visualisation-btn-toggle" onClick={() => setCreatorVisible(false)} variant="success">
            <FaMinus></FaMinus>
          </Button>
        ) : (
          <Button size="sm" className="rounded-circle" id="visualisation-btn-toggle" onClick={() => setCreatorVisible(true)} variant="success">
            <FaPlus></FaPlus>
          </Button>
        )}
        <div className={creatorVisible ? "creator-top" : "creator-hidden"}>
          <Container fluid>
            <Row>
              <Col sm="12">
                <div className="recommends-div">
                  <Button className="recommend-btn" size="sm">
                    {"Add custom entity"}
                  </Button>
                </div>

                {recommends.map((item, index) => {
                  return (
                    <div key={index} className={item.type.value === 'http://dbpedia.org/ontology/wikiPageWikiLink' ? 'recommends-div' : 'recommends-div-category'}>
                      <div className={item.type.value === 'http://dbpedia.org/ontology/wikiPageWikiLink' ? 'recommends-inline-div' : 'recommends-inline-div-category'}>

                        <Stack direction="horizontal" gap={0}>
                          <Button onClick={() => { getSimilar(item); }} className="recommend-btn" size="sm">
                            {item.label.value}
                          </Button>
                          <Button size="sm" className="recommend-btn" onClick={() => { alert('item') }}><FaInfo></FaInfo></Button>
                          <Button size="sm" className="recommend-btn" onClick={() => { addNode(item) }}><FaPlus></FaPlus></Button>

                        </Stack>

                      </div>
                    </div>
                  )
                })}
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
