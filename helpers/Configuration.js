const fs = require("fs");
const fetch = require("node-fetch");

const CONFIG_URLS = [
  "http://private-38e18c-uzduotis.apiary-mock.com/config/cash-in",
  "http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/juridical",
  "http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/natural"
];

const defaultConfiguration = {
  cashInConfiguration: JSON.parse(
    fs.readFileSync("configDB/cash-in-config.json")
  ),
  cashOutJuridicalConfiguration: JSON.parse(
    fs.readFileSync("configDB/cash-out-legal-config.json")
  ),
  cashOutNaturalConfiguration: JSON.parse(
    fs.readFileSync("configDB/cash-out-natural-config.json")
  )
};

const getConfigurationFromAPI = () => {
  const requests = CONFIG_URLS.map((url) =>
    fetch(url)
      .then((responce) => responce.text())
      .then((text) => JSON.parse(text))
  );

  return Promise.all(requests).then((responses) => ({
    cashInConfiguration: responses[0],
    cashOutJuridicalConfiguration: responses[1],
    cashOutNaturalConfiguration: responses[2]
  }));
};

module.exports.getConfigurationFromAPI = getConfigurationFromAPI;
module.exports.defaultConfiguration = defaultConfiguration;
