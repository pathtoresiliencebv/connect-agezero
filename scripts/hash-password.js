#!/usr/bin/env node
/* eslint-disable no-console */
const bcrypt = require("bcryptjs");

const plain = process.argv[2];
if (!plain) {
  console.error("Usage: node scripts/hash-password.js <plain-password>");
  process.exit(1);
}

const hash = bcrypt.hashSync(plain, 10);
console.log(hash);
