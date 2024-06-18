const sharp = require("sharp");
const { argv } = require("process");
const prompts = require("prompts");

const argPhone = argv[2];
const argColor1 = argv[3];
const argColor2 = argv[4];
const argGradientSetting = argv[5];
const qPhone = {
  type: "select",
  name: "phone",
  message: "Screenshots for Android or iPhone?",
  choices: [
    {
      title: "Android",
      value: "android",
    },
    {
      title: "iPhone",
      value: "iphone",
    },
  ],
};
const qColor1 = {
  type: "text",
  name: "color1",
  initial: "#777777",
  message: "Color 1 (#777777 if empty) ",
};
const qColor2 = {
  type: "text",
  name: "color2",
  initial: "#CCCCCC",
  message: "Color 2 (#CCCCCC if empty) ",
};
const qGradientSetting = {
  type: "select",
  name: "gradientSetting",
  message: "Gradient",
  choices: [
    {
      title: "Basic",
      description: "More basic settings for gradient",
      value: "basic",
    },
    {
      title: "Advanced",
      description: "This will give you more settings and possibilites",
      value: "advanced",
    },
  ],
};
const advancedGradient = [
  {
    type: "text",
    name: "x1",
    initial: "0%",
    message: "Gradient x1: ",
  },
  {
    type: "text",
    name: "y1",
    initial: "0%",
    message: "Gradient y1: ",
  },
  {
    type: "text",
    name: "x2",
    initial: "0%",
    message: "Gradient x2: ",
  },
  {
    type: "text",
    name: "y2",
    initial: "100%",
    message: "Gradient y2: ",
  },
];
const basicGradient = {
  type: "select",
  name: "gradient",
  message: "Gradient",
  choices: [
    {
      title: "Top to bottom",
      value: {
        x1: "0%",
        x2: "0%",
        y1: "0%",
        y2: "100%",
      },
    },
    {
      title: "Top left to bottom right",
      value: {
        x1: "0%",
        x2: "100%",
        y1: "0%",
        y2: "100%",
      },
    },
    {
      title: "Top right to bottom left",
      value: {
        x1: "100%",
        x2: "0%",
        y1: "0%",
        y2: "100%",
      },
    },
    {
      title: "Left to right",
      value: {
        x1: "0%",
        x2: "100%",
        y1: "0%",
        y2: "0%",
      },
    },
  ],
};
(async () => {
  // If argv has no value, open prompts
  const phone = argPhone || (await prompts(qPhone)).phone;
  const color1 = argColor1 || (await prompts(qColor1)).color1;
  const color2 = argColor2 || (await prompts(qColor2)).color2;
  const gradientSetting =
    argGradientSetting || (await prompts(qGradientSetting)).gradientSetting;

  // Different gradient questions depending on advanced / basic
  let gradientPosition;

  // If argv is set to basic, choose top to bottom
  if (argGradientSetting === "basic") {
    gradientPosition = basicGradient.choices[0].value;
  } else {
    gradientPosition = await prompts(
      gradientSetting === "advanced" ? advancedGradient : basicGradient
    );
  }

  const createPhoneSvg = require("./src/service/phoneSvg.js");
  const createGradientSVG = require("./src/service/gradientSvg.js");

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
    color2,
    gradientPosition.gradient ? gradientPosition.gradient : gradientPosition
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
