import React, { useContext, useEffect, useRef, useState } from "react";
import Sidenav from "../components/Sidenav";
import Canvas from "../visualisation/Canvas";
import { SessionContext } from "../sessionContext";
import { MindMapDataset } from "../models/types/MindMapDataset";
import { useLocation, useNavigate } from "react-router-dom";
import { MindMapService } from "../service/mindMapService";
import { fetch } from "@inrupt/solid-client-authn-browser";
import {
  WebsocketNotification,
} from "@inrupt/solid-client-notifications";
import { AddCoords, getIdsMapping } from "../visualisation/utils";
import { Button, Col, Container, Form, Row, Spinner, Stack } from "react-bootstrap";
import { FaBackspace, FaInfo, FaMinus, FaMinusCircle, FaPlus, FaRemoveFormat } from "react-icons/fa";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { ImInfo } from "react-icons/im";
import { AiOutlineClear } from "react-icons/ai";
import { FiSave } from "react-icons/fi";
import { GrGraphQl } from "react-icons/gr";
import { BiTimeFive, BiTrash } from "react-icons/bi";
import { BsNodePlus, BsQuestionSquare } from "react-icons/bs";
import { Node } from "../models/types/Node";
import { getDates, getEntityNeighbours, getKeywords, getSingleReccomends } from "../service/dbpediaService";
import { ResultItem } from "../models/ResultItem";
import ModalNodeCreate from "../visualisation/modals/ModalNodeCreate";
import { generate_uuidv4 } from "../service/utils";
import { Connection } from "../models/types/Connection";
import { MdColorLens, MdDriveFileRenameOutline, MdKeyboardReturn, MdOutlineCancel, MdScreenShare } from "react-icons/md";
import ModalNodeDelete from "../visualisation/modals/ModalNodeDelete";
import ModalNodeDetail from "../visualisation/modals/ModalNodeDetail";
import { CanvasState } from "../visualisation/models/CanvasState";
import { saveAs } from 'file-saver';
import ModalNodeColor from "../visualisation/modals/ModalNodeColor";
import { HistoryItem, HistoryItemType } from "../models/HistoryItem";
import HistoryVisualisation from "../visualisation/HistoryVisualisation";
import { groupDates } from "../visualisation/utiils";
import { HistoryResultItem } from "../models/HistoryResultItem";

const WIKILINK = "http://dbpedia.org/ontology/wikiPageWikiLink"

