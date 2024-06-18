// Create the gradient background SVG
const createGradientSVG = (
  width,
  height,
  color1,
  color2,
  gradientPositions
) => `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad1" x1="${gradientPositions.x1}" y1="${gradientPositions.y1}" x2="${gradientPositions.x2}" y2="${gradientPositions.y2}">
        <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad1)" />
  </svg>
`;

module.exports = createGradientSVG;
