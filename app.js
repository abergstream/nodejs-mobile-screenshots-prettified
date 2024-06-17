const sharp = require("sharp");
const process = require("process");
const prompt = require("prompt-sync")();
const prompts = require("prompts");
(async () => {
  const query = await prompts([
    {
      type: "text",
      name: "color1",
      message: "Color 1 (#777 if empty) ",
    },
    {
      type: "text",
      name: "color2",
      message: "Color 1 (#CCC if empty) ",
    },
    {
      type: "select",
      name: "color",
      message: "Pick a color",
      choices: [
        {
          title: "Red",
          description: "This option has a description.",
          value: "#ff0000",
        },
        { title: "Green", value: "#00ff00" },
        { title: "Yellow", value: "#ffff00", disabled: true },
        { title: "Blue", value: "#0000ff" },
      ],
    },
  ]);

  const createPhoneSvg = require("./src/service/phoneSvg.js");
  const createGradientSVG = require("./src/service/gradientSvg.js");
  // let color1 = prompt("Color 1? (#777777 if empty) ");
  // let color2 = prompt("Color 2? (#CCCCCC if empty) ");

  const color1 = query.color1 ? query.color1 : "#777";
  const color2 = query.color2 ? query.color2 : "#CCC";

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
  const phoneSVG = createPhoneSvg(
    canvasWidth,
    canvasHeight,
    phoneWidth,
    phoneHeight
  );

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
                top: 0,
                left: 0,
              },
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
          console.error("Error creating phone buffer:", err);
        });
    })
    .catch((err) => {
      console.error("Error creating gradient buffer:", err);
    });
})();
