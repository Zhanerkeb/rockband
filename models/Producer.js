'use strict';
module.exports = (sequelize, DataTypes) => {
    const Producer = sequelize.define('Producer', {
        name: DataTypes.STRING,
        birthday: DataTypes.DATE,
        image: DataTypes.STRING
    }, {
        freezeTableName: true,
        timestamps: false,
    });
    Producer.associate = function(models) {
        // associations can be defined here
    };
    return Producer;
};