var express = require('express');
var router = express.Router();
const { isAuthenticated, isAuthorized, isAdmin } = require('../middlewares/middleware.js');
const JourneyService = require('../services/JourneyService.js');
const db = require('../models');
const journeyService = new JourneyService(db);


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


router.post('/', isAuthenticated, isAdmin, async function(req, res, next)
{
    try
    {
        const { trainId, journeyDate } = req.body;

        const journey = await journeyService.createJourney
        ({
            trainId, journeyDate
        });

        return res.status(200).json({ "status": "success", "statuscode": 200,
        "data": {"result": "Journey successfully created"}, journey });
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

        const { trainId, journeyDate } = req.body;

        const updatedJourney = await journeyService.updateJourney
        ({
            id,
            trainId,
            journeyDate
        });

        return res.status(200).json({ "status": "success", "statuscode": 200,
        "data": {"result": "Journey successfully updated"}, updatedJourney });
    }
    catch(er)
    {
        return next(err);
    }
});


router.delete('/:id', isAuthenticated, isAdmin, async function(req, res, next)
{
    try
    {
        const id = req.params.id;

        const deletedJourney = await journeyService.deleteJourney(id);

        return res.status(200).json({ "status": "success", "statuscode": 200,
        "data": {"result": "Journey successfully deleted"}, deletedJourney });
    }
    catch(err)
    {
        return next(err);
    }
});


module.exports = router;