'use strict';
module.exports = (sequelize, DataTypes) => {
    const Performance_Review = sequelize.define('Performance_Review', {
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
    Performance_Review.associate = function(models) {
        // associations can be defined here
    };
    return Performance_Review;
};