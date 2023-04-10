import * as d3 from "d3";
import { drag } from "d3-drag";
import { click } from "@testing-library/user-event/dist/click";
import { zoom } from 'd3-zoom';

import { IProps, Node,  } from "./types";
import { createContextMenu } from "./Menu";
import { AddCoords, getIdsMapping } from "./utils";

export const createGraph = (reference: any, data: IProps) => {
    //  event functions, drag and zoom.
    const zoomFunc = (event: any) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        svg.attr('transform', event.transform);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const dragged = (event: any, d: any) => {
        svg.selectAll(".text_" + d.id).attr("dx", d.x = event.x).attr("dy", d.y = event.y)
        svg.selectAll(".node_" + d.id).attr("cx", d.x = event.x).attr("cy", d.y = event.y)
        svg.selectAll(".from_" + d.id).attr("x1", d.x = event.x).attr("y1", d.y = event.y)
        svg.selectAll(".to_" + d.id).attr("x2", d.x = event.x).attr("y2", d.y = event.y)
    };

    const svg = d3
        .select(reference)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .call(zoom().scaleExtent([0.1, 10]).on('zoom', zoomFunc))
        .on('dblclick.zoom', null);

    const link = svg
        .selectAll("line")
        .data(AddCoords(data.links, getIdsMapping(data.nodes)))
        .attr("stroke", "#999")
        .attr("class", ({from, to}) => `from_${from} to_${to}`)
        .attr("stroke-opacity", 0.6)
        .join("line")
        .attr("x1", ({source}) => source != undefined ? source[0] : 0)
        .attr("y1", ({source}) => source != undefined ? source[1] : 0)
        .attr("x2", ({target}) => target != undefined ? target[0] : 0)
        .attr("y2", ({target}) => target != undefined ? target[1] : 0)
        .attr("stroke-width", d => Math.sqrt(10));

    const linkLabels = svg.append("g")
        .attr("class", "link_labels")
        .selectAll("text")
        .data(AddCoords(data.links, getIdsMapping(data.nodes)))
        .enter()
        .append("text")
        .on('contextmenu', (d) => {
            createContextMenu(d, svg);
          })
        .style("cursor", "click")
        .attr("class", ({from, to}) => `lblfrom_${from} lblto_${to}`)
        .attr("dx", ({source, target}) => ((source != undefined ? source[0] : 0) + (target != undefined ? target[0] : 0)) / 2)
        .attr("dy", ({source, target}) => ((source != undefined ? source[1] : 0) + (target != undefined ? target[1] : 0)) / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .text(d => d.title)

    const node = svg
        .selectAll("circle")
        .data(data.nodes)
        .enter()
        .append("circle")
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .style("cursor", "grab")
        .attr("cx", ({cx}) => cx)
        .attr("cy", ({cy}) => cy)
        .attr("r", ({r}) => r * 2)
        .attr("class", ({id}) => `node_${id}`)
        .attr("fill", (d, i) => d3.interpolateRainbow(i / 120))
        .on('contextmenu', (d) => {
            createContextMenu(d, svg);
          })
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .call(drag()
            .on('drag', dragged)
        );
    
    const label = svg.append("g")
        .attr("class", "node_labels")
        .selectAll("text")
        .data(data.nodes)
        .enter()
        .append("text")
        .on('contextmenu', (d) => {
            createContextMenu(d, svg);
          })
        .style("cursor", "grab")
        .attr("class", ({id}) => `text_${id}`)
        .attr("dx", ({cx}) => cx)
        .attr("dy", ({cy}) => cy)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .text(d => d.title)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .call(drag()
            .on('drag', dragged)
    );

}