const Editor: React.FC = () => {
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
  const [modalNodeColor, setModalNodeColor] = useState(false);

  const [canvasState, setCanvasState] = useState<CanvasState>(CanvasState.DEFAULT);
  const [clickedLink, setClickedLink] = useState<Connection>();
  const [disabledCanvas, setDisabledCanvas] = useState(false);
  const [findingSimilar, setFindingSimilar] = useState(false);
  const [historyDataset, setHistoryDataset] = useState<HistoryResultItem[]>([]);

  const [datesView, setDatesView] = useState(false); // <-- new state variable

  const mindMapService = new MindMapService();

  async function fetchMindMap(url: string): Promise<void> {
    try {
      const mindMapDataset = await mindMapService.getMindMap(url);
      if (mindMapDataset) {
        mindMapDataset.links = AddCoords(mindMapDataset.links, getIdsMapping(mindMapDataset.nodes))
        setDataset(mindMapDataset)
        updateCanvasAxis(mindMapDataset)
      }
    } catch (error) {
      // Handle the error, e.g., display an error message to the user or perform fallback actions
    }
  }

  useEffect(
    () => {
      if (location.state !== null && location.state.id !== null) {
        fetchMindMap(location.state.id)
      } else {
        navigate('/')
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
        setWidth(Math.max(Math.max(...xAxes) + 250, mainWidth))
        setHeight(Math.max(Math.max(...yAxes) + 250, mainHeight))
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

  async function saveDataset() {
    if (dataset) {
      const mindMapDataset = await mindMapService.saveMindMap(dataset);
    }
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
      img.src = svgURL;
    }
  }

  function addNode(item: ResultItem) {
    const timestamp = Date.now().toString()
    const newId = generate_uuidv4()
    const newX = 200
    const newY = 600
    if (dataset) {
      dataset.nodes.push({
        id: newId,
        uri: item.entity.value,
        title: item.label.value,
        description: '',
        cx: newX,
        color: "#8FBC8F",
        cy: newY,
        isInTest: false,
        textColor: "black"
      })
      updateCanvasAxis(dataset)
      if (clickedNode) {
        dataset.links.push({
          id: generate_uuidv4(),
          from: clickedNode.id,
          to: newId,
          source: [clickedNode.cx, clickedNode.cy],
          target: [newX, newY]
        })
      }
      setDataset({
        ...dataset,
        mindMap: {
          ...dataset.mindMap,
          created: Date.now().toString()
        }
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

  async function findWikiLinks(item: ResultItem) {
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

  async function getSimilarEntities(item: Node) {
    if (item.uri !== "") {
      setFindingSimilar(true)
      getSingleReccomends(item.uri).then((a) => {
        if (a) {
          setFindingSimilar(false)

          if (lastQuery) {
            recommendPath.push(lastQuery)
          }
          setLastQuery({
            type: HistoryItemType.ITEM,
            value: item.uri,
            label: item.title
          })
          setSearchedKeyword(item.title)
          setRecommends(a)
        }
      })

    }
  }

  function clearSearching() {
    setSearchedKeyword('')
    setLastQuery(undefined)
    setRecommendPath([])
    setRecommends([])
  }


  async function createDateView() {
    if (dataset) {
      getDates(dataset.nodes).then((res) => {
        if (res) {
          res = res
            .filter((resultItem) => !isNaN(Date.parse(resultItem.value.value)))
            .sort((a, b) => Date.parse(a.value.value) - Date.parse(b.value.value))
          setHistoryDataset(res)
          dataset.nodes.map((item) => {
            return item.title + ' ' + item.isInTest
          })
          setCreatorVisible(false);
          setDatesView(true)
        }
      })
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
    } else {
      setSearchedKeyword('')
    }
  }

  function examSwitch() {
    if (clickedNode) {
      const newIsInTest = !clickedNode.isInTest
      const testNode = dataset?.nodes.find((item) => item.id === clickedNode.id)
      if (testNode) {
        testNode.isInTest = newIsInTest
        setClickedNode({
          ...clickedNode,
          isInTest: newIsInTest
        });
      }
    }
  }

  function removeNode() {
    if (clickedNode) {
      
      const filteredNodes = dataset?.nodes.filter((item) => item.id !== clickedNode.id)
      const filteredConnections = dataset?.links.filter((item) => item.from !== clickedNode.id && item.to !== clickedNode.id)
      if (filteredNodes && filteredConnections && dataset) {
        const updatedDataset: MindMapDataset = { ...dataset, nodes: filteredNodes, links: filteredConnections };
        setDataset(updatedDataset);
      }
      setClickedNode(undefined)
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
        <ModalNodeColor
          showModal={modalNodeColor}
          setModal={setModalNodeColor}
          node={clickedNode}
        />
        {creatorVisible &&
          <Container>
            <Row>
              <Stack direction="horizontal" gap={2}>
                <Form.Control
                  type="text"
                  placeholder="Keyword"
                  name="keyword"
                  size="sm"
                  value={searchedKeyword}
                  onChange={(e) => setSearchedKeyword(e.target.value)}
                />
                <Button size="sm" variant="success" onClick={searchKeyword}>Search</Button>
                <Button variant="outline-success" size="sm" className="rounded-circle" onClick={() => { getPreviousItem() }}><MdKeyboardReturn></MdKeyboardReturn></Button>
                <Button variant="outline-success" size="sm" className="rounded-circle" onClick={() => { clearSearching() }}><AiOutlineClear></AiOutlineClear></Button>
              </Stack>
            </Row>
            <Row>
              {(clickedNode !== undefined) &&
                <Stack className="visualisation-active-container" direction="horizontal" gap={1}>
                  <Button variant="success" disabled size="sm">
                    {clickedNode.title.length > 10 ? clickedNode.title.slice(0, 10) + '..' : clickedNode.title}
                  </Button>
                  <Button variant="outline-success" size="sm" className="rounded-circle" onClick={() => { setClickedNode(undefined) }}><ImInfo></ImInfo></Button>
                  <Button size="sm" variant={clickedNode.isInTest ? "info" : "secondary"} className="rounded-circle" onClick={() => examSwitch()}><BsQuestionSquare></BsQuestionSquare></Button>
                  {findingSimilar ? (
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  ) : (
                    <Button size="sm" variant="outline-success" className="rounded-circle" onClick={() => { getSimilarEntities(clickedNode) }}><HiMagnifyingGlass></HiMagnifyingGlass></Button>
                  )}
                  <Button size="sm" variant="outline-success" className="rounded-circle" onClick={() => { setCanvasState(CanvasState.ADD_CONNECTION) }}><BsNodePlus></BsNodePlus></Button>
                  <Button size="sm" variant="outline-success" className="rounded-circle" onClick={() => { setModalNodeColor(true) }}><MdColorLens></MdColorLens></Button>
                  <Button size="sm" variant="outline-success" className="rounded-circle" onClick={() => { setClickedNode(undefined) }}><MdOutlineCancel></MdOutlineCancel></Button>
                  <Button size="sm" variant="outline-success" className="rounded-circle" onClick={() => { removeNode() }}><BiTrash></BiTrash></Button>
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

        {datesView ? (
          <Button
            size="sm"
            className="rounded-circle"
            id="visualisation-btn-time-close"
            onClick={() => {
              setCreatorVisible(false);
              setDatesView(false)
            }}
            variant="success"><GrGraphQl></GrGraphQl>
          </Button>
        ) : (
          <Button
            size="sm"
            className="rounded-circle"
            id="visualisation-btn-time"
            onClick={() => createDateView()}
            variant="success"><BiTimeFive></BiTimeFive>
          </Button>
        )}

        {!datesView && (
          creatorVisible ? (
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
          )
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
        <div className={creatorVisible ? recommends.length !== 0 ? "creator-top-recommends" : "creator-top" : "creator-hidden"}>
          <Container fluid>
            <Row>
              <Col className="recommend-col" sm="12">
                <div className="recommends-div">
                  <Button onClick={() => setModalNodeCreate(true)} className="recommend-btn" size="sm">
                    {"Add custom entity"}
                  </Button>
                </div>

                {recommends.map((item, index) => {
                  return (
                    <div key={index} className={item.type.value === WIKILINK ? 'recommends-div' : 'recommends-div-category'}>
                      <div className={item.type.value === WIKILINK ? 'recommends-inline-div' : 'recommends-inline-div-category'}>

                        <Stack direction="horizontal" gap={0}>
                          <Button onClick={() => { findWikiLinks(item); }} className="recommend-btn" size="sm">
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
        <div className={creatorVisible ? recommends.length !== 0 ? "creator-bottom-recommends" : "creator-bottom" : "canvas-full"}>
          {datesView ? (
            <HistoryVisualisation dataset={historyDataset} />
          ) : (
            <Canvas
              setCreatorVisible={setCreatorVisible}
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
          )}
        </div>
      </main>
    </div>
  )
};

export default Editor;
