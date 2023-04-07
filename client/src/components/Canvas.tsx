import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

interface Node {
    title: string;
    description: string;
    cx: number;
    cy: number;
    r: number;
}

interface IProps {
    data?: Node[];
}

const Canvas: React.FC<{ props: IProps }> = ({ props }) => {
    const d3Container = useRef(null);

    function dragstarted() {
      d3.select(this).raise();
      g.attr("cursor", "grabbing");
    }

    function dragged(event, d) {
      d3.select(this).attr("cx", d.x = event.x).attr("cy", d.y = event.y);
    }
    
    function dragended() {
      g.attr("cursor", "grab");
    }
    
    function zoomed({transform}) {
      g.attr("transform", transform);
    }
    
    useEffect(
        () => {
            if (props.data && d3Container.current) {
                const svg = d3.select(d3Container.current);

                // Bind D3 data
                const update = svg.append("g")
                    .attr("cursor", "grab");

                // Enter new D3 elements
                update.selectAll("circle")
                    .data(props.data)
                    .join("circle")
                        .attr("cx", ({cx}) => cx)
                        .attr("cy", ({cy}) => cy)
                        .attr("r", ({r}) => r * 2)
                        .attr("fill", (d, i) => d3.interpolateRainbow(i / 120))
                        .call(d3.drag()
                            .on("start", dragstarted(d3, g))
                            .on("drag", dragged(d3))
                            .on("end", dragended(d3)));

                
                // // Update existing D3 elements
                // update
                //     .attr('x', (d, i) => i * 40)
                //     .text((d: number) => d);

                // // Remove old D3 elements
                // update.exit()
                //     .remove();
            }
        },

        [props.data, d3Container.current])

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
