import React, { Component, Fragment } from 'react';
import GoogleMapReact from 'google-map-react';
import {Switch} from '@material-ui/core';

import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import {Add, LocalHospital, Healing, Close, FlightLand, People, PersonPin, CheckCircleOutline, CancelOutlined} from '@material-ui/icons';

import ClientMarker from './ClientMarker'

import CaseLocationJson from '../../Config/CaseLocation.json';
import CasesDetailsJson from '../../Config/CasesDetails.json';
import './Map.css';

const options = [
		'Client Status',
		'Case Classification'
  ]
class Map extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      CasesDetails: [],
      CasesLocationDetails: [],
	  filterType: "status",
	  anchorEl: null,
    selectedIndex: 0,
    ClientStatusFilterConfig:{
      discharged: false, //Set Default as false to enhance prefomance 
      hospitalised: true,
      critical: true,
      deceased: true
    },
    ClientCaseClassificationFilterConfig:{
      imported: false, //Set Default as false to enhance prefomance 
      localCloseContact: true,
      localPossibly: true,
      localPossiblyCloseContact: true,
      local: true
    },
    clientInfobox: {
      case_no: 0,
      confirmation_date: "N/A",
      gender: "N/A",
      age: "N/A",
      hospital_en: "N/A",
      status_en: "N/A",
      type_en: "N/A",
      classification_en: "N/A"
    },
	  isShowMap: true
    };
  }
  componentWillMount(){
    console.log("componentWillMount()")
    let CasesDetails = []
    CasesDetailsJson.map((data)=>{
      CasesDetails.push(data)
    })
    let CasesLocationDetails = []
    CaseLocationJson.map((data)=>{
      CasesLocationDetails.push(data)
    })
    this.setState({CasesDetails: CasesDetails, CasesLocationDetails: CasesLocationDetails})
  }
  static defaultProps = {
    center: {
      lat: 22.37,
      lng: 114.1
    },
    zoom: 11
  };
	handleClickListItem = (event) => {
		this.setState({anchorEl: event.currentTarget})
	};
	handleMenuItemClick = (event, index) => {
		this.setState({anchorEl: null, selectedIndex: index})
	};

	handleClose = () => {
		this.setState({anchorEl: null})
	};
  toggleMarker(case_no){
    console.log("Marker "+case_no+" is pressed")
  }
  toggleFilter(filterNo, itemName, prevFlag){
    /*
    filterNo:
      0 = ClientStatus, clientDetail.status = [discharged, hospitalised:(hospitalised/hospitalised_again), critical:(critical/serious), deceased]
      1 = Case Classification =[imported, local_close_contact, local_possibly, local_possibly_close_contact, local]
    */
    if (filterNo == 0){
      var config = this.state.ClientStatusFilterConfig
      if (itemName == 'discharged'){
        config.discharged = !prevFlag
        this.setState({ClientStatusFilterConfig: config})
      }
      else if (itemName == 'hospitalised'){
        config.hospitalised = !prevFlag
        this.setState({ClientStatusFilterConfig: config})
      }
      else if (itemName == 'critical'){
        config.critical = !prevFlag
        this.setState({ClientStatusFilterConfig: config})
      }
      else if (itemName == 'deceased'){
        config.deceased = !prevFlag
        this.setState({ClientStatusFilterConfig: config})
      }
    }
    else if (filterNo == 1){
      var config = this.state.ClientCaseClassificationFilterConfig
      if (itemName == 'imported'){
        config.imported = !prevFlag
        this.setState({ClientCaseClassificationFilterConfig: config})
      }
      else if (itemName == 'localCloseContact'){
        config.localCloseContact = !prevFlag
        this.setState({ClientCaseClassificationFilterConfig: config})
      }
      else if (itemName == 'localPossibly'){
        config.localPossibly = !prevFlag
        this.setState({ClientCaseClassificationFilterConfig: config})
      }
      else if (itemName == 'localPossiblyCloseContact'){
        config.localPossiblyCloseContact = !prevFlag
        this.setState({ClientCaseClassificationFilterConfig: config})
      }
      else if (itemName == 'local'){
        config.local = !prevFlag
        this.setState({ClientCaseClassificationFilterConfig: config})
      }
    }
  }
  toggleShowMap(){
    this.setState({isShowMap: !this.state.isShowMap})
  }
  updateClientInfobox(clientDetail){
    console.log("updateClientInfobox")
    var newClientInfo = {
      case_no: clientDetail.case_no,
      confirmation_date: clientDetail.confirmation_date,
      gender: clientDetail.gender,
      age: clientDetail.age,
      hospital_en: clientDetail.hospital_en,
      status_en: clientDetail.status_en,
      type_en: clientDetail.type_en,
      classification_en: clientDetail.classification_en
    }
    this.setState({clientInfobox: newClientInfo})
  }
  AnyReactComponent = ({ text, data, clientDetail }) => {
	const {filterType, selectedIndex, ClientStatusFilterConfig, ClientCaseClassificationFilterConfig} = this.state
    var markerColour='#ffffff';
    if (clientDetail!=null){

      //console.log(data.case_no+": "+ clientStatus+", "+markerColour)
      if (clientDetail.status!=null){
      return(
        <div>
          <a onClick={()=>this.updateClientInfobox(clientDetail)}>
			      <ClientMarker generatedBy={selectedIndex} clientStatus = {clientDetail.status} clientClassification = {clientDetail.classification} ClientStatusFilterConfig={ClientStatusFilterConfig} ClientCaseClassificationFilterConfig={ClientCaseClassificationFilterConfig} />
          </a>
        </div>
      )
      }
    }
    return null;
  }
  MapKey = ({selectedIndex}) => {
	if (selectedIndex == 0){
		return(
			<table>
        <tr>
          <td>
            <IconButton style={{ padding: '1px',backgroundColor: '#00ff00'}}>
              <Healing style={{fontSize: 16}}/>
            </IconButton>
          </td>
          <td>
            Discharged
          </td>
          <td>
            <Switch
                checked={this.state.ClientStatusFilterConfig.discharged}
                onChange={()=>this.toggleFilter(selectedIndex, 'discharged', this.state.ClientStatusFilterConfig.discharged)}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
          </td>
        </tr>
        <tr>
          <td>
            <IconButton style={{ padding: '1px',backgroundColor: '#ff7575'}}>
              <LocalHospital style={{fontSize: 16}}/>
            </IconButton>
          </td>
          <td>
            Hospitalised
          </td>
          <td>
            <Switch
                checked={this.state.ClientStatusFilterConfig.hospitalised}
                onChange={()=>this.toggleFilter(selectedIndex, 'hospitalised', this.state.ClientStatusFilterConfig.hospitalised)}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
          </td>
        </tr>
        <tr>
          <td>
            <IconButton style={{ padding: '1px',backgroundColor: '#ff0000'}}>
              <LocalHospital style={{fontSize: 16}}/>
            </IconButton>
          </td>
          <td>
            Critical
          </td>
          <td>
            <Switch
                checked={this.state.ClientStatusFilterConfig.critical}
                onChange={()=>this.toggleFilter(selectedIndex, 'critical', this.state.ClientStatusFilterConfig.critical)}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
          </td>
        </tr>
        <tr>
          <td>
            <IconButton style={{ padding: '1px',backgroundColor: '#545454'}}>
              <Close style={{fontSize: 16}}/>
            </IconButton>
          </td>
          <td>
            Deceased
          </td>
          <td>
            <Switch
                checked={this.state.ClientStatusFilterConfig.deceased}
                onChange={()=>this.toggleFilter(selectedIndex, 'deceased', this.state.ClientStatusFilterConfig.deceased)}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
          </td>
        </tr>
			</table>
		)
	}
	else if (selectedIndex == 1){
		const confirmedColour = '#1c7800'
		const possiblyColour = '#545454'
		return(
			<table>
        <tr>
          <td>
					<IconButton style={{ padding: '1px',backgroundColor: confirmedColour}}>
					  <FlightLand style={{fontSize: 16}}/>
					</IconButton>
          </td>
          <td>
				  	Imported
				  </td>
          <td>
            <Switch
                checked={this.state.ClientCaseClassificationFilterConfig.imported}
                onChange={()=>{this.toggleFilter(selectedIndex, 'imported', true)}}
                name="importedSwitch"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
          </td>
        </tr>
        <tr>
          <td>
            <IconButton style={{ padding: '1px',backgroundColor: confirmedColour}}>
              <PersonPin style={{fontSize: 16}}/>
            </IconButton>
				  </td>
          <td>
					  Local
				  </td>
          <td>
            <Switch
              checked={this.state.ClientCaseClassificationFilterConfig.local}
              onChange={()=>this.toggleFilter(selectedIndex, 'local', this.state.ClientCaseClassificationFilterConfig.local)}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          </td>
        </tr>
        <tr>
          <td>
            <IconButton style={{ padding: '1px',backgroundColor: confirmedColour}}>
              <People style={{fontSize: 16}}/>
            </IconButton>
				  </td>
          <td>
					  Local Close Contact
				  </td>
          <td>
            <Switch
              checked={this.state.ClientCaseClassificationFilterConfig.localCloseContact}
              onChange={()=>this.toggleFilter(selectedIndex, 'localCloseContact', this.state.ClientCaseClassificationFilterConfig.localCloseContact)}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          </td>
        </tr>
        <tr>
          <td>
            <IconButton style={{ padding: '1px',backgroundColor: possiblyColour}}>
              <PersonPin style={{fontSize: 16}}/>
            </IconButton>
				  </td>
          <td>
            Possibly Local
          </td>
          <td>
            <Switch
              checked={this.state.ClientCaseClassificationFilterConfig.localPossibly}
              onChange={()=>this.toggleFilter(selectedIndex, 'localPossibly', this.state.ClientCaseClassificationFilterConfig.localPossibly)}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          </td>
        </tr>
        <tr>
          <td>
            <IconButton style={{ padding: '1px',backgroundColor: possiblyColour}}>
              <People style={{fontSize: 16}}/>
            </IconButton>
				  </td>
          <td>
					  Possibly Local Close Contact
				  </td>
          <td>
            <Switch
              checked={this.state.ClientCaseClassificationFilterConfig.localPossiblyCloseContact}
              onChange={()=>this.toggleFilter(selectedIndex, 'localPossiblyCloseContact', this.state.ClientCaseClassificationFilterConfig.localPossiblyCloseContact)}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          </td>
        </tr>
			</table>
		)
	}
	return null
  }
  getClientDetail = (case_no)=>{
    var detail = null
    this.state.CasesDetails.map(v=> {
      if (v.case_no == case_no){
        detail =  v
      }
    }
    )
    return detail
    //console.log(caseDetail);
    //return caseDetail.status
  }
  List = () =>{
    const AnyReactComponent = this.AnyReactComponent
    const {selectedIndex, ClientStatusFilterConfig, ClientCaseClassificationFilterConfig} = this.state
    console.log("Client List: ")
    var count = 0;
    var DotList = this.state.CasesLocationDetails.map((data)=>{
      count++;
      if ((data.action_en=="Residence" || data.action_en=="Accommodation") && data.case_no!=null){
        console.log(data.case_no+": "+data.lat+", "+data.lng)
        var clientDetail = this.getClientDetail(data.case_no)
        var isGenerateComponment = false
        if (clientDetail!=null){
          if (selectedIndex == 0){
            let clientStatus = clientDetail.status
            if(clientStatus == "discharged" && ClientStatusFilterConfig.discharged){
              isGenerateComponment = true
            }
            else if ((clientStatus == "hospitalised" || clientStatus == "hospitalised_again") && ClientStatusFilterConfig.hospitalised ){
              isGenerateComponment = true
            }
            else if (clientStatus == "deceased" && ClientStatusFilterConfig.deceased){
              isGenerateComponment = true
            }
            else if ((clientStatus == "critical" || clientStatus == "serious") && ClientStatusFilterConfig.critical){
              isGenerateComponment = true
            }
          }
          else if (selectedIndex == 1){
            let clientClassification = clientDetail.classification
            if(clientClassification == "imported"  && ClientCaseClassificationFilterConfig.imported){
              isGenerateComponment = true
            }
            else if (clientClassification == "local_close_contact" && ClientCaseClassificationFilterConfig.localCloseContact){
              isGenerateComponment = true
            }
            else if (clientClassification == "local_possibly" && ClientCaseClassificationFilterConfig.localPossibly){
              isGenerateComponment = true
            }
            else if (clientClassification == "local_possibly_close_contact" && ClientCaseClassificationFilterConfig.localPossiblyCloseContact){
              isGenerateComponment = true
            }
            else if (clientClassification == "local" && ClientCaseClassificationFilterConfig.local){
              isGenerateComponment = true
            }
          }

        }
        if (isGenerateComponment){
          return(
            <AnyReactComponent
              lat={data.lat}
              lng={data.lng}
              text={data.case_no}
              case_no={data.case_no}
              data={data}
              clientDetail={clientDetail}
              //onClick={this.toggleMarker(data.case_no)}
            />
          )
        }
        return null
      }
      
    })
    console.log("count: "+count)
    return DotList
  }
  render() {
    const AnyReactComponent = this.AnyReactComponent
	const {anchorEl, selectedIndex, clientInfobox, isShowMap} = this.state
    return (
      // Important! Always set the container height explicitly
      <div >
        {isShowMap?(
          <div style={{ height: '80vh', width: '100%' }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyAd5lEr3jOvC2knuxINRDIznu6xWEVsfcw' }}
                defaultCenter={this.props.center}
                defaultZoom={this.props.zoom}
              >
            {
              this.List()
            }
          </GoogleMapReact>

		    </div>
        ):null}
		
		<Grid container style = {{flexGrow: 1}}spacing={1}>
			<Grid item xs={2} style={{width: 100}}>
				<List component="nav" aria-label="Device settings">
					<ListItem
					  button
					  aria-haspopup="true"
					  aria-controls="lock-menu"
					  aria-label="when device is locked"
					  onClick={this.handleClickListItem}
					>
						<ListItemText primary="Filter by:" secondary={options[selectedIndex]} />
					</ListItem>
				</List>
				<Menu
					id="lock-menu"
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={this.handleClose}
					PaperProps={{
					  style: {
						maxHeight: 100,
						width: '20ch',
					  },
					}}
				>
					{options.map((option, index) => (
					  <MenuItem
						key={option}
						selected={index === selectedIndex}
						onClick={(event) => this.handleMenuItemClick(event, index)}
					  >
						{option}
					  </MenuItem>
					))}
				</Menu>
			</Grid>
			<Grid item xs={2}>
			  <this.MapKey selectedIndex = {selectedIndex}/>
			</Grid>
			<Grid item xs={1}>
        {clientInfobox.case_no}
			</Grid>
			<Grid item xs={7}>
        <Grid container item xs={12} spacing={1}> 
          <Grid item xs={2}>
            Gender: 
          </Grid>
          <Grid item xs={4}>
            {clientInfobox.gender}
          </Grid>
          <Grid item xs={2}>
            Age: 
          </Grid>
          <Grid item xs={4}>
            {clientInfobox.age}
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={1}> 
          <Grid item xs={2}>
            Hospital:
          </Grid>
          <Grid item xs={4}>
            {clientInfobox.hospital_en}
          </Grid>
          <Grid item xs={2}>
            Confirmation Date:
          </Grid>
          <Grid item xs={4}>
            {clientInfobox.confirmation_date}
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={1}> 
          <Grid item xs={2}>
            Status: 
          </Grid>
          <Grid item xs={4}>
            {clientInfobox.status_en}
          </Grid>
          <Grid item xs={2}>
            Client Type: 
          </Grid>
          <Grid item xs={4}>
            {clientInfobox.type_en}
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={1}> 
          <Grid item xs={2}>
            Classification:
          </Grid>
          <Grid item xs={4}>
            {clientInfobox.classification_en}
          </Grid>
        </Grid>
        {/*
      <Fragment>
              <tr>
                <td>{clientInfobox.case_no}</td>
              </tr>
              <tr>
                <td>Confirmation Date:</td>
                <td>{clientInfobox.confirmation_date}</td>
                <td>Gender: </td>
                <td>{clientInfobox.gender}</td>
              </tr>
              <tr>
                <td>Age: </td>
                <td>{clientInfobox.age}</td>
                <td>Hospital: </td>
                <td>{clientInfobox.hospital_en}</td>
              </tr>
              <tr>
                <td>Status: </td>
                <td>{clientInfobox.status_en}</td>
                <td>Client Type: </td>
                <td>{clientInfobox.type_en}</td>
              </tr>
              <tr>
                <td>Classification: </td>
                <td>{clientInfobox.classification_en}</td>
              </tr>
          </Fragment>
  */}
			</Grid>
		</Grid>
        <Switch
            checked={this.state.isShowMap}
            onChange={()=> this.toggleShowMap()}
            name="ShowMap"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
      </div>
    );
  }
}

export default Map;