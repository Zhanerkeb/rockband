'use strict';
module.exports = (sequelize, DataTypes) => {
    const Festival = sequelize.define('Festival', {
        name: DataTypes.STRING,
        time: DataTypes.TIME,
        date: DataTypes.DATEONLY,
        place: DataTypes.STRING,
        number_of_participants: DataTypes.INTEGER,
        rate: DataTypes.FLOAT,
        image: DataTypes.STRING,
    }, {
        freezeTableName: true,
        timestamps: false,
    });
    Festival.associate = function(models) {
        // associations can be defined here
        Festival.hasMany(models.Performance, {
            foreignKey: 'festival_id',
            onDelete: 'CASCADE'
        });
    };
    return Festival;
};