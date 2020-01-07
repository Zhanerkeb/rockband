'use strict';
module.exports = (sequelize, DataTypes) => {
    const RockBand_Review = sequelize.define('RockBand_Review', {
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
    RockBand_Review.associate = function(models) {
        // associations can be defined here
    };
    return RockBand_Review;
};