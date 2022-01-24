const fs = require("fs");
const conf = require("./helpers/Configuration.js");
const calculator = require("./helpers/Calculator.js");

function doCalculations(inputContent) {
  conf
    .getConfigurationFromAPI()
    .then((configuration) =>
      calculator.calculateFeesFromGivenArray(inputContent, configuration)
    )
    .then((result) => result.forEach((element) => console.log(element)));
}

if (process.argv[2] === undefined) {
  throw new Error("No transaction file found");
} else {
  const inputData = fs.readFileSync(process.argv[2]);
  const inputContent = JSON.parse(inputData);
  doCalculations(inputContent);
}
