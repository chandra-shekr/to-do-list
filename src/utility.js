//jshint esversion:6

"use strict";
import pg from "pg";
import fs from "fs";

const db = new pg.Client({
  host: process.env.PDB_HOST,
  user: process.env.PDB_USER,
  password: process.env.PDB_PASS,
  database: process.env.PDB,
});

db.connect()
  .then((res) => console.debug(`connected to database ${process.env.PDB}`))
  .catch((err) => console.error(err));

let getDate = function () {
  const today = new Date();
  const options = { month: "long", day: "numeric", weekday: "long" };

  return today.toLocaleDateString("en-US", options);
};

String.prototype.title = function () {
  return this.split(" ")
    .map((c) => c.charAt(0).toUpperCase() + c.substring(1).toLowerCase())
    .join(" ");
};

const executeQuery = async (file, ...args) => {
  try {
    let query = fs.readFileSync(file, { encoding: "utf8" });
    let q = await db.query(query, args);
    return q;
  } catch (err) {
    console.log(err);
    return err.message;
  }
};

export default db;
export { getDate, executeQuery };
