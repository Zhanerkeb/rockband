'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    image: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user'
    },
  }, {
    freezeTableName: true,
    timestamps: false,
  });
  User.associate = function(models) {
    // associations can be defined here

  };
  return User;
};