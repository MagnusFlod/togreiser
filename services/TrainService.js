class TrainService
{
    constructor(db)
    {
        this.Train = db.train;
    }

    async getTrains()
    {
        return this.Train.findAll();
    }

    async getOneTrain(id)
    {
        return this.Train.findOne
        ({
            where: {id: id }
        });
    }

    async createTrain({trainNumber, type, lengthMeters, isElectric})
    {
        return this.Train.create
        ({
            trainNumber: trainNumber,
            type: type,
            lengthMeters: lengthMeters,
            isElectric: isElectric
        });
    }
    
    async updateTrain({ id, trainNumber, type, lengthMeters, isElectric })
    {
         console.log
        ({
            id,
            trainNumber,
            type,
            lengthMeters,
            isElectric
        });
        return this.Train.update
        ({
            trainNumber: trainNumber,
            type: type,
            lengthMeters: lengthMeters,
            isElectric: isElectric
        },
        {
            where: { id: id }
        });
    }

    async deleteTrain(id)
    {
        return this.Train.destroy
        ({
            where: { id: id }
        });
    }
}

module.exports = TrainService;