"use strict";

module.exports = function(sequelize, DataTypes) {
  var movedb = sequelize.define("movedb", {
    imdb_code: DataTypes.STRING,
    title: DataTypes.STRING,
    year: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.movedb.hasMany(models.content)
      }
    }
  });

  return movedb;
};
