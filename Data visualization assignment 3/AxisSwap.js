export const AxisSwap =  ({
  xValue,
  yValue,
  setXAttribute,
  setYAttribute,
}) => (
  <span
    className="axis-swap"
    onMouseDown={() => {
      setXAttribute(yValue)
      setYAttribute(xValue)
    }}
    title="swap axis to pivot graph"
	>⇄</span>
