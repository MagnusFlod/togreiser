// Importing sequelize, readfilesync, path and dotenv
const Sequelize = require('sequelize');
const fs = require("fs");
const path = require("path");
// Making variable basename and assigning it with correct path to this index-file
const basename = path.basename(__filename);
// Reads the dotenv-file. That has nesseccary information about port, localhost etc
require('dotenv').config()

// Making a config-object for the database. Sequelize are using it to figure out what database, which user, which password, type of database(MySQL, Postgres, etc)
const connection =
{
  database: process.env.DATABASE_NAME,
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
  host: process.env.HOST,
  dialect: process.env.DIALECT,
  dialectmodel: process.env.DIALECTMODEL,
};


// This is where the magic happens. This is the creation of the connection between sequelize and the database. Making it possible for Sequelize to make tables, CRUD etc
const sequelize = new Sequelize(connection);

// Making an empty object that eventually is going to contain all the models/tables
const db = {}

// Putting sequelize inside the db-object
db.sequelize = sequelize

// Reading all files inside the models-folder. Requires them and runs them as functions
fs.readdirSync(__dirname)
  .filter(file =>
  {
    // Filtering away all hidden files that ends with (.) and files with the index.js-name so it doesn't import itself
    return (file.indexOf('.') !== 0) && (file !== basename) &&
      // Including only the files that ends with .js
      (file.slice(-3) === '.js');
    })
    // Iterating through each file
  .forEach(file =>
  {
    // Importing all files and their functions within. Function runs with sequelize, Sequelize and returns the model or table
    const model = require(path.join(__dirname, file))(sequelize,
      Sequelize);
    db[model.name] = model;
  });

// After all files are imported and loaded a callback-function is ran. It waits untill ALL files are imported
Object.keys(db).forEach(modelName =>
{
  // Checks if the models have associations for instance, belongsTo, hasMany, etc
  if (db[modelName].associate)
  {
    // If true (filename).associate is run. Making sure all relations are connected
    db[modelName].associate(db);
  }
});

module.exports = db