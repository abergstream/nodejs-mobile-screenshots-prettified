const makeNewPrintscreen = require("./src/service/createPrintscreen.js");
const getInfo = require("./src/service/info.js");
const device = {
  android: {
    phone: {
      canvasWidth: 1080,
      canvasHeight: 2400,
      deviceWidth: 837,
      deviceHeight: 1830,
    },
    tablet7: {
      canvasWidth: 800,
      canvasHeight: 1280,
      deviceWidth: 630,
      deviceHeight: 995,
    },
    tablet10: {
      canvasWidth: 2560,
      canvasHeight: 1600,
      deviceWidth: 2000,
      deviceHeight: 1250,
    },
  },
};
const deviceOrder = [
  "phone",
  "phone",
  "tablet7",
  "tablet7",
  "tablet10",
  "tablet10",
];
(async () => {
  const info = await getInfo();
  for (let i = 1; i <= 6; i++) {
    const model = deviceOrder[i - 1];
    info["canvasWidth"] = device[info.phone][model].canvasWidth;
    info["canvasHeight"] = device[info.phone][model].canvasHeight;
    info["phoneWidth"] = device[info.phone][model].deviceWidth;
    info["phoneHeight"] = device[info.phone][model].deviceHeight;
    await makeNewPrintscreen(info, model, i);
  }
})();
