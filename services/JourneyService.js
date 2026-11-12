const { Op, where } = require('sequelize');

class JourneyService
{
    constructor(db)
    {
        this.Journey = db.journey;
        this.JourneyStop = db.journeyStop;
        this.Station = db.station;
    }

    async getAllJourneys()
    {
        return this.Journey.findAll();
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
        // Finner alle journeyStops med en spesifikk stationId. F.eks Eidsvoll
        const fromStops = await this.JourneyStop.findAll
        ({
            where: { stationId: from}
        });

        // Finner alle journeyStops med en annen spesifikk stationId. F.eks Gardermoen
        const toStops = await this.JourneyStop.findAll
        ({
            where: { stationId: to }
        });

        const startOfDay = new Date(date);

        const startOfNextDay = new Date(date);
        startOfNextDay.setDate(startOfNextDay.getDate() + 1);

        // Lager et tomt array som senere skal inneholde alle journeyIds som matcher stationIds
        const matchingJourneyIds = [];

        for(let i = 0; i < fromStops.length; i++)
        {
            for(let j = 0; j < toStops.length; j++)
            {
                if(
                    fromStops[i].journeyId === toStops[j].journeyId &&
                    fromStops[i].stopSequence < toStops[j].stopSequence &&
                    // Undersøker om samme journeyId allerede finnes i arrayet
                    !matchingJourneyIds.includes(fromStops[i].journeyId)
                )
                {
                    matchingJourneyIds.push(fromStops[i].journeyId);
                }
            }
        }

        return this.Journey.findAll
        ({
            where:
            {
                id:
                {
                    // Op.in: Henter rader der id finnes i matchingJourneyIds-arrayen.
                    [Op.in]: matchingJourneyIds
                },
                journeyDate:
                {
                    // Op.gte: Datoen må være større enn eller lik starten på dagen.
                    [Op.gte]: startOfDay,

                    // Op.lt: Datoen må være mindre enn starten på neste dag.
                    [Op.lt]: startOfNextDay
                }
            },
            include:
            [
                {
                    model: this.JourneyStop,
                    where:
                    {
                        stationId:
                        {
                            [Op.in]: [from, to]
                        }
                    },
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

    async createJourney({ trainId, journeyDate })
    {
        return this.Journey.create
        ({
            trainId: trainId,
            journeyDate: journeyDate
        });
    }

    async updateJourney({ id, trainId, journeyDate })
    {
        return this.Journey.update
        ({
            trainId: trainId,
            journeyDate: journeyDate
        },
        {
            where: { id: id }
        });
    }

    async deleteJourney(id)
    {
        return this.Journey.destroy
        ({
            where: { id: id }
        });
    }
}

module.exports = JourneyService;