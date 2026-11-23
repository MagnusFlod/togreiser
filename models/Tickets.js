module.exports = (sequelize, Sequelize) =>
{
    const ticket = sequelize.define
    (
        'ticket',
        {
            'userId':
            {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false
            },
            'journeyId':
            {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false
            },
            'fromStationId':
            {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false
            },
            'toStationId':
            {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false
            },
            'ticketCode':
            {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            'purchaseDate':
            {
                type: Sequelize.DataTypes.DATE,
                allowNull: false
            },
            'status':
            {
                type: Sequelize.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            'expirationDate':
            {
                type: Sequelize.DataTypes.DATE,
                allowNull: false
            }
        }
    );

    ticket.associate = function(models)
    {
        ticket.belongsTo(models.user,
        {
            foreignKey: 'userId'
        });

        ticket.belongsTo(models.journey,
        {
            foreignKey: 'journeyId'
        });

        ticket.belongsTo(models.station,
        {
            foreignKey: 'fromStationId'
        });

        ticket.belongsTo(models.station,
        {
            foreignKey: 'toStationId'
        });
    };

    return ticket;
};