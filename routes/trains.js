var express = require('express');
var router = express.Router();
const { isAuthenticated, isAdmin } = require('../middlewares/middleware.js');
const TrainService = require('../services/TrainService');
const db = require('../models');
const trainService = new TrainService(db);

router.get('/', isAuthenticated, async function(req, res, next)
{
    try
    {
        const trains = await trainService.getTrains();

        return res.status(200).json({ "status": "success", "statuscode": 200,
        "datda": {"result": "Here is train data"}, trains });
    }
    catch(err)
    {
        return res.status(500).json({ "status": "error", "statuscode": 404,
        "data": { "result": "Couldn't find train-data", "trains": [] } });
    }
});


router.get('/:id', isAuthenticated, async function(req, res, next)
{
    try
    {
        const id = req.params.id;

        const train = await trainService.getOneTrain(id);

        return res.status(200).json({ "status": "success", "statuscode": 200,
        "datda": {"result": "Here is train data for one train"}, train });
    }
    catch(err)
    {
        return res.status(500).json({ "status": "error", "statuscode": 404,
        "data": { "result": "Couldn't find data for one train", "train": [] } });
    }
});

router.post('/', isAuthenticated, isAdmin, async function(req, res, next)
{
    try
    {
        console.log(req.body);
        console.log(typeof req.body);
        const { trainNumber, type, lengthMeters, isElectric } = req.body;

        const train = await trainService.createTrain
        ({
            trainNumber, type, lengthMeters, isElectric
        });

        return res.status(200).json({ "status": "success", "statuscode": 200,
        "datda": {"result": "Train successfully created"}, train });
    }
    catch(err)
    {
        return next(err);
    }
});


module.exports = router;