const prompts = require("prompts");
const { argv } = require("process");
const {
  qPhone,
  qColor1,
  qColor2,
  qGradientSetting,
  qAdvancedGradient,
  qBasicGradient,
  qText1,
  qText2,
} = require("./questions.js");

const argPhone = argv[2];
const argColor1 = argv[3];
const argColor2 = argv[4];
const argGradientSetting = argv[5];

const getInfo = async () => {
  const info = {
    phone: argPhone || (await prompts(qPhone)).phone,
    color1: argColor1 || (await prompts(qColor1)).color1,
    color2: argColor2 || (await prompts(qColor2)).color2,
    text1: (await prompts(qText1)).text1,
    text2: (await prompts(qText2)).text2,
  };

  const gradientSetting =
    argGradientSetting || (await prompts(qGradientSetting)).gradientSetting;

  // Different gradient questions depending on advanced / basic
  let gradientPosition;
  // If argv is set to basic, choose top to bottom
  if (argGradientSetting === "basic") {
    gradientPosition = { gradient: qBasicGradient.choices[0].value };
  } else {
    gradientPosition = await prompts(
      gradientSetting === "advanced" ? qAdvancedGradient : qBasicGradient
    );
  }
  info["gradientPosition"] = gradientPosition;
  return info;
};
module.exports = getInfo;
