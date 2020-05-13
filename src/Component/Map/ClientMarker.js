import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import {Add, LocalHospital, Healing, Close, FlightLand, People, PersonPin} from '@material-ui/icons';

const confirmedColour = '#1c7800'
const possiblyColour = '#545454'

 function ClientMarkByClassification({clientClassification}){
	 console.log("clientClassification: "+clientClassification)
	 if (clientClassification!=null){
      if(clientClassification == "imported"){
        return(
        <IconButton style={{ padding: '1px',backgroundColor: confirmedColour}}>
          <FlightLand style={{fontSize: 16}}/>
        </IconButton>
        )
      }
	  else if (clientClassification == "local_close_contact"){
        return(
        <IconButton style={{ padding: '1px',backgroundColor: confirmedColour}}>
          <People style={{fontSize: 16}}/>
        </IconButton>
        )
      }
      else if (clientClassification == "local_possibly"){
        return (
		<IconButton style={{ padding: '1px',backgroundColor: possiblyColour}}>
		  <PersonPin style={{fontSize: 16}}/>
		</IconButton>
        )
      }
      else if (clientClassification == "local_possibly_close_contact"){
        return (
		<IconButton style={{ padding: '1px',backgroundColor: possiblyColour}}>
		  <People style={{fontSize: 16}}/>
		</IconButton>
        )
      }
      else if (clientClassification == "local"){
        return (
		<IconButton style={{ padding: '1px',backgroundColor: confirmedColour}}>
		  <People style={{fontSize: 16}}/>
		</IconButton>
        )
      }
	 }
	  return null
 }
 function ClientMarkByStatus({clientStatus, ClientStatusFilterConfig}){
      if(clientStatus == "discharged" && ClientStatusFilterConfig.discharged){
        return(
          <IconButton style={{ padding: '1px',backgroundColor: '#00ff00'}}>
            <Healing style={{fontSize: 16}}/>
          </IconButton>
        )
      }
      else if ((clientStatus == "hospitalised" || clientStatus == "hospitalised_again") && ClientStatusFilterConfig.hospitalised ){
        return(
          <IconButton style={{ padding: '1px',backgroundColor: '#ff7575'}}>
            <LocalHospital style={{fontSize: 16}}/>
          </IconButton>
        )
      }
      else if (clientStatus == "deceased" && ClientStatusFilterConfig.deceased){
        return (
          <IconButton style={{ padding: '1px',backgroundColor: '#545454'}}>
            <Close style={{fontSize: 16}}/>
          </IconButton>
        )
      }
      else if ((clientStatus == "critical" || clientStatus == "serious") && ClientStatusFilterConfig.critical){
        return (
          <IconButton style={{ padding: '1px',backgroundColor: '#ff0000'}}>
            <LocalHospital style={{fontSize: 16}}/>
          </IconButton>
        )
      }
      return null
 }
 function ClientMarker({generatedBy, clientStatus, clientClassification, ClientStatusFilterConfig}){
    if (generatedBy == 0){
        return <ClientMarkByStatus clientStatus ={ clientStatus} ClientStatusFilterConfig={ClientStatusFilterConfig}/>
    }
	else if (generatedBy == 1){
		return <ClientMarkByClassification clientClassification={clientClassification} />
	}
    return(
      null
    )
  }
  export default ClientMarker