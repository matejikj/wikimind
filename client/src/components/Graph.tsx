// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useEffect, useRef } from 'react';
// import {
//   forceCenter,
//   forceLink,
//   // forceManyBody,
//   forceSimulation,
//   forceCollide,
//   // forceX,
//   // forceY,
// } from 'd3-force';
// import * as d3 from 'd3';
// import { drag } from 'd3-drag';
// import { zoom } from 'd3-zoom';
// import { line, curveCardinal } from 'd3-shape';
// import { Box } from '@mui/system';

// const purpleRgb = 'rgb(148,158,213)';

// type Node = {
//   id: string;
//   class: string;
//   component?: string; // for future use, color the nodes for dividing to components.
// };

// type ErdParams = {
//   fullScreen: boolean;
// };

// const { edges, nodes } = {
//   nodes: [
//     {
//       id: 'projects',
//       class: 'RELATIONAL',
//       weight: 1,
//       pk: '123bfdfsdf',
//       fk: 'owner_id',
//       x: 33,
//       y: 33,
//     },
//     {
//       id: 'schemas',
//       class: 'RELATIONAL',
//       weight: 1,
//       pk: '123bfdfsdf',
//       fk: 'owner_id',
//       x: 222,
//       y: 222,
//     },
//   ],
//   edges: [
//     {
//       source: 'projects',
//       target: 'schemas',
//       weight: 2,
//       overlap: 1,
//       connectionType: 'hovno',
//       type: 'parent',
//     },
//   ],
// };
// // const componentText =  "some table"; // todo pass it as a prop.

// function ErdGraph({ fullScreen }: ErdParams): JSX.Element {
//   const d3Container = useRef(null);
//   const scale = fullScreen
//     ? { height: 1000, width: 1000 }
//     : { height: 600, width: 600 };

//   // const componentTextUppercase = componentText.toUpperCase();

//   useEffect(() => {
//     const zoomHandler = zoom();

//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//     const simulation = forceSimulation(nodes);

//     const handler = drag();

//     simulation
//       .force(
//         'yPosition',
//         d3
//           .forceY(function (d) {
//             return d.y;
//           })
//           .strength(2)
//       )
//       .force(
//         'xPosition',
//         d3
//           .forceX(function (d) {
//             return d.x;
//           })
//           .strength(2)
//       )
//       .force(
//         'link',
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-ignore

//         forceLink(edges)
//           .id((d) => (d as Node).id)
//       )
//       // .force("x", forceX())
//       // .force("y", forceY())
//       // .force("gravity", forceManyBody().strength(-50))
//       .alphaDecay(0.01)
//       .alphaTarget(1)


//     //  event functions, drag and zoom.
//     function zoomFunc(event: any) {
//       svg.attr('transform', event.transform);
//     }

