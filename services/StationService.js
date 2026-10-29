class StationService
{
    constructor(db)
    {
        this.Station = db.station;
    }

    async createStation({ name, platforms, city })
    {
        return this.Station.create
        ({
            name: name,
            platforms: platforms,
            city: city
        });
    }

    async getAllStations()
    {
        return this.Station.findAll();
    }

    async getOneStation(id)
    {
        return this.Station.findOne
        ({
            where: { id: id }
        });
    }

    async updateStation({ id, name, platforms, city })
    {
        return this.Station.update
        ({
            name: name,
            platforms: platforms,
            city: city
        },
        {
            where: { id: id }
        });
    }

    async deleteStation(id)
    {
        return this.Station.destroy
        ({
            where: { id: id }
        });
    }
}

module.exports = StationService;