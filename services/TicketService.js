const { where } = require("sequelize");

class TicketService
{
    constructor(db)
    {
        this.Ticket = db.ticket;
        this.User = db.user;
        this.Journey = db.journey;
        this.FromStation = db.station;
        this.ToStation = db.station;
    }

    async makeTicket({ username, journeyId, fromStationId, toStationId })
    {
        const user = await this.User.findOne({ where: { username: username } });
        const journeyId = await this.Journey.findOne({ where: { journeyId: journeyId }});
        const fromStation = await this.FromStation.findOne({ where: { fromStationId: fromStationId } });
        const toStation = await this.ToStation.findOne({ where: { toStationId: toStationId } });

        const ticket = await this.Ticket.create
        ({
            
        })
    }
}

module.exports = TicketService;