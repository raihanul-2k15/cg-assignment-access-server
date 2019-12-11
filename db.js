const sqlite3 = require("sqlite3").verbose();
const { starsRequired } = require("./config");
const { getStarGazersCount } = require("./github");

const prepareDB = () => {
  const db = new sqlite3.Database("db.sqlite");
  db.run(
    "CREATE TABLE IF NOT EXISTS allowed(roll INT PRIMARY KEY, name TEXT);",
    [],
    err =>
      err ? console.log(err) : console.log("Databse prepared! Server ready!")
  );
};
prepareDB();

const isAllowed = roll => {
  const db = new sqlite3.Database("db.sqlite");

  return new Promise(res => {
    db.get(`SELECT * from allowed WHERE roll = ${roll};`, [], (err, row) => {
      row !== undefined ? res(row) : res(false);
      db.close();
    });
  });
};

const allowNewPerson = ({ roll, name }) => {
  const db = new sqlite3.Database("db.sqlite");

  return new Promise((res, rej) => {
    db.run(
      `INSERT INTO allowed(roll, name) VALUES(${roll}, '${name}');`,
      [],
      err => {
        if (err) {
          console.log(err);
          rej(err);
        } else {
          res();
        }
      }
    );
  });
};

const getAllAllowed = () => {
  const db = new sqlite3.Database("db.sqlite");

  return new Promise(res => {
    db.all("SELECT * from allowed;", [], (err, rows) => {
      let names = {};
      rows.forEach(r => (names[r.roll] = r.name));
      res(names);
      db.close();
    });
  });
};

module.exports = { isAllowed, allowNewPerson, getAllAllowed };
