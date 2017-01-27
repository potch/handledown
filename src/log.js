const chalk = require('chalk');

function log(...args) {
  console.log(...args);
}

log.warn = function (msg) {
  console.warn(chalk.yellow(msg));
};
log.success = function (msg) {
  console.log(chalk.green(msg));
}
log.error = function (msg) {
  console.error(chalk.red(msg));
};

module.exports = log;
