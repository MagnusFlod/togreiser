module.exports = (sequelize, Sequelize) =>
{
    const train = sequelize.define
    (
        'train',
        {
            'trainNumber':
            {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            'type':
            {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            'lengthMeters':
            {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false
            }
        }
    );

    return train;
}