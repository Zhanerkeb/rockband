'use strict';
module.exports = (sequelize, DataTypes) => {
    const Performance = sequelize.define('Performance', {
        duration: DataTypes.INTEGER,
        order: DataTypes.INTEGER,
        rate: DataTypes.FLOAT

    }, {
        freezeTableName: true,
        timestamps: false,
    });
    Performance.associate = function(models) {
        // associations can be defined here
        Performance.belongsTo(models.Rock_Band, {
            foreignKey: 'rock_band_id',
            onDelete: 'CASCADE'
        });
        Performance.belongsTo(models.Festival, {
            foreignKey: 'festival_id',
            onDelete: 'CASCADE'
        });
        Performance.belongsTo(models.Song, {
            foreignKey: 'song_id',
            onDelete: 'CASCADE'
        });
    };
    return Performance;
};