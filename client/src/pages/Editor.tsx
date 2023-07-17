import { saveAs } from 'file-saver';
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, Row, Spinner, Stack } from "react-bootstrap";
import { AiOutlineClear } from "react-icons/ai";
import { BiTimeFive, BiTrash } from "react-icons/bi";
import { BsNodePlus, BsQuestionSquare } from "react-icons/bs";
import { FaInfo, FaMinus, FaPlus } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { GrGraphQl } from "react-icons/gr";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { ImInfo } from "react-icons/im";
import { MdColorLens, MdKeyboardReturn, MdOutlineCancel, MdScreenShare } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import Sidenav from "../components/Sidenav";
import { CATEGORY_PART, DBPediaService } from "../dbpedia/dbpediaService";
import { RecommendResultItem } from "../dbpedia/models/RecommendResultItem";
import { TimelineResultItem } from "../dbpedia/models/TimelineResultItem";
import { Connection } from "../models/types/Connection";
import { MindMapDataset } from "../models/types/MindMapDataset";
import { Node } from "../models/types/Node";
import { MindMapService } from "../service/mindMapService";
import { SessionContext } from "../sessionContext";
import Canvas from "../visualisation/Canvas";
import HistoryVisualisation from "../visualisation/HistoryVisualisation";
import ModalNodeColor from "../visualisation/modals/ModalNodeColor";
import ModalNodeDelete from "../visualisation/modals/ModalNodeDelete";
import ModalNodeDetail from "../visualisation/modals/ModalNodeDetail";
import ModalNodeEditor from "../visualisation/modals/ModalNodeEditor";
import { CanvasState } from "../visualisation/models/CanvasState";
import { HistoryItem } from "../visualisation/models/HistoryItem";
import { HistoryItemType } from "../visualisation/models/HistoryItemType";
import { AddCoords, getIdsMapping } from "../visualisation/utils";
import { set } from 'lodash';

const blankNode: Node = {
  id: '',
  uri: '',
  title: '',
  description: '',
  cx: 100,
  cy: 100,
  isInTest: false,
  color: '#8FBC8F',
  textColor: "black"
}

