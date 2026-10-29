module.exports = (sequelize, Sequelize) =>
{
    const journey = sequelize.define
    (
        'journey',
        {
            'trainId':
            {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false
            },
            'journeyDate':
            {
                type: Sequelize.DataTypes.DATE,
                allowNull: false
            }
        }
    );

    journey.associate = function(models)
    {
        journey.belongsTo(models.train,
        {
            foreignKey: 'trainId'
        });

        journey.hasMany(models.journeyStop,
        {
            foreignKey: 'journeyId'
        });
    };

    return journey;
}