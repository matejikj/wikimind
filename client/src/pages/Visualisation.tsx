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
import { FiSave } from "react-icons/fi";
import { BsNodePlus, BsQuestionSquare } from "react-icons/bs";
import { Node } from "../models/types/Node";
import { getEntityNeighbours, getKeywords } from "../service/dbpediaService";
import { ResultItem } from "../models/ResultItem";
import ModalNodeCreate from "../visualisation/modals/ModalNodeCreate";
import { generate_uuidv4 } from "../service/utils";
import { Connection } from "../models/types/Connection";
import { MdColorLens, MdDriveFileRenameOutline, MdKeyboardReturn, MdOutlineCancel, MdScreenShare } from "react-icons/md";
import { HistoryItem, HistoryItemType } from "../models/HistoryItem";
import ModalNodeDelete from "../visualisation/modals/ModalNodeDelete";
import ModalNodeDetail from "../visualisation/modals/ModalNodeDetail";
import { CanvasState } from "../visualisation/models/CanvasState";
import { saveAs } from 'file-saver';

const Visualisation: React.FC = () => {
  const d3Container = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const countRef = useRef(0);

  const ref = useRef(null);
  const [height, setHeight] = useState(0);
  const [url, setUrl] = useState('');
  const [width, setWidth] = useState(0);
  const [dataset, setDataset] = useState<MindMapDataset>();

  const sessionContext = useContext(SessionContext)
  const [mounted, setMounted] = useState(false); // <-- new state variable
  const wssUrl = new URL(sessionContext.sessionInfo.podUrl);
  wssUrl.protocol = 'wss';

  const [clickedNode, setClickedNode] = useState<Node>();

  const [searchedKeyword, setSearchedKeyword] = useState('');
  const [recommends, setRecommends] = useState<ResultItem[]>([]);
  const [recommendPath, setRecommendPath] = useState<HistoryItem[]>([]);
  const [lastQuery, setLastQuery] = useState<HistoryItem | undefined>(undefined);

  const [creatorVisible, setCreatorVisible] = useState(false); // <-- new state variable
  const [modalNodeCreate, setModalNodeCreate] = useState(false); // <-- new state variable
  const [modalNodeDetail, setModalNodeDetail] = useState(false);
  const [modalNodeDelete, setModalNodeDelete] = useState(false);

  const [canvasState, setCanvasState] = useState<CanvasState>(CanvasState.DEFAULT);
  const [clickedLink, setClickedLink] = useState<Connection>();
  const [disabledCanvas, setDisabledCanvas] = useState(false);

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
              updateCanvasAxis(res)
            }
          })

        } else {
          navigate('/')
        }

      }
    }, [mounted])

  const updateCanvasAxis = (res: MindMapDataset) => {
    if (res) {
      const xAxes = res.nodes.map((node) => { return node.cx })
      const yAxes = res.nodes.map((node) => { return node.cy })
      if (ref && ref.current) {
        // @ts-ignore
        const mainWidth = ref.current.offsetWidth
        // @ts-ignore
        const mainHeight = ref.current.offsetHeight
        setWidth(Math.max(Math.max(...xAxes) + 500, mainWidth))
        setHeight(Math.max(Math.max(...yAxes) + 500, mainHeight))  
      }
    }
  }
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

  function saveDataset() {
    console.log("saveDataset")
  }

  function createPicture() {
    console.log("createPicture")
    const svgElement = document.getElementById('svg-canvas');

    if (svgElement) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      
      const DOMURL = window.URL || window.webkitURL || window;
      const svgURL = DOMURL.createObjectURL(svgBlob);
      
      const img = new Image();
      img.onload = function () {
        if (context) {
          context.canvas.width = img.width;
          context.canvas.height = img.height;
          context.drawImage(img, 0, 0);
          canvas.toBlob(function (blob) {
            if (blob) {
              saveAs(blob, 'svg_image.png');
            }
          });
  
        }
        DOMURL.revokeObjectURL(svgURL);
      };
      img.src = svgURL;    }
  }

  function addNode(item: ResultItem) {
    const newNode: Node = {
      id: generate_uuidv4(),
      uri: item.entity.value,
      title: item.label.value,
      description: '',
      cx: 200,
      color: "#8FBC8F",
      cy: 600,
      visible: true
    }
    if (clickedNode) {
      const newConnection: Connection = {
        id: generate_uuidv4(),
        from: clickedNode.id,
        to: newNode.id
      }
      if (dataset) {
        dataset.links.push(newConnection)

      }
    }
    if (dataset) {
      dataset.nodes.push(newNode)
      updateCanvasAxis(dataset)
      setDataset({
        ...dataset,
        created: '1.7.2023 21:08:08'
      });
    }
    // TODOOOOOO
    // 
    // zazoomovat na novou node po
    //
    // Odstranit connection - kliknout na nej
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
      <Sidenav />
      <main className="visualisation-tools" ref={ref}>
        <ModalNodeCreate
          dataset={dataset}
          setDataset={setDataset}
          setModal={setModalNodeCreate}
          showModal={modalNodeCreate}
        />
        <ModalNodeDelete
          datasetName={dataset}
          clickedNode={clickedNode}
          showModal={modalNodeDelete}
          setModal={setModalNodeDelete}
        />
        <ModalNodeDetail
          showModal={modalNodeDetail}
          setModal={setModalNodeDetail}
          node={clickedNode}
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
                  <Button size="sm" className="rounded-circle" onClick={() => { setClickedNode(undefined) }}><BsQuestionSquare></BsQuestionSquare></Button>
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
          <Button
            size="sm"
            className="rounded-circle"
            id="visualisation-btn-toggle"
            onClick={() => setCreatorVisible(false)}
            variant="success"><FaMinus></FaMinus>
          </Button>
        ) : (
          <Button size="sm" className="rounded-circle" id="visualisation-btn-toggle" onClick={() => setCreatorVisible(true)} variant="success">
            <FaPlus></FaPlus>
          </Button>
        )}
        {creatorVisible &&
          <Button
            size="sm"
            className="rounded-circle"
            id="visualisation-btn-save"
            onClick={() => saveDataset()}
            variant="success"><FiSave></FiSave>
          </Button>
        }
        {creatorVisible &&
          <Button
            size="sm"
            className="rounded-circle"
            id="visualisation-btn-picture"
            onClick={() => createPicture()}
            variant="success"><MdScreenShare></MdScreenShare>
          </Button>
        }
        <div className={creatorVisible ? "creator-top" : "creator-hidden"}>
          <Container fluid>
            <Row>
              <Col sm="12">
                <div className="recommends-div">
                  <Button onClick={() => setModalNodeCreate(true)} className="recommend-btn" size="sm">
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
          <Canvas
            clickedNode={clickedNode}
            setClickedNode={setClickedNode}
            dataset={dataset}
            setDataset={setDataset}
            height={height}
            width={width}
            updateCanvasAxis={updateCanvasAxis}
            setPosition={setPosition}
            canvasState={canvasState}
            setCanvasState={setCanvasState}
            clickedLink={clickedLink}
            setClickedLink={setClickedLink}
            disabledCanvas={disabledCanvas}
            setDisabledCanvas={setDisabledCanvas}
          ></Canvas>
        </div>
      </main>
    </div>
  )
};

export default Visualisation;
