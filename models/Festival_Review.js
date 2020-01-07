'use strict';
module.exports = (sequelize, DataTypes) => {
    const Festival_Review = sequelize.define('Festival_Review', {
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
    Festival_Review.associate = function(models) {
        // associations can be defined here
    };
    return Festival_Review;
};