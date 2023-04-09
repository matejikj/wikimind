import * as d3 from "d3";
import { drag } from "d3-drag";
import { click } from "@testing-library/user-event/dist/click";
import { zoom } from 'd3-zoom';

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