'use strict';
module.exports = (sequelize, DataTypes) => {
    const Song_Review = sequelize.define('Song_Review', {
        review_text: DataTypes.STRING,
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        rate: DataTypes.FLOAT
    }, {
        freezeTableName: true,
        timestamps: false,
    });
    Song_Review.associate = function(models) {
        // associations can be defined here
    };
    return Song_Review;
};