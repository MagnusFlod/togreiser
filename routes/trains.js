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
        "data": {"result": "Here is train data"}, trains });
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
        "data": {"result": "Here is train data for one train"}, train });
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
        const { trainNumber, type, lengthMeters, isElectric } = req.body;

        const train = await trainService.createTrain
        ({
            trainNumber, type, lengthMeters, isElectric
        });

        return res.status(200).json({ "status": "success", "statuscode": 200,
        "data": {"result": "Train successfully created"}, train });
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

        const { trainNumber, type, lengthMeters, isElectric } = req.body;

        const updatedTrain = await trainService.updateTrain
        ({
            id, trainNumber, type, lengthMeters, isElectric
        });

        console.log(updatedTrain);
        
        return res.status(200).json({ "status": "success", "statuscode": 200,
        "data": { "result": "Train is updated"}, updatedTrain });

    }
    catch(err)
    {
        console.error(err);

        if (err.name === 'SequelizeUniqueConstraintError')
        {
            return res.status(409).json
            ({
                status: 'error',
                statuscode: 409,
                message: 'This train number is already in use.'
            });
        }

        return res.status(500).json
        ({
            status: 'error',
            statuscode: 500,
            message: 'Failed to update train.'
        });
    }
});

router.delete('/:id', isAuthenticated, isAdmin, async function(req, res, next)
{
    try
    {
        const id = req.params.id;

        const deletedTrain = await trainService.deleteTrain(id);

        return res.status(200).json({ "status": "success", "statuscode": 200,
        "data": { "result": "Train is deleted"}, deletedTrain });
    }
    catch(err)
    {
        return res.status(500).json
        ({
            status: 'error',
            statuscode: 500,
            message: 'Failed to delete train.'
        });
    }
});

module.exports = router;