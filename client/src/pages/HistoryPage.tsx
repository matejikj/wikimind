import React from 'react';
import * as d3 from "d3";
import Sidenav from '../components/Sidenav';

interface DataPoint {
  x: Date;
  y: number;
}

const HistoryPage: React.FC = () => {
  const data = [
    { x: new Date('1988-01-01'), y: 1 },
    { x: new Date('1542-01-02'), y: 9 },
    { x: new Date('1997-01-03'), y: 57 },
    { x: new Date('1963-01-03'), y: 68 },
    { x: new Date('2001-01-03'), y: 654 },
    { x: new Date('2050-01-03'), y: 1115 },
    // Add more data points as needed
  ];

  const height = 500
  const width = 500
  const margin = ({ top: 20, right: 20, bottom: 30, left: 30 })

  let x = d3.scaleUtc()
    // @ts-ignore
    .domain(d3.extent(data, d => d.date))
    // @ts-ignore
    .range([margin.left, width - margin.right])

  let y = d3.scaleLinear()
    // @ts-ignore
    .domain([0, d3.max(data, d => d.value)]).nice()
    .range([height - margin.bottom, margin.top])


  const area = (data: any, x: any) => d3.area()
    .curve(d3.curveStepAfter)
    // @ts-ignore
    .x(d => x(d.date))
    .y0(y(0))
    // @ts-ignore
    .y1(d => y(d.value))
    (data)

  const yAxis = (g: any, y: any) => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(null, "s"))
    // @ts-ignore
    .call(g => g.select(".domain").remove())
    // @ts-ignore
    .call(g => g.select(".tick:last-of-type text").clone()
      .attr("x", 3)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      // @ts-ignore
      .text(data.y))

    let xAxis = (g: any, x: any) => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

  return (
    <div className="App">
      <Sidenav />
      <main>
      </main>
    </div>
  );
};

export default HistoryPage;
