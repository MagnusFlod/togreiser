class JourneyStopService
{
    constructor(db)
    {
        this.JourneyStop = db.journeyStop;
        this.Journey = db.journey;
    }
}

module.exports = JourneyStopService;