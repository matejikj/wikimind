import React, { useContext, useEffect, useRef, useState } from "react";
import Sidenav from "../components/Sidenav";
import { SessionContext } from "../sessionContext";
import { useLocation, useNavigate } from "react-router-dom";
import { DateGroup, aaa, bbbb, randomDates } from "../pages/utils";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { ChoiceSelection, groupDates } from "./utiils";
import { ResultItem } from "../models/ResultItem";
import { MindMapDataset } from "../models/types/MindMapDataset";
import { HistoryResultItem } from "../models/HistoryResultItem";

const HistoryVisualisation: React.FC<{
  dataset: HistoryResultItem[],
}> = ({
  dataset
}) => {
    const d3Container = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const countRef = useRef(0);

    const ref = useRef(null);
    const theme = useContext(SessionContext)

    const [selectedValue, setSelectedValue] = useState(undefined);

    const [selectedView, setSelectedView] = useState<ChoiceSelection>(ChoiceSelection.decades);

    const [dateGroups, setDateGroups] = useState<{
      [key: string]: HistoryResultItem[];
    }>({});

    const [keys, setKeys] = useState<any[]>([]);
    const [key, setKey] = useState('');

    useEffect(() => {
      const grouped = groupDates(dataset, selectedView)
      const keys = Object.keys(grouped)

      setKeys(keys)
      setKey(keys[0])
      setDateGroups(grouped)
      console.log(grouped)
    }, []);

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const valueIndex = parseInt(event.target.value, 10);
      setKey(keys[valueIndex])
      // console.log(dateGroups[key][0].value.value)
    };


    return (
      <Container>
        <Row>
          <Col>
            <h3>Selected Value: {key}</h3>

            {/* <input
              type="range"
              min={0}
              max={keys.length - 1}
              step={1}
              value={keys.findIndex((value: any) => value === key)}
              onChange={handleSliderChange}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {keys.map((value: any, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: index === keys.findIndex((v) => v === key) ? 'blue' : 'gray',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    display: 'inline-block',
                  }}
                ></span>
              ))}
            </div> */}
            <Form.Range
              min={0}
              max={keys.length - 1}
              step={1}
              // value={keys.findIndex((value: any) => value === key)}
              onChange={handleSliderChange}
            // value={"key"}
            />
            {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {keys.map((value: any, index) => (
                <Button disabled key={index}>{value}</Button>
              ))}
            </div> */}

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
      </Container >
    )

  };

export default HistoryVisualisation;
