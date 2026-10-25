const jwt = require('jsonwebtoken');

module.exports =
{
    // This function is used to protect all endpoint except POST /register, POST /login and POST /init
    isAuthenticated: function(req, res, next)
    {
        // Aqcuiring the header in Postman
        const postmanHeader = req.headers.authorization;
    
        // If the header is missing, the request is stopped by termination of the function
        if(!postmanHeader)
        {
            return res.status(401).json({ message: 'Token is not provided' });
        }
    
        // Splitting the postmanHeader so it's not included in the token-value
        const token = postmanHeader.split(' ')[1];
    
        try
        {
            // Checks for valid token
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = decodedToken;

            // Går videre til neste ledd i prosessen. F.eks: GET /users/:id ruta
            next();
        }
        catch(err)
        {
            return res.status(401).json({ message: 'Invalid token' });
        }
    
    },

    isAuthorized: function(req, res, next)
    {
        const user = req.user;
        const requestedUserId = Number(req.params.id);

        if(user.id === requestedUserId)
        {
            next();
        }
        else
        {
            return res.status(403).json({ message: 'You do not have access to this user' });
        }
    },

    isAdmin: function(req, res, next)
    {
        if(!req.user)
        {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const requestedUserRole = req.user.role;

        if(requestedUserRole === 'admin')
        {
            return next();
        }

        return res.status(403).json({ message: 'You do not have admin rights' });
    }
    
}
