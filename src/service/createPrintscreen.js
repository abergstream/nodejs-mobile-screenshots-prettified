const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const TextToSVG = require("text-to-svg");

const newFolder = "newScreenshots";
const createPhoneSvg = require("./phoneSvg.js");
const createGradientSVG = require("./gradientSvg.js");

// Load fonts and initialize textToSVG
const fontPath = path.join(__dirname, "../fonts/Lato-Regular.ttf");
const textToSVG = TextToSVG.loadSync(fontPath);

if (!fs.existsSync(newFolder)) {
  fs.mkdirSync(newFolder);
  console.log("Directory created successfully!");
}

const makeNewPrintscreen = async (info, model, number) => {
  const {
    canvasWidth,
    canvasHeight,
    phoneWidth,
    phoneHeight,
    color1,
    color2,
    gradientPosition,
    text1,
    text2,
  } = info;

  const outputPath = `./${newFolder}/screenshot_${number}.png`;
  const screenshot = `./${number}.png`;
  const screenshotImage = sharp(screenshot);

  const strokeWidth = 15;
  const phoneCenterX = Math.round(
    (canvasWidth - phoneWidth) / 2 + strokeWidth / 2
  );
  const phoneCenterY = Math.round(
    (canvasHeight - phoneHeight) / 2 + strokeWidth / 2
  );

  let phonePositionY = phoneCenterY - 150;
  let textPositionY = phonePositionY + phoneHeight + 100;
  let fontsize = 52;
  if (model === "tablet7") {
    phonePositionY = phoneCenterY - 50;
    textPositionY = phonePositionY + phoneHeight + 50;
    fontsize = 32;
  } else if (model === "tablet10") {
    phonePositionY = phoneCenterY - 100;
    textPositionY = phonePositionY + phoneHeight + 50;
    fontsize = 64;
  }
  // Generate SVG text
  const textOptions = {
    x: 0,
    y: 0,
    fontSize: fontsize,
    anchor: "top",
    attributes: { fill: "#FFFFFF" },
  };
  // The script will fail if the text is empty, adds a space if it is
  let text1Corrected = text1 ? text1 : " ";
  let text2Corrected = text2 ? text2 : " ";

  const text = number % 2 !== 0 ? text1Corrected : text2Corrected;

  const svgText = textToSVG.getSVG(text, textOptions);
  const textPositionX = Math.round(
    (canvasWidth - textToSVG.getWidth(text, textOptions)) / 2
  );
  const screenshotWidth = phoneWidth - strokeWidth;
  const screenshotHeight = phoneHeight - strokeWidth;
  const screenshotPositionY = Math.round(phonePositionY + strokeWidth / 2) - 2;
  const screenshotPositionX =
    Math.round((canvasWidth - phoneWidth) / 2) + strokeWidth;

  const gradientSVG = createGradientSVG(
    canvasWidth,
    canvasHeight,
    color1,
    color2,
    gradientPosition
  );
  const phoneSVG = createPhoneSvg(
    canvasWidth,
    canvasHeight,
    phoneWidth,
    phoneHeight,
    strokeWidth,
    phoneCenterX,
    phonePositionY,
    model
  );

  const imageData = [
    gradientSVG,
    phoneSVG,
    screenshot,
    screenshotWidth,
    screenshotHeight,
    canvasWidth,
    canvasHeight,
    textPositionY,
    textPositionX,
    screenshotPositionY,
    screenshotPositionX,
    outputPath,
    number,
    svgText,
  ];
  createImage(imageData);
};

function createImage(data) {
  const [
    gradientSVG,
    phoneSVG,
    screenshot,
    screenshotWidth,
    screenshotHeight,
    canvasWidth,
    canvasHeight,
    textPositionY,
    textPositionX,
    screenshotPositionY,
    screenshotPositionX,
    outputPath,
    number,
    svgText,
  ] = data;
  Promise.all([
    sharp(Buffer.from(gradientSVG)).png().toBuffer(),
    sharp(Buffer.from(phoneSVG)).png().toBuffer(),
    sharp(screenshot).resize(screenshotWidth, screenshotHeight).toBuffer(),
    sharp(Buffer.from(svgText)).png().toBuffer(),
  ])
    .then(([gradientBuffer, phoneBuffer, screenshotBuffer, textBuffer]) => {
      sharp({
        create: {
          width: canvasWidth,
          height: canvasHeight,
          channels: 3,
          background: { r: 255, g: 255, b: 255 },
        },
      })
        .composite([
          { input: gradientBuffer, top: 0, left: 0 },
          {
            input: textBuffer,
            top: textPositionY,
            left: textPositionX,
          },
          {
            input: screenshotBuffer,
            top: screenshotPositionY,
            left: screenshotPositionX,
          },
          { input: phoneBuffer, top: 0, left: 0 },
        ])
        .removeAlpha()
        .toFile(outputPath, (err, info) => {
          if (err) {
            console.error("Error merging images:", err);
          } else {
            // console.log("Images merged successfully:", info);
            console.log(`Image ${number}.png merged successfully`);
          }
        });
    })
    .catch((err) => {
      console.error(`Error processing ${number}.png:`, err);
    });
}

module.exports = makeNewPrintscreen;
