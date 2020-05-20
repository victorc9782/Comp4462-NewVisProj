import React, { Component } from 'react';
import * as d3 from 'd3';
import CasesDetailsJson from '../../Config/district.json';
import legend from './legend.svg';

import './HeatMap.css';

class HeatMap extends Component {
    constructor(props){
        super(props);
        this.state = {CasesDetails: []};

    }
    componentWillMount(){
        console.log("componentWillMount()")
        let CasesDetails=[]
        CasesDetailsJson.map((data)=>{CasesDetails.push(data)})
        this.setState({CasesDetails: CasesDetails})
    };
    
    componentDidMount() {
        
        const width = 1000,
              height = 408,
              margins = {top:20, right: 50, bottom: 50, left: 100};
        
        
          const parseDate = d=>{
            return d3.utcParse("%d/%m/%Y")(d);
        };


        const min_date = parseDate('23/1/2020');
        const max_date = parseDate('26/4/2020');
        const date_range = (max_date-min_date)/(24*60*60*1000);

        const x_scale = d3.scaleTime().range([0,width]).domain([min_date,max_date]).nice();

        const color_scale = d3.scaleSequential(d3.interpolateYlOrBr).domain([-2,20]);
        
        const barWidth = width / date_range,
        barHeight = height / 18;

        const y_scale =d3.scaleOrdinal()
                            .range([0,barHeight*1,barHeight*2, barHeight*3,barHeight*4,barHeight*5,
                                    barHeight*6,barHeight*7,barHeight*8,barHeight*9,barHeight*10,barHeight*11,barHeight*12,
                                    barHeight*13,barHeight*14,barHeight*15,barHeight*16,barHeight*17])
                            .domain(['Sha Tin','Eastern','Yau Tsim Mong','Kwai Tsing',
                                'Kowloon City','Kwun Tong','North','Wan Chai','Wong Tai Sin',
                                'Southern','Sai Kung','Tuen Mun','Central & Western','Yuen Long',
                                'Sham Shui Po','Tai Po','Tsuen Wan','Islands'
                        ])

        

        const district_to_y = {
            'Sha Tin': 0,
            'Eastern': barHeight*1,
            'Yau Tsim Mong': barHeight*2,
            'Kwai Tsing': barHeight*3,
            'Kowloon City': barHeight*4,
            'Kwun Tong': barHeight*5,
            'North': barHeight*6,
            'Wan Chai': barHeight*7,
            'Wong Tai Sin': barHeight*8,
            'Southern': barHeight*9,
            'Sai Kung': barHeight*10,
            'Tuen Mun': barHeight*11,
            'Central & Western': barHeight*12,
            'Yuen Long': barHeight*13,
            'Sham Shui Po': barHeight*14,
            'Tai Po': barHeight*15,
            'Tsuen Wan': barHeight*16,
            'Islands': barHeight*17
        }


        const tooltip = d3.select('.HeatMapContainer').append('div')
        .attr('class','tooltip')
        .style('background-color', 'white')
        .style('color', '#121212')
        .style('position','absolute')
        .style('width','115px')
        .style('padding','13px')
        .style('opacity','10')
        .html('Tooltip')

        const timeParseFormat = d => {
            if (d === 0) return '';
            return d3.timeFormat("%B %d")(d);
          };
        
        const chart = d3.select('.chart')
        .attr('width', width + margins.right + margins.left)
        .attr('height', height + margins.top + margins.bottom)
        .append('g')
        .attr('transform','translate(' + margins.left + ',' + margins.top + ')')

        chart.selectAll('g')
        .data(this.state.CasesDetails).enter().append('g')
        .append('rect')
        .attr('x', d => {return x_scale(parseDate(d.key))})
        .attr('y', d=>{return district_to_y[d.district] })
        .style('fill', d=>{return color_scale(d.value)})
        .attr('width', barWidth)
        .attr('height', barHeight)
        .on('mouseover', d=>{tooltip.html(timeParseFormat(parseDate(d.key)) + '<br/>' +
                                            + d.value
                                            + ' confirm cases')
            .style('left', d3.event.pageX - 0 + 'px')
            .style('top', d3.event.pageY - 0 + 'px')
            .style('opacity', .8);
        }).on('mouseout', () => {
          tooltip.style('opacity', 0)
            .style('left', '0px');
        });

        //x-axis
        chart.append('g')
        .attr('transform','translate(20,' + height + ')')
        .call(d3.axisBottom(x_scale))
        .attr('font-family', 'Roboto')
        .attr('font-size', '14px')
        .attr('class', 'xAxis');
        
              //Append y axis
         chart.append('g')
         .attr('transform','translate(20,10)')
         .call(d3.axisLeft(y_scale))
         //.attr('width', 'px')
         .attr('font-family', 'Roboto')
         .attr('font-size', '14px')
         .attr('class','yAxis');
    }

    render() {
        return(
          <div className='HeatMapContainer'>
            <h1>Confirmed Cases per District over Time</h1> 
            <svg className='chart'></svg>
            <svg className='legend'></svg>
            <img src={legend} width={700} height={92} mode='fit'/>
          </div>
        );
    }
} 
   
export default HeatMap;   