const Editor: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const ref = useRef(null);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [dataset, setDataset] = useState<MindMapDataset>();

  const sessionContext = useContext(SessionContext)
  const wssUrl = new URL(sessionContext.sessionInfo.podUrl);
  wssUrl.protocol = 'wss';

  const [clickedNode, setClickedNode] = useState<Node>();
  const [createdNode, setCreatedNode] = useState<Node>();
  const [detailNode, setDetailNode] = useState<Node>();
  
  const [searchedKeyword, setSearchedKeyword] = useState('');
  const [recommends, setRecommends] = useState<RecommendResultItem[]>([]);
  const [recommendPath, setRecommendPath] = useState<HistoryItem[]>([]);
  const [lastQuery, setLastQuery] = useState<HistoryItem | undefined>(undefined);

  const [creatorVisible, setCreatorVisible] = useState(false); // <-- new state variable
  const [modalNodeCreate, setModalNodeCreate] = useState(false); // <-- new state variable
  const [modalNodeDelete, setModalNodeDelete] = useState(false);
  const [modalNodeColor, setModalNodeColor] = useState(false);
  const [modalRecommendDetail, setModalRecommendDetail] = useState(false);

  const [canvasState, setCanvasState] = useState<CanvasState>(CanvasState.DEFAULT);
  const [clickedLink, setClickedLink] = useState<Connection>();
  const [disabledCanvas, setDisabledCanvas] = useState(false);
  const [findingSimilar, setFindingSimilar] = useState(false);
  const [historyDataset, setHistoryDataset] = useState<TimelineResultItem[]>([]);

  const [datesView, setDatesView] = useState(false); // <-- new state variable

  const mindMapService = new MindMapService();
  const dbpediaService = new DBPediaService(sessionContext.sessionInfo);

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
    }, [])

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
      await mindMapService.saveMindMap(dataset);
    }
  }

  function createPicture() {
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

  async function searchKeyword() {
    const keywords = await dbpediaService.getKeywords(searchedKeyword)
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

  async function findWikiLinks(item: RecommendResultItem) {
    const recommendations = await dbpediaService.getEntityRecommendation(item.entity.value)
    if (recommendations) {
      if (lastQuery) {
        recommendPath.push(lastQuery)
      }
      setLastQuery({
        type: HistoryItemType.ITEM,
        value: item.entity.value,
        label: item.label.value
      })
      setSearchedKeyword(item.label.value)
      setRecommends(recommendations)
    }
  }

  async function getSimilarEntities(item: Node) {
    if (item.uri !== "") {
      setFindingSimilar(true)

      const recommendations = await dbpediaService.getEntityRecommendation(item.uri)
      if (recommendations) {
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
        setRecommends(recommendations)
      }
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
      let dates = await dbpediaService.getDates(dataset.nodes)
      if (dates) {
        dates = dates
          .filter((resultItem) => !isNaN(Date.parse(resultItem.value.value)))
          .sort((a, b) => Date.parse(a.value.value) - Date.parse(b.value.value))
        setHistoryDataset(dates)
        dataset.nodes.map((item) => {
          return item.title + ' ' + item.isInTest
        })
        setCreatorVisible(false);
        setDatesView(true)

      }
    }
  }

  async function getPreviousItem() {
    if (recommendPath.length > 0) {
      const lastItem = recommendPath.pop()
      if (lastItem) {
        setLastQuery(lastItem)
        setSearchedKeyword(lastItem.label)
        if (lastItem.type === HistoryItemType.KEYWORD) {
          const a = await dbpediaService.getKeywords(lastItem.value)
          if (a) {
            setRecommends(a)
          }
        } else {
          const a = await dbpediaService.getEntityRecommendation(lastItem.value)
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

  async function createCustomEntity() {
    const newNode: Node = JSON.parse(JSON.stringify(blankNode))
    newNode.cx = 300
    newNode.cy = 300
    setCreatedNode(newNode)
    setModalNodeCreate(true)
  }

  async function openRecommendDetail(item: RecommendResultItem) {
    const res = await dbpediaService.getRecommendDetail(item)
      const newNode: Node = JSON.parse(JSON.stringify(blankNode))
      newNode.title = item.label.value
      newNode.description = res
      setDetailNode(newNode)
      setModalRecommendDetail(true)
  }

  async function addRecommendation(item: RecommendResultItem) {
    const res = await dbpediaService.getRecommendDetail(item)
      const newNode: Node = JSON.parse(JSON.stringify(blankNode))
      newNode.description = res
      newNode.title = item.label.value
      newNode.uri = item.entity.value
      newNode.cx = 300
      newNode.cy = 300
      setCreatedNode(newNode)
      setModalNodeCreate(true)
  }

  async function editNode(item: Node) {
    setCreatedNode(item)
    setModalNodeCreate(true)
  }

  return (
    <div className="App">
      <Sidenav />
      <main className="visualisation-tools" ref={ref}>
      <ModalNodeEditor
          clickedNode={clickedNode}
          updateCanvasAxis={updateCanvasAxis}
          node={createdNode}
          setNode={setCreatedNode}
          dataset={dataset}
          setDataset={setDataset}
          setModal={setModalNodeCreate}
          showModal={modalNodeCreate}
        />
        <ModalNodeDetail
          node={detailNode}
          setModal={setModalRecommendDetail}
          showModal={modalRecommendDetail}
        />
        <ModalNodeDelete
          datasetName={dataset}
          clickedNode={clickedNode}
          showModal={modalNodeDelete}
          setModal={setModalNodeDelete}
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
                  <Button variant="outline-success" size="sm" className="rounded-circle" onClick={() => { editNode(clickedNode) }}><ImInfo></ImInfo></Button>
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
                  <Button onClick={() => createCustomEntity()} variant={'outline'} className="recommend-btn" size="sm">
                    {"Add custom entity"}
                  </Button>
                </div>

                {recommends.map((item, index) => {
                  return (
                    <div key={index} className={item.entity.value.includes(CATEGORY_PART) ? 'recommends-div-category' : 'recommends-div'}>
                      <div className={item.entity.value.includes(CATEGORY_PART) ? 'recommends-inline-div-category' : 'recommends-inline-div'}>

                        <Stack direction="horizontal" gap={0}>
                          <Button onClick={() => { findWikiLinks(item); }} className="recommend-btn" size="sm">
                            {item.label.value}
                          </Button>
                          <Button size="sm" className="recommend-btn" onClick={() => { openRecommendDetail(item) }}><FaInfo></FaInfo></Button>
                          <Button size="sm" className="recommend-btn" onClick={() => { addRecommendation(item) }}><FaPlus></FaPlus></Button>
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
