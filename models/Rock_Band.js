'use strict';
module.exports = (sequelize, DataTypes) => {
    const RockBand = sequelize.define('Rock_Band', {
        name: DataTypes.STRING,
        year_founded: {
            type: DataTypes.DATE,
            allowNull: false
        },
        year_of_decay: {
            type: DataTypes.DATE,
            defaultValue: null,
        },
        rate: DataTypes.FLOAT
    }, {
        freezeTableName: true,
        timestamps: false,
    });
    RockBand.associate = function(models) {
        // associations can be defined here
        RockBand.hasMany(models.Song, {
            foreignKey: 'rock_band_id',
            onDelete: 'CASCADE'
        });
        RockBand.hasMany(models.Album, {
            foreignKey: 'rock_band_id',
            onDelete: 'CASCADE'
        });
        RockBand.hasMany(models.Performance, {
            foreignKey: 'rock_band_id',
            onDelete: 'CASCADE'
        });

        RockBand.belongsTo(models.Musical_direction, {
            foreignKey: 'musical_direction_id',
            onDelete: 'CASCADE'
        });
    };
    return RockBand;
};