const sharp = require("sharp");
const prompts = require("prompts");
const { argv } = require("process");
const fs = require("fs");
const newFolder = "newScreenshots";
if (!fs.existsSync(newFolder)) {
  // Do something

  fs.mkdir(newFolder, (err) => {
    if (err) {
      return console.error(err);
    }
    console.log("Directory created successfully!");
  });
}
const createPhoneSvg = require("./phoneSvg.js");
const createGradientSVG = require("./gradientSvg.js");

const makeNewPrintscreen = async (info, model, number) => {
  // If argv has no value, open prompts
  const {
    canvasWidth,
    canvasHeight,
    phoneWidth,
    phoneHeight,
    color1,
    color2,
    gradientPosition,
  } = info;
  // Paths to the image
  const outputPath = `./${newFolder}/screenshot_${number}.png`; // Path for the output image

  const strokeWidth = 10;

  // const screenshot = "./img_templates/testScreenshot.png"; // Image to be placed in the middle
  const screenshot = `./${number}.png`;
  const screenshotImage = sharp(screenshot);

  // Phone position
  const phoneCenterX = Math.round(
    (canvasWidth - phoneWidth) / 2 + strokeWidth / 2
  );
  const phoneCenterY = Math.round(
    (canvasHeight - phoneHeight) / 2 + strokeWidth / 2
  );

  // Variables in case we want the phone elsewhere
  let phonePositionX = phoneCenterX;
  let phonePositionY = phoneCenterY;
  if (model == "tablet10") {
    phonePositionY += 100;
  }
  // Phonewidth minus the frame
  const screenshotWidth = phoneWidth - strokeWidth * 2;
  const screenshotHeight = phoneHeight;

  // Screenshot placement
  const mainImageTop = Math.round(phonePositionY + strokeWidth / 2);
  const mainImageLeft =
    Math.round((canvasWidth - phoneWidth) / 2) + strokeWidth;

  // Create gradient background buffer
  const gradientSVG = createGradientSVG(
    canvasWidth,
    canvasHeight,
    color1,
    color2,
    gradientPosition.gradient ? gradientPosition.gradient : gradientPosition
  );
  // Create phoneSVG buffer
  const phoneSVG = createPhoneSvg(
    canvasWidth,
    canvasHeight,
    phoneWidth,
    phoneHeight,
    strokeWidth,
    phonePositionX,
    phonePositionY,
    model
  );
  sharp(Buffer.from(gradientSVG))
    .png()
    .toBuffer()
    .then((gradientBuffer) => {
      sharp(Buffer.from(phoneSVG))
        .png()
        .toBuffer()
        .then((phoneBuffer) => {
          screenshotImage
            .resize(screenshotWidth, screenshotHeight)
            .toBuffer()
            .then((screenshotBuffer) => {
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
                    input: screenshotBuffer,
                    top: mainImageTop,
                    left: mainImageLeft,
                  }, // Apply screenshot in the middle
                  { input: phoneBuffer, top: 0, left: 0 }, // Apply phone SVG
                ])
                .removeAlpha() // Removes alpha channel
                .toFile(outputPath, (err, info) => {
                  if (err) {
                    console.error("Error merging images:", err);
                  } else {
                    console.log("Images merged successfully:", info);
                  }
                });
            })
            .catch((err) => {
              console.error("Error creating screenshot buffer:", err);
            });
        })
        .catch((err) => {
          console.error("Error creating phone buffer:", err);
        });
    })
    .catch((err) => {
      console.error("Error creating gradient buffer:", err);
    });
};
module.exports = makeNewPrintscreen;
