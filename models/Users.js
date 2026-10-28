module.exports = (sequelize, Sequelize) =>
{
    const user = sequelize.define
    (
        'user',
        {
            'username':
            {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            'email':
            {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            'password':
            {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            'salt':
            {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            'role':
            {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            }
        }
    );

    return user;
}