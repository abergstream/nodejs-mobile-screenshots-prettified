const makeNewPrintscreen = require("./src/service/createPrintscreen.js");
const getInfo = require("./src/service/info.js");

(async () => {
  const info = await getInfo();
  // let i = 1;
  for (let i = 1; i < 3; i++) {
    makeNewPrintscreen(info, i);
  }
})();
