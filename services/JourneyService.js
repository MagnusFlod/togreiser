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
        const fromStops = await this.JourneyStop.findAll
        ({
            where: { stationId: from}
        });

        const toStops = await this.JourneyStop.findAll
        ({
            where: { stationId: to }
        });

        const matchingJourneyIds = [];

        for(let i = 0; i < fromStops.length; i++)
        {
            for(let j = 0; j < toStops.length; j++)
            {
                if(fromStops[i].journeyId === toStops[j].journeyId)
                {
                    matchingJourneyIds.push(fromStops[i].journeyId);
                }
            }
        }

        return this.Journey.findAll
        ({
            where: { journeyDate: date }
        });
    }
}

module.exports = JourneyService;