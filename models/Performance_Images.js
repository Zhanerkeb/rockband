'use strict';
module.exports = (sequelize, DataTypes) => {
    const Performance_Images = sequelize.define('Performance_Images', {
        image_path: DataTypes.STRING,
    }, {
        freezeTableName: true,
        timestamps: false,
    });
    Performance_Images.associate = function(models) {
        // associations can be defined here
    };
    return Performance_Images;
};