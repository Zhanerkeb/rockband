'use strict';
module.exports = (sequelize, DataTypes) => {
    const Organizer = sequelize.define('Organizer', {
        name: DataTypes.STRING,
        phone: DataTypes.STRING,
        email: DataTypes.STRING,
        image: DataTypes.STRING
    }, {
        freezeTableName: true,
        timestamps: false,
    });
    Organizer.associate = function(models) {
        // associations can be defined here
    };
    return Organizer;
};