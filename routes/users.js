const jwt = require('jsonwebtoken');
const crypto = require('crypto');
var express = require('express');
var router = express.Router();
const { isAuthenticated, isAuthorized } = require('../middlewares/middleware.js');
const UserService = require('../services/UserService');
const db = require('../models');
const userService = new UserService(db);


router.get('/', async function(req, res, next)
{
  try
  {
    const users = await userService.getAll();

    return res.status(200).json({ "status": "success", "statuscode": 200,
    "data": { "result": "Here is every user from the database" }, users });
  }
  catch(err)
  {
    return res.status(500).json({ "status": "error", "statuscode": 404,
    "data": { "result": "Internal server error", "users": [] } });
  }
});



router.get('/:id', isAuthenticated, isAuthorized, async function(req, res, next)
{
    try
    {
        const id = req.params.id;

        const user = await userService.getOneUser(id);

        return res.status(200).json({ "status": "success", "statuscode": 200,
        "data": { "result": "Here is data for specific user" }, user });
    }
    catch(err)
    {
        return res.status(500).json({ "status": "error", "statuscode": 404,
        "data": { "result": "Internal server error", "users": [] } });
    }
});



router.post('/register', async function(req, res, next)
{
    const { username, email, password } = req.body;

    if (!username || !email || !password)
    {
        return res.status(400).json({ message: 'Missing field!' });
    }

    var salt = crypto.randomBytes(16);

    const saltHex = salt.toString('hex');

    crypto.pbkdf2(password, salt, 310000, 32, 'sha256',
        async function(err, hashedPassword)
        {
            if (err)
            {
                return next(err);
            }

            try
            {

                await userService.create
                (
                    username,
                    email,
                    hashedPassword.toString('hex'),
                    saltHex,
                    'user'
                );

                return res.status(201).json
                ({
                    message: 'User successfully created!'
                });
            }
            catch (err)
            {
                return next(err);
            }
        }
    );
});



router.post('/login', async function(req, res, next)
{
    // Acquiring correct fields for the login that is going to be used in Postman-body
    const { username, email, password } = req.body;

    // If Email AND Username-fields are missing, the request fails
    if(!username && !email)
    {
        return res.status(401).json({ message: 'Username or Email must be applied!' });
    }
    // If password is missing, the request fails
    if(!password)
    {
        return res.status(401).json({ message: 'Passwor must be applied!' });
    }

    
    // Making an empty user-variable for either Email or Username
    let user;

    // If the Email-field is missing, but Username-field == true, the login runs with Username
    if(!email)
    {
        user = await userService.getUsername(username);
    }
    // Else if the Username-field is missing, but Email-field == true, the login runs with Email
    else
    {
        user = await userService.getEmail(email);
    }


    if(!user)
    {
        return res.status(401).json({ message: 'Incorrect Email, Username or password'});
    }

    const salt = Buffer.from(user.salt, 'hex');
    const storedHash = Buffer.from(user.password, 'hex');

    // A new hash and salt is made for the password for the login
    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', function(err, hashedPassword)
    {
        if(err)
        {
            return next(err);
        }
    
        try
        {
            // This line compares the two hashes. The one that is stored in the database and the one that is used in the login
            if (!crypto.timingSafeEqual(storedHash, hashedPassword))
            {
                return res.status(401).json({ message: "Incorrect email or password" });
            }
        
            // If the password is correct, a token is given to the user when logged in
            let token;
            try
            {
                token = jwt.sign
                (
                    // This is the payload. Information that is used by the token
                    // A client, for instance Google Chrome does not save the credentials, it saves the token value
                    { id: user.id, email: user.email, role: user.role },
                    process.env.TOKEN_SECRET,
                    { expiresIn: "1h" }
                );
            }
            catch (err)
            {
                console.error(err);
                return res.status(500).json({ message: "JWT error" });
            }
    
            return res.status(200).json
            ({
                "status": "success", "statuscode": 200,
                "data": { "result": "You are logged in!", "id": user.id, "email": user.email, "name": user.username, token: token }
            });
        }
        catch(err)
        {
            return res.status(500).json({ "status": "error", "statuscode": 500, "data": {"result": "Internal server error"} });
        }

    });
});

router.put('/change-password/:id', isAuthenticated, isAuthorized, async function(req, res, next)
{
    
    const { password } = req.body;

    const id = req.params.id;

    if(!password)
    {
        return res.status(400).json
        ({
            message: 'New password is required'
        });
    }

    var salt = crypto.randomBytes(16);

    const saltHex = salt.toString('hex');

    crypto.pbkdf2(password, salt, 310000, 32, 'sha256',
        async function(err, hashedPassword)
        {
            if (err)
            {
                return next(err);
            }

            try
            {

                const updatedPassword = await userService.updatePassword
                ({
                    id: id,
                    password: hashedPassword.toString('hex'),
                    salt: saltHex
                });

                if(updatedPassword[0] === 0)
                {
                    return res.status(404).json
                    ({
                        message: 'User not found'
                    });
                }

                return res.status(201).json
                ({
                    message: 'Password was successfully changed!'
                });
            }
            catch (err)
            {
                return next(err);
            }
        }
    );
});

router.put('/:id', isAuthenticated, isAuthorized, async function(req, res, next)
{
    try
    {
        const id = req.params.id;

        const { username, email } = req.body;

        const updatedUser = await userService.updateUser(id)
    }
    catch(err)
    {

    }
});

router.delete('/:id', isAuthenticated, isAuthorized, async function(req, res, next)
{
    try
    {
        const id = req.params.id;

        const deletedUser = await userService.deleteUser(id);

        return res.status(200).json({ "status": "success", "statuscode": 200,
        "data": { "result": "User successfully deleted" }, deletedUser });
    }
    catch(err)
    {
        return res.status(500).json
        ({
            status: 'error',
            statuscode: 500,
            message: 'Failed to delete user.'
        });
    }
});


module.exports = router;