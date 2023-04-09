const express = require('express');
const app = express();
const mysql = require('mysql');

// Create a connection to the database replace **** according to your need
const con = mysql.createConnection({
  host: '*******',
  user: '******',
  password: '******',
  database: '******'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

// Create a personTable to the database and insert data
let personTable = "CREATE TABLE IF NOT EXISTS person (id INT AUTO_INCREMENT PRIMARY KEY,name TEXT NOT NULL)";
  con.query(personTable, function (err) {
    if (err) throw err;
    console.log("personTable created");
  });
  let personData = "INSERT IGNORE INTO person VALUES (1, 'unknown'), (2, 'Darrow'), (3, 'Geralt'), (4, 'Kosh')";
 con.query(personData, function (err, result) {
  if (err) throw err;
  console.log("Number of records inserted: " + result.affectedRows);
});

// Create a ownedObjectTable to the database and insert data
let ownedObjectTable = "CREATE TABLE IF NOT EXISTS owned_object( id INT AUTO_INCREMENT PRIMARY KEY, name TEXT NOT NULL,info TEXT)";
con.query(ownedObjectTable, function (err) {
    if (err) throw err;
    console.log("ownedObjectTable created");
  });
let ownedObjectData = "INSERT IGNORE INTO owned_object VALUES (1, 'razor', ''), (2, 'pendant', 'wolf-shaped'), " +
    "(3,'silver sword', ''), (4, 'pendant', 'Pegasos-shaped'), (5, 'rubber duck', ''), " +
    "(6, 'encounter suit', 'strange'), (7, 'spacecraft', 'Pax'), (8, 'spacecraft', 'Vorlon transport')" ;
con.query(ownedObjectData, function (err, result) {
  if (err) throw err;
  console.log("Number of records inserted: " + result.affectedRows);
});

// Create a acquisitionTable to the database and insert data
let acquisitionTable = "CREATE TABLE IF NOT EXISTS acquisition (\n" +
    "id INTEGER NOT NULL AUTO_INCREMENT, acquisition_datetime DATETIME NOT NULL, owner INT NOT NULL,\n" +
    "item INT NOT NULL,\n" +
    "PRIMARY KEY (id),\n" +
    "FOREIGN KEY (item) REFERENCES owned_object(id), FOREIGN KEY (owner) REFERENCES person(id))";
con.query(acquisitionTable, function (err) {
    if (err) throw err;
    console.log("ownedObjectTable created");
  });
let acquisitionData = "INSERT IGNORE INTO acquisition VALUES (1, '1238-05-02 03:17:03', 3, 2), " +
    "(2, '1252-12-04 23:02:42', 3, 3), (3, '3402-02-16 13:07:12', 2, 1), " +
    "(4, '3401-01-14 22:00:06', 2, 4), (5, '2259-04-07 10:41:00', 4, 6), " +
    "(6, '3402-04-19 15:05:16', 2, 7), (7, '2250-03-22 00:11:13', 4, 8) ";
con.query(acquisitionData, function (err, result) {
  if (err) throw err;
  console.log("Number of records inserted: " + result.affectedRows);
});
});


app.get('/items', (req, res) => {

    con.query("SELECT name, info FROM owned_object ORDER BY name ASC, info", (err, result) => {
    if (err) throw err;
    res.json(result);
  });

});

app.get('/acquisitions', (req, res) => {

    con.query("SELECT person.name AS owner_name, owned_object.name AS item, owned_object.info AS info, " +
      "acquisition.acquisition_datetime AS date FROM acquisition INNER JOIN person ON " +
      "acquisition.owner = person.id INNER JOIN owned_object ON acquisition.item = owned_object.id " +
      "ORDER BY date DESC", (err, result) => {
    if (err) throw err;
    let acquisitions = result.map(row => {
      return {
        "owner_name": row.owner_name,
        "item": row.item,
        "info": row.info
      }
    });
    res.json(acquisitions);
  });

});

app.get('/latest4', (req, res) => {

  con.query("SELECT person.name AS owner_name, owned_object.name AS item, owned_object.info AS info, " +
      "acquisition.acquisition_datetime AS date FROM acquisition INNER JOIN person ON " +
      "acquisition.owner = person.id INNER JOIN owned_object ON acquisition.item = owned_object.id " +
      "ORDER BY date DESC LIMIT 4", (err, result) => {
    if (err) throw err;
    let latest4 = result.map(row => {
      return {
        "owner_name": row.owner_name,
        "item": row.item,
        "info": row.info
      }
    });
    res.json(latest4);
  });
});

app.listen(3000, () => console.log('Example app is listening on port 3000.'));



