export const AxisLeft = ({ yScale, innerWidth, tickFormat, tickOffset = 8 }) =>
  yScale.ticks().map((tickValue) => (
    <g
      className="tick"
      transform={`translate(0,${yScale(tickValue)})`}
    >
      <line x2={innerWidth} />
      <text
        key={tickValue}
        style={{ textAnchor: 'end' }}
        x={-tickOffset}
        dy=".3em"
      >
        {tickFormat(tickValue)}
      </text>
    </g>
  ));