"use strict";

module.exports = function(sequelize, DataTypes) {
  var MoveDB = sequelize.define("MoveDB", {
    imdb_code: DataTypes.STRING,
    title: DataTypes.STRING,
    year: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return MoveDB;
};
