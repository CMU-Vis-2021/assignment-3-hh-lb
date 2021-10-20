export const ColorLegend = ({
  colorScale,
  tickSpacing = 20,
  tickSize = 10,
  tickTextOffset = 20,
  fadeOpacity = 0.3,
  onHover,
  hoveredValue
}) =>
  colorScale.domain().map((domainValue, i) => (
    <g
      className="tick"
      transform={`translate(0,${i * tickSpacing})`}
      onMouseEnter={() => onHover(domainValue)}
      onMouseOut={() => onHover(null)}
      opacity={hoveredValue && domainValue !== hoveredValue ? fadeOpacity : 1 }
    >
      <circle r={tickSize} fill={colorScale(domainValue)} />
      <text x={tickTextOffset} dy=".32em">
        {domainValue}
      </text>
    </g>
  ));
