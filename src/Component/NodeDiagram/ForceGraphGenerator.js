import * as d3 from "d3";
import "@fortawesome/fontawesome-free/css/all.min.css";
import styles from "./ForceGraph.module.css";

export function runForceGraph(
  container,
  linksData,
  nodesData,
  nodeHoverTooltip
) {
  const links = linksData.map((d) => Object.assign({}, d));
  const nodes = nodesData.map((d) => Object.assign({}, d));

  const containerRect = container.getBoundingClientRect();
  const height = containerRect.height;
  const width = containerRect.width;
  console.log('width');
  console.log(containerRect.width);
  console.log('height');
  console.log(containerRect.height);

  const color = (d) => { 
    if(d.status === "discharged"){
      return "#1a9641";
    }
    else if(d.status === "hospitalised"){
      return "#d7191c";
    }
    else if(d.status === "deceased"){
      return "#404040";
    }
    else return "#0571b0";
  };

  const icon = (d) => {
    if(d.gender === "M")
      return "\uf222";
    else if(d.gender === "F")
      return "\uf221";
    else if(d.id === "Diamond Princess Cruise Ship")
      return "\uf21a";
    else if(d.id === "Hotpot dinner gathering at Kwun Tong")
      return "\uf06d";
    else if(d.id === "Wan Chai Hung Fook Building" || d.id === "Causeway Lai Chi Building" || d.id === "Wan Chai Central Building" || d.id === "Sha Tin Wo Che Estate Tai Wo House")
      return "\uf2e7";
    else if(d.id === "Fook Wai Ching Che in Maylun Apartments in North Point")
      return "\uf6a7";
    else if(d.id === "Travel tour to Egypt / Heng Tai House of Fu Heng Estate")
      return "\uf072";
    else if(d.id === "Wedding party at Lantau Island")
      return "\uf004";
    else if(d.id === "Bar and band cluster") 
      return "\uf5ce";
    else if(d.id === "Insomnia" || d.id === "Centre Stage" || d.id === "All Night Long" || d.id === "Dusk Till Dawn")
      return "\uf0fc";
    else return null;
  }
  
  const id = (d) =>{
    return d.id;
  }
  
  const getClass = (d) => {
    if(d.gender === "M")
      return styles.M;
    else if(d.gender === "F")
      return styles.F;
    else return styles.icon;
  };

  const drag = (simulation) => {
    const dragstarted = (d) => {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (d) => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    };

    const dragended = (d) => {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  // Add the tooltip element to the graph
  const tooltip = document.querySelector("#graph-tooltip");
  if (!tooltip) {
    const tooltipDiv = document.createElement("div");
    tooltipDiv.classList.add(styles.tooltip);
    tooltipDiv.style.opacity = "0";
    tooltipDiv.id = "graph-tooltip";
    document.body.appendChild(tooltipDiv);
  }
  const div = d3.select("#graph-tooltip");

  const addTooltip = (hoverTooltip, d, x, y) => {
    div
      .transition()
      .duration(200)
      .style("opacity", 0.9);
    div
      .html(hoverTooltip(d))
      .style("left", `${x}px`)
      .style("top", `${y - 30}px`);
  };

  const removeTooltip = () => {
    div
      .transition()
      .duration(200)
      .style("opacity", 0);
  };

  const simulation = d3
    .forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id))
    .force("link", d3.forceLink(links).distance(25))
    .force("charge", d3.forceManyBody().strength(-87.5))
    .force("x", d3.forceX(0))
    .force("y", d3.forceY(30).strength(0.1));


  const svg = d3
    .select(container)
    .append("svg")
    .attr("width",'100%')
    .attr("height", '100%')
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", [-(width - 200) / 2, -(height - 200)/ 2, width - 200, height - 200])
    .call(d3.zoom().on("zoom", function () {
      svg.attr("transform", d3.event.transform);
    }));

  const link = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", d => Math.sqrt(d.value));

  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 14)
    .attr("fill", color)
    .call(drag(simulation));

  const label = svg.append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr('font-family', 'Roboto')
    .attr("class", d => `fa ${getClass(d)}`)
    .text(d => {return icon(d)})
    .call(drag(simulation));

  label.on("mouseover", (d) => {
    addTooltip(nodeHoverTooltip, d, d3.event.pageX, d3.event.pageY);
  })
    .on("mouseout", () => {
      removeTooltip();
    });

  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
    label
      .attr("x", d => { return d.x; })
      .attr("y", d => { return d.y; })
  });

  return {
    destroy: () => {
      simulation.stop();
    },
    nodes: () => {
      return svg.node();
    }
  };
}
