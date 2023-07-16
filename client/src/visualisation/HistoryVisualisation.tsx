import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Card, Carousel, Col, Container, Form, Row } from "react-bootstrap";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { TimelineResultItem } from "../dbpedia/models/TimelineResultItem";
import { SessionContext } from "../sessionContext";
import { groupDates } from "./utils";
import { TimePeriod } from "./models/ChoiceSelection";

const HistoryVisualisation: React.FC<{
  dataset: TimelineResultItem[],
}> = ({
  dataset
}) => {
    const d3Container = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const countRef = useRef(0);
    const elementRef = useRef(null);

    const ref = useRef(null);
    const theme = useContext(SessionContext)

    const [currentPeriod, setCurrentPeriod] = useState<TimePeriod>(TimePeriod.Century);

    const [dateGroups, setDateGroups] = useState<{
      [key: string]: TimelineResultItem[];
    }>({});

    const [keys, setKeys] = useState<any[]>([]);
    const [key, setKey] = useState('');

    const [cardsView, setCardsView] = useState(false);

    const [index, setIndex] = useState(0);

    const handleCardsSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const valueIndex = parseInt(event.target.value, 10);
      setIndex(valueIndex);
    };

    const createTimePeriod = (period: TimePeriod) => {
      const grouped = groupDates(dataset, period)
      const keys = Object.keys(grouped)

      setKeys(keys)
      setKey(keys[0])
      setDateGroups(grouped)
    };

    useEffect(() => {
      createTimePeriod(currentPeriod)
    }, []);

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const valueIndex = parseInt(event.target.value, 10);
      setKey(keys[valueIndex])
    };

    function changeToCardsView() {
      setIndex(dataset.length - 1)
      setCardsView(true)
    }

    const handleSelect = (selectedIndex: any) => {
      setIndex(selectedIndex);
    };

    function changeToTimelineView() {
      createTimePeriod(currentPeriod)
      setCardsView(false)
    }
    function aaa(e: any) {
      const newPeriod = parseInt(e.target.value)
      setCurrentPeriod(newPeriod)
      createTimePeriod(newPeriod)
    }



    return (
      <div>
        {!cardsView ? (
          <Button
            size="sm"
            className="rounded-circle"
            id="visualisation-btn-toggle"
            onClick={() => changeToCardsView()}
            variant="success">
            <FaMinus></FaMinus>
          </Button>
        ) : (
          <Button
            size="sm"
            className="rounded-circle"
            id="visualisation-btn-toggle"
            onClick={
              () => changeToTimelineView()
            }
            variant="success">
            <FaPlus></FaPlus>
          </Button>
        )}

        {!cardsView ? (
          <Container fluid>
            <Row>
              <Col>
              </Col>
              <Col sm="8">
                <Form.Select
                  onChange={(e) => aaa(e)}
                  value={currentPeriod}
                  aria-label="Default select example"
                  style={{ maxWidth: '600px' }}
                >
                  <option value={TimePeriod.Century}>Century</option>
                  <option value={TimePeriod.Decade}>Decade</option>
                  <option value={TimePeriod.Year}>Year</option>
                </Form.Select>

              </Col>
              <Col>
              </Col>

            </Row>
            <Row>
              <Col sm="6">
                <Form.Range
                  min={0}
                  max={keys.length - 1}
                  step={1}
                  // value={keys.findIndex((value: any) => value === key)}
                  onChange={handleSliderChange}
                // value={"key"}
                />
              </Col>


            </Row>

            <Row>
              <Col sm="6">
                {currentPeriod === TimePeriod.Century &&
                  <div>{key}. century</div>
                }
                {currentPeriod === TimePeriod.Decade &&
                  <div>{key}s</div>
                }
                {currentPeriod === TimePeriod.Year &&
                  <div>year {key}</div>
                }
              </Col>

            </Row>

            <Row>
              <Col>
                <p>
                  Values:{' '}
                  {key && dateGroups[key] && dateGroups[key].map((item) => {
                    return (
                      <div>
                        {item.label.value + ": " + item.propertyLabel.value + " - " + item.value.value}
                      </div>
                    )
                  })}
                </p>
              </Col>
            </Row>

          </Container>
        ) : (
          <Container fluid>
            <Row>
              <Col>
                <Form.Range
                  min={0}
                  max={dataset.length - 1}
                  step={1}
                  // value={keys.findIndex((value: any) => value === key)}
                  onChange={handleCardsSliderChange}
                  value={index}
                />
              </Col>
            </Row>
            <Row>
              <Carousel
                slide={false}
                onSelect={handleSelect}
                activeIndex={index}
                indicators={false}
                data-bs-theme="dark"
              // className="timeline-carousel"
              >
                {dataset.map((item, index) => {
                  return (
                    <Carousel.Item>
                      <Card>
                        <Card.Img className="carousel-img" variant="top" src={item.thumbnail.value} />
                        <Card.Body>
                          <Card.Title>{item.label.value}</Card.Title>
                          <Card.Subtitle>
                            {item.propertyLabel.value}: {item.value.value}
                          </Card.Subtitle>
                          <div className="timeline-card-text" >
                            {item.abstract.value}
                          </div>
                        </Card.Body>
                      </Card>
                      {/* <Stack gap={3}>
                        <Image className="timeline-img" src={item.thumbnail.value} />                        <div>
                          <h2>{item.label.value}</h2>
                          <h6>{item.propertyLabel.value}: {item.value.value}</h6>
                        </div>
                        <div className="timeline-info-abstract">
                          {item.abstract.value}
                          <br />
                        </div>
                      </Stack> */}
                    </Carousel.Item>

                  )
                })}
              </Carousel>
            </Row>

          </Container>
        )}
      </div >
    )

  };

export default HistoryVisualisation;
