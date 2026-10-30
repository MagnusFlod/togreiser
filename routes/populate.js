var express = require('express');
var router = express.Router();
const PopulateService = require('../services/PopulateService');
const db = require('../models');
const populateService = new PopulateService(db);


router.post('/', async function(req, res, next)
{
    try
    {
        const alreadyPopulated = await populateService.isPopulated();

        if(alreadyPopulated)
        {
            return res.status(409).json(
            {
                message: 'Database is already populated'
            });
        }

        await populateService.populate();

        return res.status(200).json(
        {
            message: 'Successfully populated initial data'
        });
    }
    catch(err)
    {
        return next(err);
    }
});

module.exports = router;