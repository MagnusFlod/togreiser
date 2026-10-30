class JourneyService
{
    constructor(db)
    {
        this.Journey = db.journey;
    }
}

module.exports = JourneyService;