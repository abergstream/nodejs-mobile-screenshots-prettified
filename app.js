const sharp = require("sharp");
const process = require("process");
const prompt = require("prompt-sync")();

const createPhoneSvg = require("./src/service/phoneSvg.js");
const createGradientSVG = require("./src/service/gradientSvg.js");
let color1 = prompt("Color 1? (#777777 if empty) ");
let color2 = prompt("Color 2? (#CCCCCC if empty) ");
color1 = color1 ? color1 : "#777";
color2 = color2 ? color2 : "#CCC";

// Paths to the image
const outputPath = "./testOutput2.png"; // Path for the output image

const canvasWidth = 1080;
const canvasHeight = 2400;

const phoneWidth = 700;
const phoneHeight = 1300;

// Create gradient background buffer
const gradientSVG = createGradientSVG(
  canvasWidth,
  canvasHeight,
  color1,
  color2
);
// Create phoneSVG buffer
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
