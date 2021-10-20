(function (React$1, ReactDOM, ReactDropdown, d3) {
  'use strict';

  var React$1__default = 'default' in React$1 ? React$1['default'] : React$1;
  ReactDOM = ReactDOM && Object.prototype.hasOwnProperty.call(ReactDOM, 'default') ? ReactDOM['default'] : ReactDOM;
  ReactDropdown = ReactDropdown && Object.prototype.hasOwnProperty.call(ReactDropdown, 'default') ? ReactDropdown['default'] : ReactDropdown;

  const csvUrl =
    'https://gist.githubusercontent.com/Biaaang/d04e5e92826a84a5f31ceb16a2c3321c/raw/81b536b6e5cf9ab93faa641ad193e53670fe75b3/college-majors.csv';

  const useData = () => {
    const [data, setData] = React$1.useState(null);

    React$1.useEffect(() => {
      const row = (d) => {
        d.Total = +d.Total;
        d.Men	= +d.Men;
        d.Women = +d.Women;
        d.ShareWomen = +d.ShareWomen;
        d.Employed = +d.Employed;
        d.Unemployment_rate = +d.Unemployment_rate;
        d.Median = +d.Median;
        d.Major = d.Major;
        d.Major_category = d.Major_category;
        return d;
      };
      d3.csv(csvUrl, row).then(setData);
    }, []);

    return data;
  };

  const AxisBottom = ({ xScale, innerHeight, tickFormat, tickOffset = 5}) =>
    xScale.ticks().map((tickValue) => (
      React.createElement( 'g', { className: "tick", key: tickValue, transform: `translate(${xScale(tickValue)})` },
        React.createElement( 'line', { y2: innerHeight }),
        React.createElement( 'text', { style: { textAnchor: 'middle' }, y: innerHeight + tickOffset, dy: ".70em" },
          tickFormat(tickValue)
        )
      )
    ));

  const AxisLeft = ({ yScale, innerWidth, tickFormat, tickOffset = 8 }) =>
    yScale.ticks().map((tickValue) => (
      React.createElement( 'g', {
        className: "tick", transform: `translate(0,${yScale(tickValue)})` },
        React.createElement( 'line', { x2: innerWidth }),
        React.createElement( 'text', {
          key: tickValue, style: { textAnchor: 'end' }, x: -tickOffset, dy: ".3em" },
          tickFormat(tickValue)
        )
      )
    ));

  const AxisSwap =  ({
    xValue,
    yValue,
    setXAttribute,
    setYAttribute,
  }) => (
    React.createElement( 'span', {
      className: "axis-swap", onMouseDown: () => {
        setXAttribute(yValue);
        setYAttribute(xValue);
      }, title: "swap axis to pivot graph" }, "⇄")
  );

  const Marks = ({
    data,
    xScale,
    yScale,
    xValue,
    yValue,
    speciesValue,
    speciesScale,
    cicleRadius,
    markLabel
  }) =>
    data.map(d => (
      React.createElement( 'circle', {
        className: "mark", cx: xScale(xValue(d)), cy: yScale(yValue(d)), r: cicleRadius, fill: speciesScale(speciesValue(d)) }
      )
      
    ));

  const ColorLegend = ({
    colorScale,
    tickSpacing = 20,
    tickSize = 10,
    tickTextOffset = 20,
    fadeOpacity = 0.3,
    onHover,
    hoveredValue
  }) =>
    colorScale.domain().map((domainValue, i) => (
      React.createElement( 'g', {
        className: "tick", transform: `translate(0,${i * tickSpacing})`, onMouseEnter: () => onHover(domainValue), onMouseOut: () => onHover(null), opacity: hoveredValue && domainValue !== hoveredValue ? fadeOpacity : 1 },
        React.createElement( 'circle', { r: tickSize, fill: colorScale(domainValue) }),
        React.createElement( 'text', { x: tickTextOffset, dy: ".32em" },
          domainValue
        )
      )
    ));

  const width = 900;
  const height = 350;
  const margin = { top: 20, right: 305, bottom: 80, left: 90 };
  const xAxisLabelOffset = 50;
  const yAxisLabelOffset = 60;
  const circleRadius = 6;
  const fadeOpacity = 0.3;


  const xValue = d => d.Total;
  console.log(xValue);

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
    const [hoveredValue, sethoveredValue] = React$1.useState(null);
    console.log(hoveredValue);
    
    const initialXAttribute = 'Total';
    const [xAttribute, setXAttribute] = React$1.useState(initialXAttribute);
    const xAxisLabel = getLabel(xAttribute);
    const xValue = (d) => d[xAttribute];
    
    const initialYAttribute = 'Median';
    const [yAttribute, setYAttribute] = React$1.useState(initialYAttribute);
    const yAxisLabel = getLabel(yAttribute);
    const yValue = (d) => d[yAttribute];
    
    if (!data) {
      return React$1__default.createElement( 'pre', null, "'Loading...'" );
    }
    
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    const siFormat = d3.format('.2s');
    const tickFormat = (tickValue) => siFormat(tickValue).replace('G', 'B');
    const tooltipFormat =  d3.format(',d');
    
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, xValue))
      .range([0, innerWidth])
    	.nice();
    
    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, yValue))
      .range([innerHeight, 0])
    	.nice();
    
    const colorLegendLabel = "Major_category";
    const speciesValue = (d) => d.Major_category;
    const speciesScale = d3.scaleOrdinal()
    	.domain(data.map(speciesValue))
      .range([ "#488f31", "#89bf77", "#fff18f", "#f59b56", "#de425b", "#00d9e9", "#03dab7", "#72d472", "#bac42b", "ffa600" ]);

    const filteredData = data.filter(d => hoveredValue === speciesValue(d));
    
    
    
    return (
      React$1__default.createElement( React$1__default.Fragment, null,
        React$1__default.createElement( 'div', { className: "menu" },
          React$1__default.createElement( 'span', { className: "dropdown-label" }, "X"),
          React$1__default.createElement( ReactDropdown, {
            id: "x-select", options: attributes, value: xAttribute, onChange: ({value}) => setXAttribute(value) }),
          React$1__default.createElement( AxisSwap, {
            xValue: xAttribute, yValue: yAttribute, setXAttribute: (value) => setXAttribute(value), setYAttribute: (value) => setYAttribute(value) }),
          React$1__default.createElement( 'span', { className: "dropdown-label" }, "Y"),
          React$1__default.createElement( ReactDropdown, {
            id: "y-select", options: attributes, value: yAttribute, onChange: ({value}) => setYAttribute(value) })
        ),
        React$1__default.createElement( 'svg', { width: width, height: height, className: "ok" },
          React$1__default.createElement( 'g', { transform: `translate(${margin.left},${margin.top})` },
            React$1__default.createElement( AxisLeft, {
              yScale: yScale, innerWidth: innerWidth, tickFormat: tickFormat, tickOffset: 10 }),
            React$1__default.createElement( 'text', {
              className: "axis-label", textAnchor: "middle", transform: `translate(${-yAxisLabelOffset},${innerHeight / 2}) rotate(-90)` },
              yAxisLabel
            ),
            React$1__default.createElement( AxisBottom, {
              xScale: xScale, innerHeight: innerHeight, tickFormat: tickFormat, tickOffset: 10 }),
            React$1__default.createElement( 'text', {
              className: "axis-label", textAnchor: "middle", x: innerWidth / 2, y: innerHeight + xAxisLabelOffset },
              xAxisLabel
            ),
            React$1__default.createElement( 'g', { transform: `translate(${innerWidth + 40}, 54)` },
              React$1__default.createElement( 'text', {
                x: 90, y: -30, className: "legend-label", textAnchor: "middle" },
                colorLegendLabel
              ),
              React$1__default.createElement( ColorLegend, {
                colorScale: speciesScale, tickSpacing: 30, tickSize: circleRadius, fadeOpacity: fadeOpacity, onHover: sethoveredValue, hoveredValue: hoveredValue })
            ),
            React$1__default.createElement( 'g', { opacity: hoveredValue ? fadeOpacity : 1 },
              React$1__default.createElement( Marks, {
                data: data, xScale: xScale, yScale: yScale, xValue: xValue, yValue: yValue, speciesValue: speciesValue, speciesScale: speciesScale, cicleRadius: circleRadius })
            ),
            React$1__default.createElement( Marks, {
              data: filteredData, xScale: xScale, yScale: yScale, xValue: xValue, yValue: yValue, speciesValue: speciesValue, speciesScale: speciesScale, cicleRadius: circleRadius })
          )
        )
      )
    );
  };

  const rootElement = document.getElementById('root');
  ReactDOM.render(React$1__default.createElement( App, null ), rootElement);

}(React, ReactDOM, ReactDropdown, d3));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbInVzZURhdGEuanMiLCJBeGlzQm90dG9tLmpzIiwiQXhpc0xlZnQuanMiLCJBeGlzU3dhcC5qcyIsIk1hcmtzLmpzIiwiQ29sb3JMZWdlbmQuanMiLCJpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNzdiB9IGZyb20gJ2QzJztcblxuY29uc3QgY3N2VXJsID1cbiAgJ2h0dHBzOi8vZ2lzdC5naXRodWJ1c2VyY29udGVudC5jb20vQmlhYWFuZy9kMDRlNWU5MjgyNmE4NGE1ZjMxY2ViMTZhMmMzMzIxYy9yYXcvODFiNTM2YjZlNWNmOWFiOTNmYWE2NDFhZDE5M2U1MzY3MGZlNzViMy9jb2xsZWdlLW1ham9ycy5jc3YnO1xuXG5leHBvcnQgY29uc3QgdXNlRGF0YSA9ICgpID0+IHtcbiAgY29uc3QgW2RhdGEsIHNldERhdGFdID0gdXNlU3RhdGUobnVsbCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCByb3cgPSAoZCkgPT4ge1xuICAgICAgZC5Ub3RhbCA9ICtkLlRvdGFsO1xuICAgICAgZC5NZW5cdD0gK2QuTWVuO1xuICAgICAgZC5Xb21lbiA9ICtkLldvbWVuO1xuICAgICAgZC5TaGFyZVdvbWVuID0gK2QuU2hhcmVXb21lbjtcbiAgICAgIGQuRW1wbG95ZWQgPSArZC5FbXBsb3llZDtcbiAgICAgIGQuVW5lbXBsb3ltZW50X3JhdGUgPSArZC5VbmVtcGxveW1lbnRfcmF0ZTtcbiAgICAgIGQuTWVkaWFuID0gK2QuTWVkaWFuO1xuICAgICAgZC5NYWpvciA9IGQuTWFqb3I7XG4gICAgICBkLk1ham9yX2NhdGVnb3J5ID0gZC5NYWpvcl9jYXRlZ29yeTtcbiAgICAgIHJldHVybiBkO1xuICAgIH07XG4gICAgY3N2KGNzdlVybCwgcm93KS50aGVuKHNldERhdGEpO1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIGRhdGE7XG59O1xuIiwiZXhwb3J0IGNvbnN0IEF4aXNCb3R0b20gPSAoeyB4U2NhbGUsIGlubmVySGVpZ2h0LCB0aWNrRm9ybWF0LCB0aWNrT2Zmc2V0ID0gNX0pID0+XG4gIHhTY2FsZS50aWNrcygpLm1hcCgodGlja1ZhbHVlKSA9PiAoXG4gICAgPGcgY2xhc3NOYW1lPVwidGlja1wiIGtleT17dGlja1ZhbHVlfSB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoJHt4U2NhbGUodGlja1ZhbHVlKX0pYH0+XG4gICAgICA8bGluZSB5Mj17aW5uZXJIZWlnaHR9IC8+XG4gICAgICA8dGV4dCBzdHlsZT17eyB0ZXh0QW5jaG9yOiAnbWlkZGxlJyB9fSB5PXtpbm5lckhlaWdodCArIHRpY2tPZmZzZXR9IGR5PVwiLjcwZW1cIj5cbiAgICAgICAge3RpY2tGb3JtYXQodGlja1ZhbHVlKX1cbiAgICAgIDwvdGV4dD5cbiAgICA8L2c+XG4gICkpO1xuIiwiZXhwb3J0IGNvbnN0IEF4aXNMZWZ0ID0gKHsgeVNjYWxlLCBpbm5lcldpZHRoLCB0aWNrRm9ybWF0LCB0aWNrT2Zmc2V0ID0gOCB9KSA9PlxuICB5U2NhbGUudGlja3MoKS5tYXAoKHRpY2tWYWx1ZSkgPT4gKFxuICAgIDxnXG4gICAgICBjbGFzc05hbWU9XCJ0aWNrXCJcbiAgICAgIHRyYW5zZm9ybT17YHRyYW5zbGF0ZSgwLCR7eVNjYWxlKHRpY2tWYWx1ZSl9KWB9XG4gICAgPlxuICAgICAgPGxpbmUgeDI9e2lubmVyV2lkdGh9IC8+XG4gICAgICA8dGV4dFxuICAgICAgICBrZXk9e3RpY2tWYWx1ZX1cbiAgICAgICAgc3R5bGU9e3sgdGV4dEFuY2hvcjogJ2VuZCcgfX1cbiAgICAgICAgeD17LXRpY2tPZmZzZXR9XG4gICAgICAgIGR5PVwiLjNlbVwiXG4gICAgICA+XG4gICAgICAgIHt0aWNrRm9ybWF0KHRpY2tWYWx1ZSl9XG4gICAgICA8L3RleHQ+XG4gICAgPC9nPlxuICApKTsiLCJleHBvcnQgY29uc3QgQXhpc1N3YXAgPSAgKHtcbiAgeFZhbHVlLFxuICB5VmFsdWUsXG4gIHNldFhBdHRyaWJ1dGUsXG4gIHNldFlBdHRyaWJ1dGUsXG59KSA9PiAoXG4gIDxzcGFuXG4gICAgY2xhc3NOYW1lPVwiYXhpcy1zd2FwXCJcbiAgICBvbk1vdXNlRG93bj17KCkgPT4ge1xuICAgICAgc2V0WEF0dHJpYnV0ZSh5VmFsdWUpXG4gICAgICBzZXRZQXR0cmlidXRlKHhWYWx1ZSlcbiAgICB9fVxuICAgIHRpdGxlPVwic3dhcCBheGlzIHRvIHBpdm90IGdyYXBoXCJcblx0PsOiwofChDwvc3Bhbj5cbik7IiwiaW1wb3J0IHsgdG9UaXRsZUNhc2UgfSBmcm9tICcuL3RvVGl0bGVDYXNlJztcblxuZXhwb3J0IGNvbnN0IE1hcmtzID0gKHtcbiAgZGF0YSxcbiAgeFNjYWxlLFxuICB5U2NhbGUsXG4gIHhWYWx1ZSxcbiAgeVZhbHVlLFxuICBzcGVjaWVzVmFsdWUsXG4gIHNwZWNpZXNTY2FsZSxcbiAgY2ljbGVSYWRpdXMsXG4gIG1hcmtMYWJlbFxufSkgPT5cbiAgZGF0YS5tYXAoZCA9PiAoXG4gICAgPGNpcmNsZVxuICAgICAgY2xhc3NOYW1lPVwibWFya1wiXG4gICAgICBjeD17eFNjYWxlKHhWYWx1ZShkKSl9XG4gICAgICBjeT17eVNjYWxlKHlWYWx1ZShkKSl9XG4gICAgICByPXtjaWNsZVJhZGl1c31cbiAgICAgIGZpbGw9e3NwZWNpZXNTY2FsZShzcGVjaWVzVmFsdWUoZCkpfVxuICAgID5cbiAgICA8L2NpcmNsZT5cbiAgICBcbiAgKSk7XG4iLCJleHBvcnQgY29uc3QgQ29sb3JMZWdlbmQgPSAoe1xuICBjb2xvclNjYWxlLFxuICB0aWNrU3BhY2luZyA9IDIwLFxuICB0aWNrU2l6ZSA9IDEwLFxuICB0aWNrVGV4dE9mZnNldCA9IDIwLFxuICBmYWRlT3BhY2l0eSA9IDAuMyxcbiAgb25Ib3ZlcixcbiAgaG92ZXJlZFZhbHVlXG59KSA9PlxuICBjb2xvclNjYWxlLmRvbWFpbigpLm1hcCgoZG9tYWluVmFsdWUsIGkpID0+IChcbiAgICA8Z1xuICAgICAgY2xhc3NOYW1lPVwidGlja1wiXG4gICAgICB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoMCwke2kgKiB0aWNrU3BhY2luZ30pYH1cbiAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4gb25Ib3Zlcihkb21haW5WYWx1ZSl9XG4gICAgICBvbk1vdXNlT3V0PXsoKSA9PiBvbkhvdmVyKG51bGwpfVxuICAgICAgb3BhY2l0eT17aG92ZXJlZFZhbHVlICYmIGRvbWFpblZhbHVlICE9PSBob3ZlcmVkVmFsdWUgPyBmYWRlT3BhY2l0eSA6IDEgfVxuICAgID5cbiAgICAgIDxjaXJjbGUgcj17dGlja1NpemV9IGZpbGw9e2NvbG9yU2NhbGUoZG9tYWluVmFsdWUpfSAvPlxuICAgICAgPHRleHQgeD17dGlja1RleHRPZmZzZXR9IGR5PVwiLjMyZW1cIj5cbiAgICAgICAge2RvbWFpblZhbHVlfVxuICAgICAgPC90ZXh0PlxuICAgIDwvZz5cbiAgKSk7XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBSZWFjdERyb3Bkb3duIGZyb20gJ3JlYWN0LWRyb3Bkb3duJztcbmltcG9ydCB7IGNzdiwgc2NhbGVPcmRpbmFsLCBzY2FsZUxpbmVhciwgZXh0ZW50LCBmb3JtYXQsIHNjaGVtZUNhdGVnb3J5MTAgfSBmcm9tICdkMyc7XG5cbmltcG9ydCB7IHVzZURhdGEgfSBmcm9tICcuL3VzZURhdGEnO1xuaW1wb3J0IHsgQXhpc0JvdHRvbSB9IGZyb20gJy4vQXhpc0JvdHRvbSc7XG5pbXBvcnQgeyBBeGlzTGVmdCB9IGZyb20gJy4vQXhpc0xlZnQnO1xuaW1wb3J0IHsgQXhpc1N3YXAgfSBmcm9tICcuL0F4aXNTd2FwJztcbmltcG9ydCB7IE1hcmtzIH0gZnJvbSAnLi9NYXJrcyc7XG5pbXBvcnQgeyBDb2xvckxlZ2VuZCB9IGZyb20gJy4vQ29sb3JMZWdlbmQnXG5cbmNvbnN0IHdpZHRoID0gOTAwO1xuY29uc3QgaGVpZ2h0ID0gMzUwO1xuY29uc3QgbWFyZ2luID0geyB0b3A6IDIwLCByaWdodDogMzA1LCBib3R0b206IDgwLCBsZWZ0OiA5MCB9O1xuY29uc3QgeEF4aXNMYWJlbE9mZnNldCA9IDUwO1xuY29uc3QgeUF4aXNMYWJlbE9mZnNldCA9IDYwO1xuY29uc3QgY2lyY2xlUmFkaXVzID0gNlxuY29uc3QgZmFkZU9wYWNpdHkgPSAwLjNcblxuXG5jb25zdCB4VmFsdWUgPSBkID0+IGQuVG90YWw7XG5jb25zb2xlLmxvZyh4VmFsdWUpXG5cbmNvbnN0IGF0dHJpYnV0ZXMgPSBbXG4gIHsgdmFsdWU6ICdUb3RhbCcsIGxhYmVsOiAnVG90YWwnIH0sXG4gIHsgdmFsdWU6ICdNZW4nLCBsYWJlbDogJ01lbicgfSxcbiAgeyB2YWx1ZTogJ1dvbWVuJywgbGFiZWw6ICdXb21lbicgfSxcbiAgeyB2YWx1ZTogJ1NoYXJlV29tZW4nLCBsYWJlbDogJ1NoYXJlV29tZW4nfSxcbiAgeyB2YWx1ZTogJ0VtcGxveWVkJywgbGFiZWw6ICdFbXBsb3llZCd9LFxuICB7IHZhbHVlOiAnVW5lbXBsb3ltZW50X3JhdGUnLCBsYWJlbDogJ1VuZW1wbG95bWVudF9yYXRlJ30sXG4gIHsgdmFsdWU6ICdNZWRpYW4nLCBsYWJlbDonTWVkaWFuJ31cbl07XG5cbmNvbnN0IGdldExhYmVsID0gdmFsdWUgPT4ge1xuICBmb3IobGV0IGkgPSAwOyBpIDwgYXR0cmlidXRlcy5sZW5ndGg7IGkrKyl7XG4gICAgaWYoYXR0cmlidXRlc1tpXS52YWx1ZSA9PT0gdmFsdWUpe1xuICAgICAgcmV0dXJuIGF0dHJpYnV0ZXNbaV0ubGFiZWw7XG4gICAgfVxuICB9XG59O1xuXG5jb25zdCBBcHAgPSAoKSA9PiB7XG4gIGNvbnN0IGRhdGEgPSB1c2VEYXRhKCk7XG4gIGNvbnN0IFtob3ZlcmVkVmFsdWUsIHNldGhvdmVyZWRWYWx1ZV0gPSB1c2VTdGF0ZShudWxsKVxuICBjb25zb2xlLmxvZyhob3ZlcmVkVmFsdWUpXG4gIFxuICBjb25zdCBpbml0aWFsWEF0dHJpYnV0ZSA9ICdUb3RhbCc7XG4gIGNvbnN0IFt4QXR0cmlidXRlLCBzZXRYQXR0cmlidXRlXSA9IHVzZVN0YXRlKGluaXRpYWxYQXR0cmlidXRlKTtcbiAgY29uc3QgeEF4aXNMYWJlbCA9IGdldExhYmVsKHhBdHRyaWJ1dGUpO1xuICBjb25zdCB4VmFsdWUgPSAoZCkgPT4gZFt4QXR0cmlidXRlXTtcbiAgXG4gIGNvbnN0IGluaXRpYWxZQXR0cmlidXRlID0gJ01lZGlhbic7XG4gIGNvbnN0IFt5QXR0cmlidXRlLCBzZXRZQXR0cmlidXRlXSA9IHVzZVN0YXRlKGluaXRpYWxZQXR0cmlidXRlKTtcbiAgY29uc3QgeUF4aXNMYWJlbCA9IGdldExhYmVsKHlBdHRyaWJ1dGUpO1xuICBjb25zdCB5VmFsdWUgPSAoZCkgPT4gZFt5QXR0cmlidXRlXTtcbiAgXG4gIGlmICghZGF0YSkge1xuICAgIHJldHVybiA8cHJlPidMb2FkaW5nLi4uJzwvcHJlPjtcbiAgfVxuICBcbiAgY29uc3QgaW5uZXJIZWlnaHQgPSBoZWlnaHQgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcbiAgY29uc3QgaW5uZXJXaWR0aCA9IHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XG5cbiAgY29uc3Qgc2lGb3JtYXQgPSBmb3JtYXQoJy4ycycpO1xuICBjb25zdCB0aWNrRm9ybWF0ID0gKHRpY2tWYWx1ZSkgPT4gc2lGb3JtYXQodGlja1ZhbHVlKS5yZXBsYWNlKCdHJywgJ0InKTtcbiAgY29uc3QgdG9vbHRpcEZvcm1hdCA9ICBmb3JtYXQoJyxkJyk7XG4gIFxuICBjb25zdCB4U2NhbGUgPSBzY2FsZUxpbmVhcigpXG4gICAgLmRvbWFpbihleHRlbnQoZGF0YSwgeFZhbHVlKSlcbiAgICAucmFuZ2UoWzAsIGlubmVyV2lkdGhdKVxuICBcdC5uaWNlKClcbiAgXG4gIGNvbnN0IHlTY2FsZSA9IHNjYWxlTGluZWFyKClcbiAgICAuZG9tYWluKGV4dGVudChkYXRhLCB5VmFsdWUpKVxuICAgIC5yYW5nZShbaW5uZXJIZWlnaHQsIDBdKVxuICBcdC5uaWNlKClcbiAgXG4gIGNvbnN0IGNvbG9yTGVnZW5kTGFiZWwgPSBcIk1ham9yX2NhdGVnb3J5XCI7XG4gIGNvbnN0IG1hcmtMYWJlbCA9IChkKSA9PiBkLk1ham9yO1xuICBjb25zdCBzcGVjaWVzVmFsdWUgPSAoZCkgPT4gZC5NYWpvcl9jYXRlZ29yeTtcbiAgY29uc3Qgc3BlY2llc1NjYWxlID0gc2NhbGVPcmRpbmFsKClcbiAgXHQuZG9tYWluKGRhdGEubWFwKHNwZWNpZXNWYWx1ZSkpXG4gICAgLnJhbmdlKFsgXCIjNDg4ZjMxXCIsIFwiIzg5YmY3N1wiLCBcIiNmZmYxOGZcIiwgXCIjZjU5YjU2XCIsIFwiI2RlNDI1YlwiLCBcIiMwMGQ5ZTlcIiwgXCIjMDNkYWI3XCIsIFwiIzcyZDQ3MlwiLCBcIiNiYWM0MmJcIiwgXCJmZmE2MDBcIiBdKTtcblxuICBjb25zdCBmaWx0ZXJlZERhdGEgPSBkYXRhLmZpbHRlcihkID0+IGhvdmVyZWRWYWx1ZSA9PT0gc3BlY2llc1ZhbHVlKGQpKTtcbiAgXG4gIFxuICBcbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZW51XCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImRyb3Bkb3duLWxhYmVsXCI+WDwvc3Bhbj5cbiAgICAgICAgPFJlYWN0RHJvcGRvd25cbiAgICAgICAgICBpZD1cIngtc2VsZWN0XCJcbiAgICAgICAgICBvcHRpb25zPXthdHRyaWJ1dGVzfVxuICAgICAgICAgIHZhbHVlPXt4QXR0cmlidXRlfVxuICAgICAgICAgIG9uQ2hhbmdlPXsoe3ZhbHVlfSkgPT4gc2V0WEF0dHJpYnV0ZSh2YWx1ZSl9XG4gICAgICAgIC8+XG4gICAgICAgIDxBeGlzU3dhcFxuICAgICAgICAgIHhWYWx1ZT17eEF0dHJpYnV0ZX1cbiAgICAgICAgICB5VmFsdWU9e3lBdHRyaWJ1dGV9XG4gICAgICAgICAgc2V0WEF0dHJpYnV0ZT17KHZhbHVlKSA9PiBzZXRYQXR0cmlidXRlKHZhbHVlKX1cbiAgICAgICAgICBzZXRZQXR0cmlidXRlPXsodmFsdWUpID0+IHNldFlBdHRyaWJ1dGUodmFsdWUpfVxuICAgICAgICAvPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJkcm9wZG93bi1sYWJlbFwiPlk8L3NwYW4+XG4gICAgICAgIDxSZWFjdERyb3Bkb3duXG4gICAgICAgICAgaWQ9XCJ5LXNlbGVjdFwiXG4gICAgICAgICAgb3B0aW9ucz17YXR0cmlidXRlc31cbiAgICAgICAgICB2YWx1ZT17eUF0dHJpYnV0ZX1cbiAgICAgICAgICBvbkNoYW5nZT17KHt2YWx1ZX0pID0+IHNldFlBdHRyaWJ1dGUodmFsdWUpfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8c3ZnIHdpZHRoPXt3aWR0aH0gaGVpZ2h0PXtoZWlnaHR9IGNsYXNzTmFtZT1cIm9rXCI+XG4gICAgICAgIDxnIHRyYW5zZm9ybT17YHRyYW5zbGF0ZSgke21hcmdpbi5sZWZ0fSwke21hcmdpbi50b3B9KWB9PlxuICAgICAgICAgIDxBeGlzTGVmdFxuICAgICAgICAgICAgeVNjYWxlPXt5U2NhbGV9XG4gICAgICAgICAgICBpbm5lcldpZHRoPXtpbm5lcldpZHRofVxuICAgICAgICAgICAgdGlja0Zvcm1hdD17dGlja0Zvcm1hdH1cbiAgICAgICAgICAgIHRpY2tPZmZzZXQ9ezEwfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPHRleHRcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImF4aXMtbGFiZWxcIlxuICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiXG4gICAgICAgICAgICB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoJHsteUF4aXNMYWJlbE9mZnNldH0sJHtpbm5lckhlaWdodCAvIDJ9KSByb3RhdGUoLTkwKWB9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3lBeGlzTGFiZWx9XG4gICAgICAgICAgPC90ZXh0PlxuICAgICAgICAgIDxBeGlzQm90dG9tXG4gICAgICAgICAgICB4U2NhbGU9e3hTY2FsZX1cbiAgICAgICAgICAgIGlubmVySGVpZ2h0PXtpbm5lckhlaWdodH1cbiAgICAgICAgICAgIHRpY2tGb3JtYXQ9e3RpY2tGb3JtYXR9XG4gICAgICAgICAgICB0aWNrT2Zmc2V0PXsxMH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDx0ZXh0XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJheGlzLWxhYmVsXCJcbiAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIlxuICAgICAgICAgICAgeD17aW5uZXJXaWR0aCAvIDJ9XG4gICAgICAgICAgICB5PXtpbm5lckhlaWdodCArIHhBeGlzTGFiZWxPZmZzZXR9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3hBeGlzTGFiZWx9XG4gICAgICAgICAgPC90ZXh0PlxuICAgICAgICAgIDxnIHRyYW5zZm9ybT17YHRyYW5zbGF0ZSgke2lubmVyV2lkdGggKyA0MH0sIDU0KWB9PlxuICAgICAgICAgICAgPHRleHRcbiAgICAgICAgICAgICAgeD17OTB9XG4gICAgICAgICAgICAgIHk9ey0zMH1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibGVnZW5kLWxhYmVsXCJcbiAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtjb2xvckxlZ2VuZExhYmVsfVxuICAgICAgICAgICAgPC90ZXh0PlxuICAgICAgICAgICAgPENvbG9yTGVnZW5kXG4gICAgICAgICAgICAgIGNvbG9yU2NhbGU9e3NwZWNpZXNTY2FsZX1cbiAgICAgICAgICAgICAgdGlja1NwYWNpbmc9ezMwfVxuICAgICAgICAgICAgICB0aWNrU2l6ZT17Y2lyY2xlUmFkaXVzfVxuICAgICAgICAgICAgICBmYWRlT3BhY2l0eT17ZmFkZU9wYWNpdHl9XG4gICAgICAgICAgICAgIG9uSG92ZXI9e3NldGhvdmVyZWRWYWx1ZX1cbiAgICAgICAgICAgICAgaG92ZXJlZFZhbHVlPXtob3ZlcmVkVmFsdWV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZz5cbiAgICAgICAgICA8ZyBvcGFjaXR5PXtob3ZlcmVkVmFsdWUgPyBmYWRlT3BhY2l0eSA6IDF9PlxuICAgICAgICAgICAgPE1hcmtzXG4gICAgICAgICAgICAgIGRhdGE9e2RhdGF9XG4gICAgICAgICAgICAgIHhTY2FsZT17eFNjYWxlfVxuICAgICAgICAgICAgICB5U2NhbGU9e3lTY2FsZX1cbiAgICAgICAgICAgICAgeFZhbHVlPXt4VmFsdWV9XG4gICAgICAgICAgICAgIHlWYWx1ZT17eVZhbHVlfVxuICAgICAgICAgICAgICBzcGVjaWVzVmFsdWU9e3NwZWNpZXNWYWx1ZX1cbiAgICAgICAgICAgICAgc3BlY2llc1NjYWxlPXtzcGVjaWVzU2NhbGV9XG4gICAgICAgICAgICAgIGNpY2xlUmFkaXVzPXtjaXJjbGVSYWRpdXN9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZz5cbiAgICAgICAgICA8TWFya3NcbiAgICAgICAgICAgIGRhdGE9e2ZpbHRlcmVkRGF0YX1cbiAgICAgICAgICAgIHhTY2FsZT17eFNjYWxlfVxuICAgICAgICAgICAgeVNjYWxlPXt5U2NhbGV9XG4gICAgICAgICAgICB4VmFsdWU9e3hWYWx1ZX1cbiAgICAgICAgICAgIHlWYWx1ZT17eVZhbHVlfVxuICAgICAgICAgICAgc3BlY2llc1ZhbHVlPXtzcGVjaWVzVmFsdWV9XG4gICAgICAgICAgICBzcGVjaWVzU2NhbGU9e3NwZWNpZXNTY2FsZX1cbiAgICAgICAgICAgIGNpY2xlUmFkaXVzPXtjaXJjbGVSYWRpdXN9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9nPlxuICAgICAgPC9zdmc+XG4gICAgPC8+XG4gICk7XG59O1xuXG5jb25zdCByb290RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290Jyk7XG5SZWFjdERPTS5yZW5kZXIoPEFwcCAvPiwgcm9vdEVsZW1lbnQpO1xuIl0sIm5hbWVzIjpbInVzZVN0YXRlIiwidXNlRWZmZWN0IiwiY3N2IiwiUmVhY3QiLCJmb3JtYXQiLCJzY2FsZUxpbmVhciIsImV4dGVudCIsInNjYWxlT3JkaW5hbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztFQUdBLE1BQU0sTUFBTTtFQUNaLEVBQUUsNklBQTZJLENBQUM7QUFDaEo7RUFDTyxNQUFNLE9BQU8sR0FBRyxNQUFNO0VBQzdCLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsR0FBR0EsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QztFQUNBLEVBQUVDLGlCQUFTLENBQUMsTUFBTTtFQUNsQixJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLO0VBQ3ZCLE1BQU0sQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7RUFDekIsTUFBTSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztFQUNyQixNQUFNLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0VBQ3pCLE1BQU0sQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7RUFDbkMsTUFBTSxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztFQUMvQixNQUFNLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQztFQUNqRCxNQUFNLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0VBQzNCLE1BQU0sQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0VBQ3hCLE1BQU0sQ0FBQyxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDO0VBQzFDLE1BQU0sT0FBTyxDQUFDLENBQUM7RUFDZixLQUFLLENBQUM7RUFDTixJQUFJQyxNQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcs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