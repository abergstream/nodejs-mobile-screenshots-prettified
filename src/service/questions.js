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
      disabled: true,
    },
  ],
};
const qColor1 = {
  type: "text",
  name: "color1",
  initial: "#777777",
  message: "Background color 1 (#777777 if empty) ",
};
const qColor2 = {
  type: "text",
  name: "color2",
  initial: "#CCCCCC",
  message: "Background color 2 (#CCCCCC if empty) ",
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
const qAdvancedGradient = [
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
const qBasicGradient = {
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
const maxLength = 35;
const qText1 = [
  {
    type: "text",
    name: "text1",
    message: "Text for startpage",
    validate: (value) =>
      value.length > maxLength
        ? `Max characters ${maxLength}, value is ${value.length}`
        : true,
  },
];
const qText2 = [
  {
    type: "text",
    name: "text2",
    message: "Text for archive",
    validate: (value) =>
      value.length > maxLength
        ? `Max characters ${maxLength}, value is ${value.length}`
        : true,
  },
];
const qTextColor = {
  type: "text",
  name: "textColor",
  initial: "#000000",
  message: "Text color (#000000 if empty) ",
};
module.exports = {
  qPhone,
  qColor1,
  qColor2,
  qGradientSetting,
  qAdvancedGradient,
  qBasicGradient,
  qText1,
  qText2,
  qTextColor,
};
