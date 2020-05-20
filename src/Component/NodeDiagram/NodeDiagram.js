import React, {Component} from 'react';
import data from '../../Config/CaseRelationship.json';
import { ForceGraph } from "./ForceGraph";


function NodeDiagram() {
  const nodeHoverTooltip = React.useCallback((node) => {
    
    const renderNode = (node) => {
      if(typeof(node.id) === 'number'){
        return (
          `<div>
          <b>#${node.case_no}</b><br>
          <b>${node.age}&nbsp;${gender(node)}</b><br>
          <b>${node.classification_en}<br>
          <b>Onset Date: ${node.onset_date}<br>
          <b>Confirmed Date: ${node.confirmation_date}<br>
          <b>Status: ${node.status}<br>
          </div>`
        );
      }
      else{
        if (node.remarks != null){
          return(
            `<div>     
            <b>Group</b><br>
            ${node.id}<br>${node.remarks}
            </div>`
          );
        }
        else{
          return(
          `<div>     
          <b>Group</b><br>
          ${node.id}
          </div>`
        );
        }
      }
    }
    const gender = (node) => {
      if (node.gender === 'M')
        return "Male";
      else if (node.gender === 'F')
        return "Female";
      else return null;
    }
    return renderNode(node)});

  return (
    <div className="App">

      <div className="Main" style={{height: '100%'}}>
        <h1>Node Diagram of Coronavirus Cluster Groups in Hong Kong</h1>
        <ForceGraph linksData={data.links} nodesData={data.nodes} nodeHoverTooltip={nodeHoverTooltip} />
      </div>
    </div>
  );
}

export default NodeDiagram;
