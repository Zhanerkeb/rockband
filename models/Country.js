'use strict';
module.exports = (sequelize, DataTypes) => {
    const Country = sequelize.define('Country', {
        name: DataTypes.STRING
    }, {
        freezeTableName: true,
        timestamps: false,
    });
    Country.associate = function(models) {
        // associations can be defined here
        Country.hasMany(models.Rock_Band, {
            foreignKey: 'country_id',
            onDelete: 'CASCADE'
        });
    };
    return Country;
};