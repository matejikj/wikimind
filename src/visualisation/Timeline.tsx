import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Carousel, Col, Container, Form, Row } from "react-bootstrap";
import { FaAddressCard } from "react-icons/fa";
import { MdFormatListBulleted } from "react-icons/md";
import { TimelineResultItem } from "../dbpedia/models/TimelineResultItem";
import { SessionContext } from "../sessionContext";
import timelineLocalization from "./locales/timeline.json";
import { TimePeriod } from "./models/ChoiceSelection";
import { groupDates } from "./utils";

const Timeline: React.FC<{
  dataset: TimelineResultItem[],
}> = ({
  dataset
}) => {
    const sessionContext = useContext(SessionContext);

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

    function handleSelect(selectedIndex: any) {
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
            <FaAddressCard></FaAddressCard>
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
            <MdFormatListBulleted></MdFormatListBulleted>
          </Button>
        )}
        {!cardsView ? (
          <Container fluid>
            <Row>
              <Col></Col>
              <Col>
                <Form.Select
                  onChange={(e) => aaa(e)}
                  value={currentPeriod}
                  aria-label="Default select example"
                  style={{ maxWidth: '600px' }}
                >
                  <option value={TimePeriod.Century}>{timelineLocalization.century[sessionContext.sessionInfo.localization]}</option>
                  <option value={TimePeriod.Decade}>{timelineLocalization.decade[sessionContext.sessionInfo.localization]}</option>
                  <option value={TimePeriod.Year}>{timelineLocalization.year[sessionContext.sessionInfo.localization]}</option>
                </Form.Select>
              </Col>
              <Col></Col>

            </Row>
            <Row>
              <Col sm="12">
                <Form.Range
                  min={0}
                  max={keys.length - 1}
                  step={1}
                  onChange={handleSliderChange}
                />
              </Col>
            </Row>
            <Row>
              <Col style={{textAlign: "center"}}>
                {currentPeriod === TimePeriod.Century &&
                  <div>{key}. {timelineLocalization.century[sessionContext.sessionInfo.localization]}</div>
                }
                {currentPeriod === TimePeriod.Decade &&
                  <div>{key}s</div>
                }
                {currentPeriod === TimePeriod.Year &&
                  <div>{timelineLocalization.year[sessionContext.sessionInfo.localization]} {key}</div>
                }
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  {key && dateGroups[key] && dateGroups[key].map((item) => {
                    return (
                      <Card style={{marginBottom: "4px", padding: "2px"}}>
                        <Card.Title>{item.value.value}</Card.Title>
                        <Card.Subtitle>{item.propertyLabel.value} {item.label.value}</Card.Subtitle>
                      </Card>
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

export default Timeline;
