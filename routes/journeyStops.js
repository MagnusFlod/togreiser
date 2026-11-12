var express = require('express');
var router = express.Router();
const { isAuthenticated, isAuthorized, isAdmin } = require('../middlewares/middleware.js');
const JourneyStopService = require('../services/JourneyStopService.js');
const db = require('../models');
const journeyStopService = new JourneyStopService(db);

router.post('/', isAuthenticated, isAdmin, async function(req, res, next)
{
    try
    {
        const { journeyId, stationId, stopSequence, arrivalTime, departureTime } = req.body;

        const journeyStop = await journeyStopService.createJourneyStop
        ({
            journeyId, stationId, stopSequence, arrivalTime, departureTime
        });

        return res.status(200).json({ "status": "success", "statuscode": 200,
        "data": {"result": "JourneyStop successfully created"}, journeyStop });
    }
    catch(err)
    {
        return next(err);
    }
});



module.exports = router;