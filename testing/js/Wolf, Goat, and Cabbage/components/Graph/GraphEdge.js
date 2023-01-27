function GraphEdge({ x, y, size, displayLine }) {
  const x1 = `${52 - 43 * Math.sin((-2 * x * Math.PI) / size)}`;
  const y1 = `${52 - 43 * Math.cos((-2 * x * Math.PI) / size)}`;
  const x2 = `${52 - 43 * Math.sin((-2 * y * Math.PI) / size)}`;
  const y2 = `${52 - 43 * Math.cos((-2 * y * Math.PI) / size)}`;

  const output =
    displayLine && x < size && y < size ? (
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="black"></line>
    ) : null;
  return output;
}

export { GraphEdge };
