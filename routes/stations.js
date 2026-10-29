var express = require('express');
var router = express.Router();
const { isAuthenticated, isAuthorized, isAdmin } = require('../middlewares/middleware.js');
const StationService = require('../services/StationService');
const db = require('../models');
const stationService = new StationService(db);


router.post('/', isAuthenticated, isAdmin, async function(req, res, next)
{
    try
    {
        const { name, platforms, city } = req.body;

        const insertStation = await stationService.createStation
        ({
            name,
            platforms,
            city
        });
        return res.status(200).json({ "status": "success", "statuscode": 200,
        "data": {"result": "Station successfully inserted"}, insertStation });
    }
    catch(err)
    {
        return next(err);
    }
    
});

router.get('/', isAuthenticated, async function(req, res, next)
{
    try
    {
        const stations = await stationService.getAllStations();

        return res.status(200).json({ "status": "success", "ststuscode": 200,
        "data": {"result": "All stations"}, stations });
    }
    catch(err)
    {
        return next(err);
    }
});

router.get('/:id', isAuthenticated, async function(req, res, next)
{
    try
    {
        const id = req.params.id;

        const station = await stationService.getOneStation(id);

        return res.status(200).json({ "status": "success", "statuscode": 200,
        "data": {"result": "Here is data for one station"}, station });
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

        const { name, platforms, city } = req.body;

        const updatedStation = await stationService.updateStation
        ({
            id, name, platforms, city
        });

        return res.status(200).json({ message: 'Station updated'});
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

        const deletedStation = await stationService.deleteStation(id);

        return res.status(200).json({ message: 'Station successfully deleted' });
    }
    catch(err)
    {
        return next(err);
    }
});

module.exports = router;