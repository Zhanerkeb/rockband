'use strict';
module.exports = (sequelize, DataTypes) => {
    const Festival_Organizers = sequelize.define('Festival_Organizers', {
    }, {
        freezeTableName: true,
        timestamps: false,
    });
    Festival_Organizers.associate = function(models) {
        // associations can be defined here
    };
    return Festival_Organizers;
};