import * as d3 from "d3";
import { drag } from "d3-drag";
import { click } from "@testing-library/user-event/dist/click";
import { zoom } from 'd3-zoom';
import styles from "./Menu.module.css";
import { IAction } from "../models/types/types";

let menuItems: IAction[] = [
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

export const menuFactory = (x: any, y: any, data: any, svgId: any) => {
  d3.select('.contextMenu').remove();

  // Draw the menu
  svgId
    .append('g').attr('class', "contextMenu")
    .selectAll('tmp')
    .data(menuItems).enter()
    .append('g').attr('class', "menuEntry")
    // .style({ 'cursor': 'pointer' });
  // Draw menu entries
  d3.selectAll(".menuEntry")
    .append('rect')
    .attr('x', x)
    .attr('y', (d, i) => { return y + (i * 30); })
    .attr('rx', 2)
    .attr('width', 150)
    .attr('fill', 'green')
    .attr('height', 30)
    .on('click', (d: any, i: any) => { (i as IAction).action((i as IAction).title) });

    d3.selectAll(".menuEntry")
    .append('text')
    .text((d, i) => { return (d as IAction).title })
    .attr('x', x)
    .attr('y', (d, i) => { return y + (i * 30); })
    .attr('dy', 20)
    .attr('dx', 45)
    .on('click', (d: any, i: any) => { (i as IAction).action((i as IAction).title) });

  // Other interactions
  d3.select('body')
    .on('click', () => {
      d3.select('.contextMenu').remove();
    });
}

export const createContextMenu = (d: any, svgId: any) => {
  menuFactory(d.offsetX, d.offsetY, d, svgId);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore


  d.preventDefault();
}