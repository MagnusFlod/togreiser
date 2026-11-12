class JourneyStopService
{
    constructor(db)
    {
        this.JourneyStop = db.journeyStop;
        this.Journey = db.journey;
    }

    async createJourneyStop({ journeyId, stationId, stopSequence, arrivalTime, departureTime })
    {
        return this.journeyStop.create
        ({
            journeyId: journeyId,
            stationId: stationId,
            stopSequence: stopSequence,
            arrivalTime: arrivalTime,
            departureTime: departureTime
        });
    }

    async updateJourneyStop()
    {
        
    }

    async deleteJourneyStop()
    {

    }

    async getJourneyStops(id)
    {

    }
}

module.exports = JourneyStopService;