import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { drag } from "d3-drag";
import { click } from "@testing-library/user-event/dist/click";
import { zoom } from 'd3-zoom';

interface Node {
    title: string;
    description: string;
    cx: number;
    cy: number;
    r: number;
    id: string
}

interface Link {
    from: string;
    to: string;
    title: string;
}

interface IProps {
    nodes: Node[];
    links: Link[];
}

const menuItems = [
    {
      title: 'First action',
      action: (d: any) => {
        // TODO: add any action you want to perform
        console.log(d);
      }
    },
    {
      title: 'Second action',
      action: (d: any) => {
        // TODO: add any action you want to perform
        console.log(d);
      }
    }
  ];

const Canvas: React.FC<{ props: IProps }> = ({ props }) => {
    const d3Container = useRef(null);
    
    useEffect(
        () => {
            if (props && d3Container.current) {

                //  event functions, drag and zoom.
                const zoomFunc = (event: any) => {
                    svg.attr('transform', event.transform);
                }
            
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const dragged = (event: any, d: any) => {
                    svg.select("#" + d.id).attr("cx", d.x = event.x).attr("cy", d.y = event.y)
                };

                const svg = d3
                    .select(d3Container.current)
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    .call(zoom().scaleExtent([0.1, 10]).on('zoom', zoomFunc))
                    .on('dblclick.zoom', null);
                    // .append("svg")
                    // .attr("id", "graphSvg")

                const node = svg
                    .selectAll("circle")
                    .data(props.nodes)
                    .enter()
                    .append("circle")
                    .attr("cx", ({cx}) => cx)
                    .attr("cy", ({cy}) => cy)
                    .attr("r", ({r}) => r * 2)
                    .attr("id", ({id}) => id)
                    .attr("fill", (d, i) => d3.interpolateRainbow(i / 120))
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    .call(drag()
                        .on('drag', dragged)
                    );
                }
            },

        [props, d3Container.current])
    

    return (
        <svg
            className="d3-component"
            width={400}
            height={200}
            ref={d3Container}
        />
    )

};

export default Canvas;