//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//     const dragstarted = (event: any, d: any) => {
//       event.sourceEvent.stopPropagation();
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       if (!event.active) {
//         simulation.alphaTarget(0.3).restart();
//       }
//       d.fx = d.x;
//       d.fy = d.y;
//     };

//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//     const dragged = (event: any, d: any) => {
//       d.fx = event.x;
//       d.fy = event.y;

//       // d.fx += event.dx;
//       // d.fy += event.dy;

//       d.fixed = true;
//       // d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);

//       // d.fx = event.x;
//       // d.fy = event.y;
//     };

//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//     const dragended = (event: any, d: any) => {
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       if (!event.active) {
//         simulation.alphaTarget(0);
//       }

//       d.fx = null;
//       d.fy = null;
//     };

//     const svg = d3
//       .select('#Target')
//       // .style("border-radius", "50%")
//       // .style("background-color", "#F0F0F0")
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       .call(zoomHandler.scaleExtent([0.1, 10]).on('zoom', zoomFunc))
//       .on('dblclick.zoom', null);

//     // for future use, adding component name for each erd schema
//     // svg.append("text")
//     //   .text(componentTextUppercase)
//     //   .attr("x", "300")
//     //   .attr("dy", "50")
//     //   .attr("startOffset", "50%")
//     //   .attr("text-anchor", "middle")
//     //   .style("fill","black")
//     //   .attr("stroke-width", "1")

//     const edge = svg
//       .selectAll('g')
//       .data(edges)
//       .enter()
//       .append('path')
//       .attr('stroke', purpleRgb)
//       .attr('stroke-width', (d) => d.weight)
//       .attr('id', function (_, i) {
//         return 'linkId_' + i;
//       })
//       // eslint-disable-next-line no-restricted-globals,@typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       // eslint-disable-next-line no-restricted-globals
//       .attr('marker-end', (_) => `url(${new URL(`#arrow-end`, location)})`)
//       .style('fill', 'none');

//     const edgeText = svg
//       .append('svg:g')
//       .selectAll('g.linklabelholder')
//       .data(edges);

//     edgeText
//       .enter()
//       .append('g')
//       .attr('class', 'linklabelholder')
//       .append('text')
//       .attr('class', 'linklabel')
//       .style('font-size', '12px')
//       .style('font-weight', 'bold')
//       .attr('x', '70')
//       .attr('dy', '-5')
//       .attr('startOffset', '50%')
//       .attr('text-anchor', 'middle')
//       .style('fill', purpleRgb)
//       .append('textPath')
//       .attr('xlink:href', function (_, i) {
//         return '#linkId_' + i;
//       })
//       .text(function (d) {
//         return d.connectionType;
//       });

//     svg
//       .append('defs')
//       .selectAll('marker')
//       .data(['end'])
//       .join('marker')
//       .attr('id', (d) => `arrow-${d}`)
//       .attr('viewBox', '0 -5 10 10')
//       .attr('refX', 15)
//       .attr('refY', 0)
//       .attr('markerWidth', 9)
//       .attr('markerHeight', 9)
//       .attr('orient', 'auto')
//       .append('path')
//       .attr('fill', purpleRgb)
//       .attr('d', 'M0, -5L10, 0L0, 5');

//     const node = svg
//       .selectAll('circle')
//       .data(nodes)
//       .enter()
//       .append('circle')
//       .attr('r', 22) // radius field, so width and height 80X80
//       .attr('stroke', '#F0F0F0')
//       .attr('stroke-width', 1.5)
//       .style('fill', 'lightgray')
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       .call(
//         handler
//           .on('start', dragstarted)
//           .on('drag', dragged)
//           .on('end', dragended)
//       );

//     // node inner text
//     const textContainer = svg
//       .selectAll('g.label')
//       .data(nodes)
//       .enter()
//       .append('g');

//     textContainer
//       .append('text')
//       .text((d) => d.id)
//       .attr('font-size', 12)
//       .attr('z-index', 9999999)
//       .attr('transform', () => `translate(${-29}, ${0})`);

//     // node metadata, show on hover.
//     const card = svg
//       .append('g')
//       .attr('pointer-events', 'none')
//       .attr('display', 'none');

//     const cardBackground = card
//       .append('rect')
//       .attr('width', 250)
//       .attr('height', 100)
//       .attr('fill', '#eee')
//       .attr('stroke', '#333')
//       .attr('rx', 5);

//     const cardTextName = card
//       .append('text')
//       .attr('transform', 'translate(8, 20)');

//     const cardTextPosition = card
//       .append('text')
//       .attr('font-size', '10')
//       .attr('transform', 'translate(10, 35)');

//     const cardPkTextPosition = card
//       .append('text')
//       .attr('font-size', '10')
//       .attr('transform', 'translate(10, 50)');

//     const cardFkTextPosition = card
//       .append('text')
//       .attr('font-size', '10')
//       .attr('transform', 'translate(10, 65)');

//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//     let currentTarget;

//     node.on('mouseout', () => {
//       /**
//        * When the mouse is moved off a node, hide the card.
//        */
//       card.attr('display', 'none');
//       currentTarget = null;
//     });

//     node.on('mouseover', onMouseOverFunc);

//     function onMouseOverFunc(event: any, d: any) {
//       /**
//        * On mouse over any node, draw the tooltip in that place.
//        */
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       currentTarget = event.target;
//       card.attr('display', 'block');

//       /**
//        * Set the desired fields in the text area.
//        */
//       cardTextName.text(d.class);
//       cardTextPosition.text(d.id);
//       cardPkTextPosition.text(`pk: ${d.pk}`);
//       cardFkTextPosition.text(`fk: ${d.fk}`);

//       /**
//        * Automatically size the card to the widest of: the personnel name, personnel role.
//        */
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       const nameWidth = cardTextName.node().getBBox().width;
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       const positionWidth = cardTextPosition.node().getBBox().width;
//       const cardWidth = Math.max(nameWidth, positionWidth);

//       cardBackground.attr('width', cardWidth + 16);

//       simulation.alphaTarget(0).restart();
//     }

//     const lineGenerator = line().curve(curveCardinal);

//     function ticked() {
//       textContainer.attr('transform', function (d: any) {
//         return `translate(${d.x}, ${d.y})`;
//       });

//       node
//         .attr('cx', function (d: any) {
//           return d.x;
//         })
//         .attr('cy', function (d: any) {
//           return d.y;
//         });

//       edge.attr('d', function (d: any) {
//         const x1 = d.source.x;
//         const y1 = d.source.y;
//         let x2 = d.target.x;
//         let y2 = d.target.y;

//         // node pointing with self pointing edge
//         if (x1 === x2 && y1 === y2) {
//           const dx = x2 - x1,
//             dy = y2 - y1,
//             dr = Math.sqrt(dx * dx + dy * dy);

//           // Defaults for normal edge.
//           let drx = dr;
//           let dry = dr;

//           const xRotation = 0; // degrees
//           const largeArc = 1; // needs to be 1
//           const sweep = 1; // 1 or 0, Change sweep to change orientation of loop.

//           // Make drx and dry different to get an ellipse
//           // instead of a circle.
//           drx = 40;
//           dry = 15;

//           // For whatever reason the arc collapses to a point if the beginning
//           // and ending points of the arc are the same, so kludge it.
//           x2 = x2 + 1;
//           y2 = y2 + 1;
//           // todo fix the path so it will be adjust to the arrow
//           return (
//             'M' +
//             x1 +
//             ',' +
//             y1 +
//             'A' +
//             drx +
//             ',' +
//             dry +
//             ' ' +
//             xRotation +
//             ',' +
//             largeArc +
//             ',' +
//             sweep +
//             ' ' +
//             x2 +
//             ',' +
//             y2
//           );
//         } else {
//           // for applying the curve in our line (edge)
//           const mid = [
//             (d.source.x + d.target.x) / 2,
//             (d.source.y + d.target.y) / 2,
//           ];

//           // const index = d.overlap;
//           const distance = Math.sqrt(
//             Math.pow(d.target.x - d.source.x, 2) +
//               Math.pow(d.target.y - d.source.y, 2)
//           );

//           /**
//            * The math below finds a point just off the center of the line.
//            */
//           const slopeX = (d.target.x - d.source.x) / distance;
//           const slopeY = (d.target.y - d.source.y) / distance;

//           const curveSharpness = d.overlap * 10; // should be derived for the number of overlapping connections.

//           mid[0] += curveSharpness * slopeY;
//           mid[1] -= curveSharpness * slopeX;

//           /**
//            * Generate the line from node A to node B.
//            */

//           // return `M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`;

//           return lineGenerator([
//             [d.source.x, d.source.y],
//             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//             // @ts-ignore
//             mid,
//             [d.target.x, d.target.y],
//           ]);
//         }
//       });

//       edgeText
//         .attr('x', function (d: any) {
//           return d.x;
//         })
//         .attr('y', function (d: any) {
//           return d.y;
//         });

//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       if (currentTarget) {
//         /**
//          * Determine the position of whatever is being hovered over, and if it's a Node, move a hovercard there.
//          */
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-ignore
//         const dist = currentTarget.r.baseVal.value + 3;
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-ignore
//         const xPos = currentTarget.cx.baseVal.value + dist + 5;
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-ignore
//         const yPos = currentTarget.cy.baseVal.value - dist + 35;

//         card.attr('transform', `translate(${xPos}, ${yPos})`);
//       }
//     }

//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//     simulation.nodes(nodes).on('tick', ticked);

//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//   }, [d3Container.current]);

//   return (
//     <Box
//       sx={{ overflow: 'auto', width: '100%' }}
//       display="flex"
//       justifyContent="center"
//       alignItems="center"
//     >
//       <svg height={'800'} width={'100%'} id="Target" />
//     </Box>
//   );
// }

// export default React.memo(ErdGraph);

export interface Node {
  title: string;
  description: string;
  cx: number;
  cy: number;
  r: number;
}