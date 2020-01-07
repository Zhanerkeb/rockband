'use strict';
module.exports = (sequelize, DataTypes) => {
    const Album = sequelize.define('Album', {
        name: DataTypes.STRING,
        released_date: DataTypes.DATE,
        number_of_songs: DataTypes.INTEGER,
        rate: DataTypes.FLOAT,
        image: DataTypes.STRING
    }, {
        freezeTableName: true,
        timestamps: false,
    });
    Album.associate = function(models) {
        // associations can be defined here
        models.Album.belongsTo(models.Rock_Band, {
            foreignKey: 'rock_band_id',
            onDelete: 'CASCADE'
        });
        Album.hasMany(models.Song, {
            foreignKey: 'album_id',
            onDelete: 'CASCADE'
        });
    };
    return Album;
};