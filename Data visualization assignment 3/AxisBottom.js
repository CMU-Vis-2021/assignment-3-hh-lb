export const AxisBottom = ({ xScale, innerHeight, tickFormat, tickOffset = 5}) =>
  xScale.ticks().map((tickValue) => (
    <g className="tick" key={tickValue} transform={`translate(${xScale(tickValue)})`}>
      <line y2={innerHeight} />
      <text style={{ textAnchor: 'middle' }} y={innerHeight + tickOffset} dy=".70em">
        {tickFormat(tickValue)}
      </text>
    </g>
  ));
