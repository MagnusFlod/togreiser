module.exports = (sequelize, Sequelize) =>
{
    const station = sequelize.define
    (
        'station',
        {
            'name':
            {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            'platforms':
            {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            'city':
            {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
        }
    );

    return station;
}