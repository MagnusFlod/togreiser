class JourneyService
{
    constructor(db)
    {
        this.Journey = db.journey;
        this.JourneyStop = db.journeyStop;
        this.Station = db.station;
    }

    async getJourneyWithJourneyStopData(id)
    {
        return this.Journey.findOne
        ({
            where:
            {
                id: id
            },
            include:
            [
                {
                    model: this.JourneyStop,
                    include:
                    [
                        {
                            model: this.Station
                        }
                    ]
                }
            ]
        });
    }

    async getAllJourneysWithJourneyStopData()
    {
        return this.Journey.findAll
        ({
            include:
            [
                {
                    model: this.JourneyStop,
                    include:
                    [
                        {
                            model: this.Station
                        }
                    ]
                }
            ]
        });
    }

    async getJourneysBetweenStations(from, to, date)
    {
        return this.Journey.findOne
        ({
            where: { from: station }
        });
    }
}

module.exports = JourneyService;