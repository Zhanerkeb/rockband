'use strict';
module.exports = (sequelize, DataTypes) => {
    const RockBand_Producer = sequelize.define('RockBand_Producer', {
        time_from: DataTypes.DATE,
        time_to: {
            type: DataTypes.DATE,
            defaultValue: null,
            allowNull: true
        }
    }, {
        freezeTableName: true,
        timestamps: false,
    });
    RockBand_Producer.associate = function(models) {
        // associations can be defined here
    };
    return RockBand_Producer;
};