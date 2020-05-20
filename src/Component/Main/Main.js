import React, { Component } from 'react';
import NavBar, { ElementsWrapper } from 'react-scrolling-nav';

import Map from '../Map/Map'
import NodeDiagram from '../NodeDiagram/NodeDiagram';
import HeatMap from '../HeatMap/HeatMap';
import './Main.css';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class Main extends Component {
  render() {
    const navbarItems = [{
      label: "Map",
      target: "map"
  }, {
      label: "Node Diagram",
      target: "nodediagram"
  }, {
      label: "Heat Map Diagram", //The name to be updated/ refined
      target: "HeatMap"
  },]
    return (
      // Important! Always set the container height explicitly
      <div>
        <div className="container">
        <ElementsWrapper items={navbarItems} style={{maxHeight: "300"}}>
            <div name="map" className="item">
              <Map/>
            </div>
            <div name="nodediagram" className="item">
              <NodeDiagram/>
            </div>
            <div name="HeatMap" className="item">
              <HeatMap/>
            </div>
        </ElementsWrapper>
        </div>
        
        
        <NavBar items={navbarItems} offset={-80} duration={500} delay={0} navWidth={175} coverWidth={0}>
        </NavBar>
      </div>
    );
  }
}

export default Main;