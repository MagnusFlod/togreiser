module.exports = (sequelize, Sequelize) =>
{
    const journeyStop = sequelize.define
    (
        'journeyStop',
        {
            'journeyId':
            {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false
            },
            'stationId':
            {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false
            },
            'stopSequence':
            {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false
            },
            'arrivalTime':
            {
                type: Sequelize.DataTypes.DATE,
                allowNull: false
            },
            'departureTime':
            {
                type: Sequelize.DataTypes.DATE,
                allowNull: false
            }
        }
    );

    journeyStop.associate = function(models)
    {
        journeyStop.belongsTo(models.journey,
        {
            foreignKey: 'journeyId'
        });

        journeyStop.belongsTo(models.station,
        {
            foreignKey: 'stationId'
        });
    };

    return journeyStop;
}