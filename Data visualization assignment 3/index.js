import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ReactDropdown from 'react-dropdown';
import { csv, scaleOrdinal, scaleLinear, extent, format, schemeCategory10 } from 'd3';

import { useData } from './useData';
import { AxisBottom } from './AxisBottom';
import { AxisLeft } from './AxisLeft';
import { AxisSwap } from './AxisSwap';
import { Marks } from './Marks';
import { ColorLegend } from './ColorLegend'

const width = 900;
const height = 350;
const margin = { top: 20, right: 305, bottom: 80, left: 90 };
const xAxisLabelOffset = 50;
const yAxisLabelOffset = 60;
const circleRadius = 6
const fadeOpacity = 0.3


const xValue = d => d.Total;
console.log(xValue)

const attributes = [
  { value: 'Total', label: 'Total' },
  { value: 'Men', label: 'Men' },
  { value: 'Women', label: 'Women' },
  { value: 'ShareWomen', label: 'ShareWomen'},
  { value: 'Employed', label: 'Employed'},
  { value: 'Unemployment_rate', label: 'Unemployment_rate'},
  { value: 'Median', label:'Median'}
];

const getLabel = value => {
  for(let i = 0; i < attributes.length; i++){
    if(attributes[i].value === value){
      return attributes[i].label;
    }
  }
};

const App = () => {
  const data = useData();
  const [hoveredValue, sethoveredValue] = useState(null)
  console.log(hoveredValue)
  
  const initialXAttribute = 'Total';
  const [xAttribute, setXAttribute] = useState(initialXAttribute);
  const xAxisLabel = getLabel(xAttribute);
  const xValue = (d) => d[xAttribute];
  
  const initialYAttribute = 'Median';
  const [yAttribute, setYAttribute] = useState(initialYAttribute);
  const yAxisLabel = getLabel(yAttribute);
  const yValue = (d) => d[yAttribute];
  
  if (!data) {
    return <pre>'Loading...'</pre>;
  }
  
  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  const siFormat = format('.2s');
  const tickFormat = (tickValue) => siFormat(tickValue).replace('G', 'B');
  const tooltipFormat =  format(',d');
  
  const xScale = scaleLinear()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
  	.nice()
  
  const yScale = scaleLinear()
    .domain(extent(data, yValue))
    .range([innerHeight, 0])
  	.nice()
  
  const colorLegendLabel = "Major_category";
  const markLabel = (d) => d.Major;
  const speciesValue = (d) => d.Major_category;
  const speciesScale = scaleOrdinal()
  	.domain(data.map(speciesValue))
    .range([ "#488f31", "#89bf77", "#fff18f", "#f59b56", "#de425b", "#00d9e9", "#03dab7", "#72d472", "#bac42b", "ffa600" ]);

  const filteredData = data.filter(d => hoveredValue === speciesValue(d));
  
  
  
  return (
    <>
      <div className="menu">
        <span className="dropdown-label">X</span>
        <ReactDropdown
          id="x-select"
          options={attributes}
          value={xAttribute}
          onChange={({value}) => setXAttribute(value)}
        />
        <AxisSwap
          xValue={xAttribute}
          yValue={yAttribute}
          setXAttribute={(value) => setXAttribute(value)}
          setYAttribute={(value) => setYAttribute(value)}
        />
        <span className="dropdown-label">Y</span>
        <ReactDropdown
          id="y-select"
          options={attributes}
          value={yAttribute}
          onChange={({value}) => setYAttribute(value)}
        />
      </div>
      <svg width={width} height={height} className="ok">
        <g transform={`translate(${margin.left},${margin.top})`}>
          <AxisLeft
            yScale={yScale}
            innerWidth={innerWidth}
            tickFormat={tickFormat}
            tickOffset={10}
          />
          <text
            className="axis-label"
            textAnchor="middle"
            transform={`translate(${-yAxisLabelOffset},${innerHeight / 2}) rotate(-90)`}
          >
            {yAxisLabel}
          </text>
          <AxisBottom
            xScale={xScale}
            innerHeight={innerHeight}
            tickFormat={tickFormat}
            tickOffset={10}
          />
          <text
            className="axis-label"
            textAnchor="middle"
            x={innerWidth / 2}
            y={innerHeight + xAxisLabelOffset}
          >
            {xAxisLabel}
          </text>
          <g transform={`translate(${innerWidth + 40}, 54)`}>
            <text
              x={90}
              y={-30}
              className="legend-label"
              textAnchor="middle"
            >
              {colorLegendLabel}
            </text>
            <ColorLegend
              colorScale={speciesScale}
              tickSpacing={30}
              tickSize={circleRadius}
              fadeOpacity={fadeOpacity}
              onHover={sethoveredValue}
              hoveredValue={hoveredValue}
            />
          </g>
          <g opacity={hoveredValue ? fadeOpacity : 1}>
            <Marks
              data={data}
              xScale={xScale}
              yScale={yScale}
              xValue={xValue}
              yValue={yValue}
              speciesValue={speciesValue}
              speciesScale={speciesScale}
              cicleRadius={circleRadius}
            />
          </g>
          <Marks
            data={filteredData}
            xScale={xScale}
            yScale={yScale}
            xValue={xValue}
            yValue={yValue}
            speciesValue={speciesValue}
            speciesScale={speciesScale}
            cicleRadius={circleRadius}
          />
        </g>
      </svg>
    </>
  );
};

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
