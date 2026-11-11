var express = require('express');
var router = express.Router();
const { isAuthenticated, isAuthorized, isAdmin } = require('../middlewares/middleware.js');
const JourneyService = require('../services/JourneyService.js');
const db = require('../models');
const journeyService = new JourneyService(db);
const JourneyStopService = require('../services/JourneyStopService.js');
const journeyStopService = new JourneyStopService(db);


// Postman URL: http://localhost:3000/journeys/search?from=1&to=2&date=2026-11-02
router.get('/search', async function(req, res, next)
{
    try
    {
        const { from, to, date } = req.query;

        const journeys = await journeyService.getJourneysBetweenStations
        (
            from,
            to,
            date
        );

        return res.status(200).json
        ({
            status: "success",
            statuscode: 200,
            journeys
        });
    }
    catch(err)
    {
        return next(err);
    }
});

router.get('/allJourneys', async function(req, res, next)
{
    try
    {
        const allJourneys = await journeyService.getAllJourneys();
        return res.status(200).json({ "status": "success", "statuscode": 200,
        "data": {"result": "Here is data for every journey"}, allJourneys });
    }
    catch(err)
    {
        return next(err);
    }
});

router.get('/all-journeyDetails', async function(req, res, next)
{
    try
    {
        const journeys = await journeyService.getAllJourneysWithJourneyStopData();
        return res.status(200).json({ "status": "success", "statuscode": 200,
        "data": {"result": "Here is data for every journey"}, journeys });
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

        const journey = await journeyService.getJourneyWithJourneyStopData(id);

        return res.status(200).json({ "status": "success", "statuscode": 200,
        "data": {"result": "Here is data for journey"}, journey });
    }
    catch(err)
    {
        return next(err);
    }
});


module.exports = router;