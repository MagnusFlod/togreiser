class JourneyStopService
{
    constructor(db)
    {
        this.JourneyStop = db.journeyStop;
        this.Journey = db.journey;
    }

    async createJourneyStop({ journeyId, stationId, stopSequence, arrivalTime, departureTime })
    {
        return this.JourneyStop.create
        ({
            journeyId: journeyId,
            stationId: stationId,
            stopSequence: stopSequence,
            arrivalTime: arrivalTime,
            departureTime: departureTime
        });
    }

    async updateJourneyStop({ id, journeyId, stationId, stopSequence, arrivalTime, departureTime })
    {
        return this.JourneyStop.update(
        {
            journeyId: journeyId,
            stationId: stationId,
            stopSequence: stopSequence,
            arrivalTime: arrivalTime,
            departureTime: departureTime
        },
        {
            where: { id: id }
        });
    }

    async deleteJourneyStop(id)
    {
        return this.JourneyStop.destroy
        ({
            where: { id: id }
        });
    }

    async getJourneyStop(id)
    {
        return this.JourneyStop.findOne(
        {
            where: { id: id }
        });
    }
}

module.exports = JourneyStopService;