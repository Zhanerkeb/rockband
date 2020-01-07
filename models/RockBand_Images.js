'use strict';
module.exports = (sequelize, DataTypes) => {
    const RockBand_Images = sequelize.define('RockBand_Images', {
        image_path: DataTypes.STRING,
    }, {
        freezeTableName: true,
        timestamps: false,
    });
    RockBand_Images.associate = function(models) {
        // associations can be defined here
    };
    return RockBand_Images;
};