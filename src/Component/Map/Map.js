import React, { Component, Fragment } from 'react';
import GoogleMapReact from 'google-map-react';
import {Switch} from '@material-ui/core';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import IconButton from '@material-ui/core/IconButton';
import {Add, LocalHospital, Healing, Close, FlightLand, People, PersonPin, CheckCircleOutline, CancelOutlined} from '@material-ui/icons';
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons'

import { withStyles } from '@material-ui/core/styles';
import ClientMarker from './ClientMarker'

import CaseLocationJson from '../../Config/CaseLocation.json';
import CasesDetailsJson from '../../Config/CasesDetails.json';
import './Map.css';

const options = [
		'Client Status',
		'Case Classification'
  ]

const styles = {
  listItemText: {
    color: 'white',
  },
}
  
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
      deceased: true,
    },
	ClientStatusFilterCount:{
	  dischargedCount: 0,
	  hospitalisedCount: 0,
	  criticalCount: 0,
	  deceasedCount: 0
	},
    ClientCaseClassificationFilterConfig:{
      imported: false, //Set Default as false to enhance prefomance 
      localCloseContact: true,
      localPossibly: true,
      localPossiblyCloseContact: true,
      local: true,
    },
	ClientCaseClassificationFilterCount:{
	  importedCount: 0,
	  localCloseContactCount:0,
	  localPossiblyCount: 0,
	  localPossiblyCloseContactCount: 0,
	  localCount:0
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
    let CasesDetails = []
    var newClientStatusFilterCount = {
      dischargedCount: 0,
      hospitalisedCount: 0,
      criticalCount: 0,
      deceasedCount: 0
    }
    var newClientCaseClassificationFilterCount = {
      importedCount: 0,
      localCloseContactCount:0,
      localPossiblyCount: 0,
      localPossiblyCloseContactCount: 0,
      localCount:0
    }
    CasesDetailsJson.map((data)=>{
      CasesDetails.push(data)
      if (data.case_no!=null){
        var clientDetail = this.getClientDetail(data.case_no)
        var clientStatus = data.status
        var  clientClassification = data.classification
        if(clientStatus === "discharged" ){
          newClientStatusFilterCount.dischargedCount = newClientStatusFilterCount.dischargedCount+1
        }
        else if ((clientStatus === "hospitalised" || clientStatus === "hospitalised_again")){
          newClientStatusFilterCount.hospitalisedCount=newClientStatusFilterCount.hospitalisedCount+1
        }
        else if (clientStatus === "deceased"){
          newClientStatusFilterCount.deceasedCount=newClientStatusFilterCount.deceasedCount+1
        }
        else if ((clientStatus === "critical" || clientStatus === "serious")){
          newClientStatusFilterCount.criticalCount++
        }

        if(clientClassification === "imported"){
          newClientCaseClassificationFilterCount.importedCount++
        }
        else if (clientClassification === "local_close_contact"){
          newClientCaseClassificationFilterCount.localCloseContactCount++
        }
        else if (clientClassification === "local_possibly"){
          newClientCaseClassificationFilterCount.localPossiblyCount++
        }
        else if (clientClassification === "local_possibly_close_contact"){
          newClientCaseClassificationFilterCount.localPossiblyCloseContactCount++
        }
        else if (clientClassification === "local"){
          newClientCaseClassificationFilterCount.localCount++
        }
      }
    })
    this.setState({ClientStatusFilterCount: newClientStatusFilterCount, ClientCaseClassificationFilterCount: newClientCaseClassificationFilterCount})
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
    if (filterNo === 0){
      var config = this.state.ClientStatusFilterConfig
      if (itemName === 'discharged'){
        config.discharged = !prevFlag
      }
      else if (itemName === 'hospitalised'){
        config.hospitalised = !prevFlag
      }
      else if (itemName === 'critical'){
        config.critical = !prevFlag
      }
      else if (itemName === 'deceased'){
        config.deceased = !prevFlag
      }
      this.setState({ClientStatusFilterConfig: config})
    }
    else if (filterNo === 1){
      var config = this.state.ClientCaseClassificationFilterConfig
      if (itemName === 'imported'){
        config.imported = !prevFlag
      }
      else if (itemName === 'localCloseContact'){
        config.localCloseContact = !prevFlag
      }
      else if (itemName === 'localPossibly'){
        config.localPossibly = !prevFlag
      }
      else if (itemName === 'localPossiblyCloseContact'){
        config.localPossiblyCloseContact = !prevFlag
      }
      else if (itemName === 'local'){
        config.local = !prevFlag
      }
      this.setState({ClientCaseClassificationFilterConfig: config})
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
	if (selectedIndex === 0){
    const {ClientStatusFilterCount} = this.state
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
          <td>
            {ClientStatusFilterCount.dischargedCount}
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
          <td>
            {ClientStatusFilterCount.hospitalisedCount}
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
          <td>
            {ClientStatusFilterCount.criticalCount}
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
          <td>
            {ClientStatusFilterCount.deceasedCount}
          </td>
        </tr>
			</table>
		)
	}
	else if (selectedIndex === 1){
		const confirmedColour = '#1c7800'
		const possiblyColour = '#545454'
    const {ClientCaseClassificationFilterCount} = this.state
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
                onChange={()=>{this.toggleFilter(selectedIndex, 'imported', this.state.ClientCaseClassificationFilterConfig.imported)}}
                name="importedSwitch"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
          </td>
          <td>
            {ClientCaseClassificationFilterCount.importedCount}
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
          <td>
            {ClientCaseClassificationFilterCount.localCount}
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
          <td>
            {ClientCaseClassificationFilterCount.localCloseContactCount}
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
          <td>
            {ClientCaseClassificationFilterCount.localPossiblyCount}
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
          <td>
            {ClientCaseClassificationFilterCount.localPossiblyCloseContactCount}
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
      if (v.case_no === case_no){
        detail =  v
      }
    }
    )
    return detail
  }
  List = () =>{
    const AnyReactComponent = this.AnyReactComponent
    const {selectedIndex, ClientStatusFilterConfig, ClientCaseClassificationFilterConfig} = this.state
    var count = 0;
    var DotList = this.state.CasesLocationDetails.map((data)=>{
      count++;
      if ((data.action_en==="Residence" || data.action_en==="Accommodation") && data.case_no!=null){
        //console.log(data.case_no+": "+data.lat+", "+data.lng)
        var clientDetail = this.getClientDetail(data.case_no)
        var isGenerateComponment = false
        if (clientDetail!=null){
          if (selectedIndex === 0){
            var count = this.state.ClientStatusFilterCount
            let clientStatus = clientDetail.status
            if(clientStatus === "discharged" && ClientStatusFilterConfig.discharged){
              isGenerateComponment = true
            }
            else if ((clientStatus === "hospitalised" || clientStatus === "hospitalised_again") && ClientStatusFilterConfig.hospitalised ){
              isGenerateComponment = true
            }
            else if (clientStatus === "deceased" && ClientStatusFilterConfig.deceased){
              isGenerateComponment = true
            }
            else if ((clientStatus === "critical" || clientStatus === "serious") && ClientStatusFilterConfig.critical){
              isGenerateComponment = true
            }
          }
          else if (selectedIndex === 1){
            var count = this.state.ClientCaseClassificationFilterCount
            let clientClassification = clientDetail.classification
            if(clientClassification === "imported"  && ClientCaseClassificationFilterConfig.imported){
              isGenerateComponment = true
            }
            else if (clientClassification === "local_close_contact" && ClientCaseClassificationFilterConfig.localCloseContact){
              isGenerateComponment = true
            }
            else if (clientClassification === "local_possibly" && ClientCaseClassificationFilterConfig.localPossibly){
              isGenerateComponment = true
            }
            else if (clientClassification === "local_possibly_close_contact" && ClientCaseClassificationFilterConfig.localPossiblyCloseContact){
              isGenerateComponment = true
            }
            else if (clientClassification === "local" && ClientCaseClassificationFilterConfig.local){
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
    return DotList
  }
  render() {
    const { classes } = this.props;
    const AnyReactComponent = this.AnyReactComponent
	const {anchorEl, selectedIndex, clientInfobox, isShowMap} = this.state
    return (
      // Important! Always set the container height explicitly
      <div >
        {isShowMap?(
          <div style={{ height: '75vh', width: '100%' }}>
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
		
		<Grid container style = {{flexGrow: 1}} spacing={1}>
			<Grid item xs={2} >
				<List component="nav" aria-label="Device settings" style={{color: '#ffffff'}}>
					<ListItem
					  button
					  aria-haspopup="true"
					  aria-controls="lock-menu"
					  aria-label="when device is locked"
					  onClick={this.handleClickListItem}
            style={{color: '#ffffff'}}
					>
						<ListItemText classes={{ primary: classes.listItemText, secondary: classes.listItemText }} primary="Filter by:" secondary={options[selectedIndex]} style={{color: '#ffffff'}}/>
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
            style={
              {color: '#ffffff'}
            }
					  >
						{option}
					  </MenuItem>
					))}
				</Menu>
        Data By: 2nd May,2020 00:00:00(HKT)
			</Grid>
			<Grid item xs={2}>
			  <this.MapKey selectedIndex = {selectedIndex}/>
			</Grid>
			<Grid item xs={1} alignItems="center" style={{paddingTop: 15}}>
				<Button variant="outlined" color="primary">#{clientInfobox.case_no}</Button>
			</Grid>
			<Grid item xs={7}>
        <Grid container item xs={12} spacing={1}> 
          <Grid item xs={2}>
            Gender: 
          </Grid>
          <Grid item xs={4}>
                {clientInfobox.gender=="M"?"Male":clientInfobox.gender=="F"?"Female":clientInfobox.gender}
                {clientInfobox.gender=="M"?<FontAwesomeIcon icon={faMars} color="blue"/>:clientInfobox.gender=="F"?<FontAwesomeIcon icon={faVenus} color="red"/>:null}
          </Grid>
          <Grid item xs={3}>
            Age: 
          </Grid>
          <Grid item xs={3}>
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
          <Grid item xs={3}>
            Confirmation Date:
          </Grid>
          <Grid item xs={3}>
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
          <Grid item xs={3}>
            Client Type: 
          </Grid>
          <Grid item xs={3}>
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
          <Grid item xs={3}>
            Show Map:
          </Grid>
          <Grid item xs={3}>
			<Switch
				checked={this.state.isShowMap}
				onChange={()=> this.toggleShowMap()}
				name="ShowMap"
				inputProps={{ 'aria-label': 'secondary checkbox' }}
			  />
          </Grid>
        </Grid>
			</Grid>
		</Grid>
      </div>
    );
  }
}

export default  withStyles(styles)(Map);