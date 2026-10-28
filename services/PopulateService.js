const crypto = require('crypto');
const trainData = require('../trainData.json');
const stationData = require('../stationData.json');
const { promisify } = require('node:util');
const UserService = require('../services/UserService');
const pbkdf2Async = promisify(crypto.pbkdf2);

class PopulateService
{
    constructor(db)
    {
        this.Train = db.train;
        this.User = db.user;
        this.userService = new UserService(db);
        this.Station = db.station;
    }

    async populate()
    {
        if(await this.isPopulated())
        {
            console.log("Database is already populated");
            return;
        }

        await this.postAdmin();

        for(let i = 0; i < trainData.data.length; i++)
        {
            await this.postTrains
            ({
                trainNumber: trainData.data[i].trainNumber,
                type: trainData.data[i].type,
                lengthMeters: trainData.data[i].lengthMeters
            });
        }

        for(let i = 0; i < stationData.data.length; i++)
        {
            await this.postStations
            ({
                name: stationData.data[i].name,
                platforms: stationData.data[i].platforms,
                city: stationData.data[i].city
            });
        }
    }
  
    async isPopulated()
    {
        // If one table already has rows, it's already populated. 0 rows = 0 data. 1 or more rows = data
        const trainCount = await this.Train.count();
        const userCount = await this.User.count();
        const stationCount = await this.Station.count();
        // If the result of counting rows is greater than 0, the function returns a truthy-value
        return trainCount > 0 && userCount > 0 && stationCount > 0;
    }


    async postTrains({ trainNumber, type, lengthMeters, isElectric })
    {
        return this.Train.create
        ({
            trainNumber: trainNumber,
            type: type,
            lengthMeters: lengthMeters,
            isElectric: isElectric
        });
    }

    async postAdmin()
    {
        const username = process.env.ADMIN_USERNAME;
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        const salt = crypto.randomBytes(16);
        const saltHex = salt.toString('hex');

        const hashedPassword = await pbkdf2Async
        (
            password,
            salt,
            310000,
            32,
            'sha256'
        );

        await this.userService.create
        (
            username,
            email,
            hashedPassword.toString('hex'),
            saltHex,
            'admin'
        );
    }

    async postStations({ name, platforms, city })
    {
        return this.Station.create
        ({
            name: name,
            platforms: platforms,
            city: city
        });
    }
}

module.exports = PopulateService;