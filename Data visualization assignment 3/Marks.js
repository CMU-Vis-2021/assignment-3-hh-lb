import { toTitleCase } from './toTitleCase';

export const Marks = ({
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
    <circle
      className="mark"
      cx={xScale(xValue(d))}
      cy={yScale(yValue(d))}
      r={cicleRadius}
      fill={speciesScale(speciesValue(d))}
    >
    </circle>
    
  ));
