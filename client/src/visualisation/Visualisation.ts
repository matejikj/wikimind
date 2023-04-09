import * as d3 from "d3";
import { drag } from "d3-drag";
import { click } from "@testing-library/user-event/dist/click";
import { zoom } from 'd3-zoom';

import { IProps, Node,  } from "./types";

export const createGraph = (reference: any, data: IProps) => {
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
        .select(reference)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .call(zoom().scaleExtent([0.1, 10]).on('zoom', zoomFunc))
        .on('dblclick.zoom', null);
    
    const node = svg
        .selectAll("circle")
        .data(data.nodes)
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

