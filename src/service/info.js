const prompts = require("prompts");
const { argv } = require("process");
const {
  qPhone,
  qColor1,
  qColor2,
  qGradientSetting,
  qAdvancedGradient,
  qBasicGradient,
} = require("./questions.js");

const argPhone = argv[2];
const argColor1 = argv[3];
const argColor2 = argv[4];
const argGradientSetting = argv[5];

const device = {
  android: {
    phone: {
      canvasWidth: 1080,
      canvasHeight: 2400,
      deviceWidth: 700,
      deviceHeight: 1380,
    },
    tablet7: {
      canvasWidth: 1080,
      canvasHeight: 1920,
      deviceWidth: 900,
      deviceHeight: 1780,
    },
    tablet10: {
      canvasWidth: 2460,
      canvasHeight: 1600,
      deviceWidth: 1500,
      deviceHeight: 900,
    },
  },
};

const getInfo = async () => {
  const info = {
    phone: argPhone || (await prompts(qPhone)).phone,
    color1: argColor1 || (await prompts(qColor1)).color1,
    color2: argColor2 || (await prompts(qColor2)).color2,
  };

  const gradientSetting =
    argGradientSetting || (await prompts(qGradientSetting)).gradientSetting;

  // Different gradient questions depending on advanced / basic
  let gradientPosition;
  // If argv is set to basic, choose top to bottom
  if (argGradientSetting === "basic") {
    gradientPosition = qBasicGradient.choices[0].value;
  } else {
    gradientPosition = await prompts(
      gradientSetting === "advanced" ? qAdvancedGradient : qBasicGradient
    );
  }
  info["gradientPosition"] = gradientPosition;

  // Hard coded modele for testing
  const model = "phone";
  info["canvasWidth"] = device[info.phone][model].canvasWidth;
  info["canvasHeight"] = device[info.phone][model].canvasHeight;
  info["phoneWidth"] = device[info.phone][model].deviceWidth;
  info["phoneHeight"] = device[info.phone][model].deviceHeight;
  return info;
};
module.exports = getInfo;
