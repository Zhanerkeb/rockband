'use strict';
module.exports = (sequelize, DataTypes) => {
    const Musical_direction = sequelize.define('Musical_direction', {
        name: DataTypes.STRING
    }, {
        freezeTableName: true,
        timestamps: false,
    });
    Musical_direction.associate = function(models) {
        // associations can be defined here
        Musical_direction.hasMany(models.Rock_Band, {
            foreignKey: 'musical_direction_id',
            onDelete: 'CASCADE'
        });
    };
    return Musical_direction;
};