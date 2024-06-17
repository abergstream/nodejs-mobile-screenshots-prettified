const sharp = require("sharp");
const fs = require("fs");
const TextToSVG = require("text-to-svg");

// Paths to the images
const framePath = "./img_templates/testFrame2.png"; // Image with alpha channel
const mainImagePath = "./img_templates/testScreenshot.png"; // Image to be placed in the middle
const outputPath = "./testOutput.png"; // Path for the output image
const fontPath = "./oswald.ttf"; // Path to your custom font

// Desired size and position for the main image
const mainImageWidth = 560;
const mainImageHeight = 1118;

// Text to be added
const title = "Your Text Here";

// Load the font using text-to-svg
TextToSVG.load(fontPath, (err, textToSVG) => {
  if (err) {
    console.error("Error loading font:", err);
    return;
  }

  // Load the images
  const frameImage = sharp(framePath);
  const mainImage = sharp(mainImagePath);

  // Get the metadata of the frame image to determine its size
  frameImage
    .metadata()
    .then((frameMetadata) => {
      const frameWidth = frameMetadata.width;
      const frameHeight = frameMetadata.height;

      const attributes = { fill: "white", stroke: "none" };
      const options = {
        x: 0,
        y: 0,
        fontSize: 50,
        anchor: "top",
        attributes: attributes,
      };
      const svgText = textToSVG.getSVG(title, options);

      // Positions for the screenshot
      const mainImageTop = 570;
      const mainImageLeft = Math.round((frameWidth - mainImageWidth) / 2);

      // Resize the main image to the specified dimensions (560x1118)
      mainImage
        .resize(mainImageWidth, mainImageHeight, {
          fit: sharp.fit.cover,
        })
        .toBuffer()
        .then((mainImageBuffer) => {
          // Create the text image using Sharp with SVG
          const textSvg = `
            <svg width="${frameWidth}" height="${frameHeight}" xmlns="http://www.w3.org/2000/svg">
              ${svgText}
            </svg>
          `;

          sharp(Buffer.from(textSvg))
            .png()
            .toBuffer()
            .then((textImageBuffer) => {
              // Create a blank image with the same dimensions as the frame
              sharp({
                create: {
                  width: frameWidth,
                  height: frameHeight,
                  channels: 3, // Ensure alpha channel is included
                  background: { r: 0, g: 0, b: 0 }, // Transparent background
                },
              })
                .removeAlpha() // Ensure the final image has no alpha channel

                .composite([
                  {
                    input: mainImageBuffer,
                    left: mainImageLeft,
                    top: mainImageTop,
                  }, // Main image with absolute positioning
                  { input: framePath, gravity: "northwest" }, // Frame image with northwest gravity to keep its original position
                  { input: textImageBuffer, top: 200, left: 50 }, // Text image with absolute positioning
                ])
                .toFile(outputPath, (err, info) => {
                  if (err) {
                    console.error("Error merging images:", err);
                  } else {
                    console.log("Images merged successfully:", info);
                  }
                });
            })
            .catch((err) => {
              console.error("Error creating text image buffer:", err);
            });
        })
        .catch((err) => {
          console.error("Error resizing main image:", err);
        });
    })
    .catch((err) => {
      console.error("Error getting frame image metadata:", err);
    });
});
