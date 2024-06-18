const createPhoneSvg = (
  canvasWidth,
  canvasHeight,
  width,
  height,
  strokeWidth,
  xPosition,
  yPosition
) => {
  // Gets the actual size of the phone
  const phoneWidth = width - strokeWidth;
  const phoneHeight = height - strokeWidth;

  // Gets the center of the image
  const xPos = (canvasWidth - phoneWidth) / 2;

  return `
  <svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
    <rect x="${xPosition}" y="${yPosition}px" width="${phoneWidth}px" height="${phoneHeight}px"
      fill="none" stroke="black" stroke-linejoin="round"
           stroke-width="${strokeWidth}" rx="${strokeWidth * 3}" ry="${
    strokeWidth * 3
  }" />
  </svg>
`;
};
module.exports = createPhoneSvg;
