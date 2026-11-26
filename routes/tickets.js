var express = require('express');
var router = express.Router();
const { isAuthenticated, isAuthorized, isAdmin } = require('../middlewares/middleware.js');
const TicketService = require('../services/TicketService');
const db = require('../models');
const ticketService = new TicketService(db);

router.post('/', isAuthenticated, async function(req, res, next)
{
    try
    {
        const { journeyId, fromStationId, toStationId } = req.body;
    
        const tickets = await ticketService.makeTicket
        ({
            userId: req.user.id,
            journeyId,
            fromStationId,
            toStationId
        });

        return res.status(200).json({ "status": "success", "statuscode": 200,
        "data": {"result": "Your ticket is reserved!"}, tickets });
    }
    catch(err)
    {
        return next(err);
    }
});

module.exports = router;