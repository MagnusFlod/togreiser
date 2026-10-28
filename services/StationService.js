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
}