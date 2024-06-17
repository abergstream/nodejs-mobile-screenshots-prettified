const sharp = require("sharp");
const process = require("process");

// Printing process.argv property value
var args = process.argv;

console.log(args);
const color1 = args[2];
const color2 = args[3];
// Paths to the images
const outputPath = "./testOutput2.png"; // Path for the output image

// Create the gradient background SVG
const createGradientSVG = (width, height) => `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad1)" />
  </svg>
`;

const createPhoneSvg = (width, height) => {
  const strokeWidth = 30;
  const phoneWidth = width - strokeWidth;
  const phoneHeight = height - strokeWidth;
  return `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect x="${strokeWidth / 2}" y="${
    strokeWidth / 2
  }" width="${phoneWidth}px" height="${phoneHeight}px" fill="none" stroke="black" stroke-linejoin="round" stroke-width="${strokeWidth}" rx="${strokeWidth}" ry="${strokeWidth}" />
    
  </svg>
`;
};

const canvasWidth = 1080;
const canvasHeight = 2400;

const phoneWidth = 700;
const phoneHeight = 1300;
// Create gradient background buffer
const gradientSVG = createGradientSVG(canvasWidth, canvasHeight);
const phoneSVG = createPhoneSvg(phoneWidth, phoneHeight);

sharp(Buffer.from(gradientSVG))
  .png()
  .toBuffer()
  .then((gradientBuffer) => {
    sharp(Buffer.from(phoneSVG))
      .png()
      .toBuffer()
      .then((phoneBuffer) => {
        // Create a blank canvas with the desired background color (white in this case)
        sharp({
          create: {
            width: canvasWidth,
            height: canvasHeight,
            channels: 3, // No alpha channel
            background: { r: 255, g: 255, b: 255 }, // White background
          },
        })
          .composite([
            { input: gradientBuffer, top: 0, left: 0 }, // Apply gradient background
            {
              input: phoneBuffer,
              top: 300,
              left: (canvasWidth - phoneWidth) / 2,
            }, // Center the phone SVG horizontally
          ])
          .removeAlpha()
          .toFile(outputPath, (err, info) => {
            if (err) {
              console.error("Error merging images:", err);
            } else {
              console.log("Images merged successfully:", info);
            }
          });
      })
      .catch((err) => {
        console.error("Error creating phone buffer:", err);
      });
  })
  .catch((err) => {
    console.error("Error creating gradient buffer:", err);
  });
