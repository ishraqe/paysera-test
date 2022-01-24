const moment = require("moment");

moment.locale("lt", {
  week: {
    dow: 1
  }
});

const transactions = {};

const insertTransaction = (transaction) => {
  if (transaction.user_type === "natural" && transaction.type === "cash_out") {
    const userId = transaction.user_id;
    if (userId in transactions) {
      const userTransactions = transactions[userId];
      userTransactions.push(transaction);
    } else {
      transactions[userId] = [transaction];
    }
  }
};

const getAmount = (userId, dateForTheWeek) => {
  const transactionsForUser = transactions[userId];
  if (transactionsForUser) {
    const transactionsInTheWeek = transactionsForUser.filter((transaction) =>
      moment(dateForTheWeek).isSame(transaction.date, "week")
    );
    let amountsForThisWeek = [];
    if (transactionsInTheWeek) {
      amountsForThisWeek = transactionsInTheWeek.map(
        (transaction) => transaction.operation.amount
      );
    }
    return amountsForThisWeek.reduce((a, b) => a + b, 0);
  }
  return 0;
};

module.exports.insertTransaction = insertTransaction;
module.exports.getAmount = getAmount;
