'use strict';
module.exports = (sequelize, DataTypes) => {
    const BandMember = sequelize.define('BandMember', {
        name: DataTypes.STRING,
        birthday: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        freezeTableName: true,
        timestamps: false,
    });
    BandMember.associate = function(models) {
        // associations can be defined here
    };
    return BandMember;
};