'use strict';
module.exports = (sequelize, DataTypes) => {
    const Album_Review = sequelize.define('Album_Review', {
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
    Album_Review.associate = function(models) {
        // associations can be defined here
    };
    return Album_Review;
};