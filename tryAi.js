const fs = require("fs");
const classifyImages = require("./helpers/googleVision");

const imageFile = fs.readFileSync(
  "./iPhone-SE-2022-Starlight-Back-in-Hand.jpg"
);
async function main() {
  const hasElectronics = await classifyImages([imageFile]);
  console.log(hasElectronics);
}
main();