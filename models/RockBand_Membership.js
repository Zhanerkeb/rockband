'use strict';
module.exports = (sequelize, DataTypes) => {
    const RockBand_Membership = sequelize.define('RockBand_Membership', {
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
    RockBand_Membership.associate = function(models) {
        // associations can be defined here
    };
    return RockBand_Membership;
};