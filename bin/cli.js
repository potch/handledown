#! /usr/bin/env node
let start = Date.now();
const build = require('../src/index.js');
const chalk = require('chalk');

let numWritten = build(process.cwd());
console.log(chalk.green(`wrote ${numWritten} pages in ${Date.now() - start} ms`));
