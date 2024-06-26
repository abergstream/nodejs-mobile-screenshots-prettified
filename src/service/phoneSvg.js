const createPhoneSvg = (
  canvasWidth,
  canvasHeight,
  width,
  height,
  strokeWidth,
  xPosition,
  yPosition,
  model
) => {
  // Gets the actual size of the phone

  let phoneWidth = width - 2;
  let phoneHeight = height - 2;
  let startX = xPosition;
  let startY = yPosition;

  // if (model == "tablet7") {
  // phoneWidth = width - 10;
  // phoneHeight = height + 10;
  // startY -= 2;
  // } else if (model == "tablet10") {
  // startX -= 2;
  // }
  // Gets the center of the image
  // const xPos = (canvasWidth - phoneWidth) / 2;

  return `

  <svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
    <rect x="${startX}" y="${startY}px" width="${phoneWidth}px" height="${phoneHeight}px"
      fill="none" stroke="black" stroke-linejoin="round"
           stroke-width="${strokeWidth}" rx="${strokeWidth * 2}" ry="${
    strokeWidth * 2
  }" />
  </svg>
`;
};
module.exports = createPhoneSvg;
