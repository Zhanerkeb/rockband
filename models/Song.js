'use strict';
module.exports = (sequelize, DataTypes) => {
    const Song = sequelize.define('Song', {
        name: DataTypes.STRING,
        lyrics: DataTypes.STRING,
        released_date: DataTypes.DATE,
        duration: DataTypes.INTEGER,
        image: DataTypes.STRING,
        rate: DataTypes.FLOAT,
        music_path: {
            type: DataTypes.STRING,
            allowNull: true,
            default: null
        }
    }, {
        freezeTableName: true,
        timestamps: false,
    });
    Song.associate = function(models) {
        // associations can be defined here
        models.Song.belongsTo(models.Rock_Band, {
            foreignKey: 'rock_band_id',
            onDelete: 'CASCADE'
        });

        models.Song.belongsTo(models.Album, {
            foreignKey: 'album_id',
            onDelete: 'CASCADE'
        });

        Song.hasMany(models.Performance, {
            foreignKey: 'song_id',
            onDelete: 'CASCADE'
        });
    };
    return Song;
};