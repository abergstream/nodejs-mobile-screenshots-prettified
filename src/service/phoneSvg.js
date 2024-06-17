const createPhoneSvg = (width, height) => {
  const strokeWidth = 30;
  const phoneWidth = width - strokeWidth;
  const phoneHeight = height - strokeWidth;
  return `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <g transform="rotate(45deg)">

    <rect x="${strokeWidth / 2}" y="${
    strokeWidth / 2
  }" width="${phoneWidth}px" height="${phoneHeight}px" fill="none" stroke="black" stroke-linejoin="round" stroke-width="${strokeWidth}" rx="${strokeWidth}" ry="${strokeWidth}" />
    </g>
  </svg>
`;
};
module.exports = createPhoneSvg;
