"use strict";

module.exports = function(sequelize, DataTypes) {
  var content = sequelize.define("content", {
    comment: DataTypes.STRING,
    movedbId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.content.belongsTo(models.movedb)
      }
    }
  });

  return content;
};
