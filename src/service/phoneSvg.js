const createPhoneSvg = (canvasWidth, canvasHeight, width, height) => {
  const strokeWidth = 30;

  // Offset to calculate the center
  const offset = strokeWidth / 2;

  // Gets the actual size of the phone
  const phoneWidth = width - strokeWidth;
  const phoneHeight = height - strokeWidth;

  // Gets the center of the image
  const xPos = (canvasWidth - phoneWidth) / 2 - offset;

  return `
  <svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
    <rect x="${xPos}" y="300" width="${phoneWidth}px" height="${phoneHeight}px"
      fill="none" stroke="black" stroke-linejoin="round"
           stroke-width="${strokeWidth}" rx="${strokeWidth}" ry="${strokeWidth}" />
  </svg>
`;
};
module.exports = createPhoneSvg;
