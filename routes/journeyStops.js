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


router.put('/:id', isAuthenticated, isAdmin, async function(req, res, next)
{
    try
    {
        const id = req.params.id;

        const { journeyId, stationId, stopSequence, arrivalTime, departureTime } = req.body;

        const updatedJourneyStop = await journeyStopService.updateJourneyStop
        ({
            id,
            journeyId,
            stationId,
            stopSequence,
            arrivalTime,
            departureTime
        });

        return res.status(200).json({ "status": "success", "statuscode": 200,
        "data": {"result": "JourneyStop successfully updated!"}, updatedJourneyStop });
    }
    catch(err)
    {
        return next(err);
    }
});


router.delete('/:id', isAuthenticated, isAdmin, async function(req, res, next)
{
    try
    {
        const id = req.params.id;

        const deletedJourneyStop = await journeyStopService.deleteJourneyStop(id);

        return res.status(200).json({ "status": "success", "statuscode": 200,
        "data": {"result": "JourneyStop successfully deleted!"}, deletedJourneyStop });
    }
    catch(err)
    {
        return next(err);
    }
});


router.get('/:id', async function(req, res, next)
{
    try
    {
        const id = req.params.id;

        const journeyStop = await journeyStopService.getJourneyStop(id);

        return res.status(200).json({ "status": "success", "statuscode": 200,
        "data": {"result": "JourneyStop found!"}, journeyStop });
    }
    catch(err)
    {
        return next(err);
    }
});


module.exports = router;