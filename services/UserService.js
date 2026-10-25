const { where } = require("sequelize");

class UserService
{
    constructor(db)
    {
        this.User = db.user;
    }

    async create(username, email, password, salt, role)
    {
        return this.User.create
        ({
            username: username,
            email: email,
            password: password,
            salt: salt,
            role: role
        });
    }

    async getAll()
    {
        return this.User.findAll
        ({
            attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
        });
    }

    async getOneUser(id)
    {
        return this.User.findOne
        ({
            where: { id: id },
            attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
        });
    }

    async getEmail(email)
    {
        return this.User.findOne
        ({
            where: { email: email }
        });
    }

    async getUsername(username)
    {
        return this.User.findOne
        ({
            where: { username: username }
        });
    }

    async deleteUser(id)
    {
        return this.User.destroy
        ({
            where: { id: id }
        });
    }
}

module.exports = UserService;