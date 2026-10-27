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

    async getUserByEmail(email)
    {
        return this.User.findOne
        ({
            where: { email: email }
        });
    }

    async updateUser({ id, username, email })
    {
        return this.User.update
        ({
            username: username,
            email: email
        },
        {
            where: { id: id }
        });
    }

    async updatePassword({ id, password, salt})
    {
        return this.User.update
        ({
            password: password,
            salt: salt
        },
        {
            where: { id: id }
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