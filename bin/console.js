#! /usr/bin/env node
var shell = require("shelljs");

shell.exec("echo " + process.argv[2] + process.argv[3]);