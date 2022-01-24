const conf = require("./Configuration.js");
const db = require("./DataBase.js");

const roundUp = (num) => {
  return (Math.ceil(num * 100) / 100).toFixed(2);
};

const getPosition = (num) => {
  if (Math.sign(num) === -1) {
    return 0;
  }
  return num;
};

const calculateInFee = (transaction, configuration) => {
  const fee = transaction.operation.amount * configuration.percents * 0.01;
  return roundUp(Math.min(fee, configuration.max.amount));
};

const calculateJuridicalFee = (transaction, configuration) => {
  const fee = transaction.operation.amount * configuration.percents * 0.01;
  return roundUp(Math.max(fee, configuration.min.amount));
};

const calculateNaturalFee = (transaction, configuration) => {
  const thisWeeksTransactionsForTheUser = db.getAmount(
    transaction.user_id,
    transaction.date
  );
  const amountOfThisTransaction = transaction.operation.amount;
  const weekLimit = configuration.week_limit.amount;
  const freeOfCharge = getPosition(weekLimit - thisWeeksTransactionsForTheUser);
  const amountChargeable = getPosition(amountOfThisTransaction - freeOfCharge);
  return roundUp(amountChargeable * configuration.percents * 0.01);
};

const calculateTransactionFee = (transaction, config) => {
  const configuration =
    config === undefined ? conf.defaultConfiguration : config;
  let fee;
  if (transaction.type === "cash_in") {
    fee = calculateInFee(transaction, configuration.cashInConfiguration);
  } else if (transaction.type === "cash_out") {
    if (transaction.user_type === "juridical") {
      fee = calculateJuridicalFee(
        transaction,
        configuration.cashOutJuridicalConfiguration
      );
    } else if (transaction.user_type === "natural") {
      fee = calculateNaturalFee(
        transaction,
        configuration.cashOutNaturalConfiguration
      );
    } else {
      throw new Error("Wrong user type");
    }
  } else {
    throw new Error("Wrong transaction type");
  }

  db.insertTransaction(transaction);
  return fee;
};

const calculateFeesFromGivenArray = (transactions, configuration) =>
  transactions.map((transaction) =>
    calculateTransactionFee(transaction, configuration)
  );

module.exports.calculateFeesFromGivenArray = calculateFeesFromGivenArray;
