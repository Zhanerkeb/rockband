'use strict';
module.exports = (sequelize, DataTypes) => {
    const Festival_Images = sequelize.define('Festival_Images', {
        image_path: DataTypes.STRING,
    }, {
        freezeTableName: true,
        timestamps: false,
    });
    Festival_Images.associate = function(models) {
        // associations can be defined here
    };
    return Festival_Images;
};