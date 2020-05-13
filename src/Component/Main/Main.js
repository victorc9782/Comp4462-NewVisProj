import React, { Component } from 'react';
import NavBar, { ElementsWrapper } from 'react-scrolling-nav';

import Map from '../Map/Map'
import NodeDiagram from '../NodeDiagram/NodeDiagram';
import TimeBlock from '../TimeBlock/TimeBlock';

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
      label: "Timeblock Diagram", //The name to be updated/ refined
      target: "timeblock"
  }, {
      label: "Item 4",
      target: "item-4"
  }, {
      label: "Item 5",
      target: "item-5"
  }, {
      label: "Item 6",
      target: "item-6"
  }, ]
    return (
      // Important! Always set the container height explicitly
      <div>
        <div className="container">
        <ElementsWrapper items={navbarItems}>
            <div name="map" className="item" style={{maxHeight: "300"}}>
              <Map/>
            </div>
            <div name="nodediagram" className="item">
              <NodeDiagram/>
            </div>
            <div name="timeblock" className="item">
              <TimeBlock/>
            </div>
            <div name="item-4" className="item">item 4</div>
            <div name="item-5" className="item">item 5</div>
            <div name="item-6" className="item">item 6</div>
        </ElementsWrapper>
        </div>
        
        
        <NavBar items={navbarItems} offset={-80} duration={500} delay={0} navWidth={160}>
        </NavBar>
      </div>
      /*
      <div style={{ height: '100vh', width: '100%' }}>
       <Map/>
      </div>
      */
    );
  }
}

export default Main;