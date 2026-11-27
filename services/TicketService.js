const crypto = require('crypto');

class TicketService
{
    constructor(db)
    {
        this.Ticket = db.ticket;
        this.User = db.user;
        this.Journey = db.journey;
        this.FromStation = db.station;
        this.ToStation = db.station;
        this.JourneyStop = db.journeyStop;
    }

    async makeTicket({ userId, journeyId, fromStationId, toStationId })
    {
        
        const user = await this.User.findOne({ where: { id: userId } });
        const journey = await this.Journey.findOne({ where: { id: journeyId }});
        const fromStation = await this.FromStation.findOne({ where: { id: fromStationId } });
        const toStation = await this.ToStation.findOne({ where: { id: toStationId } });
            
        if (!user || !journey || !fromStation || !toStation)
        {
            throw new Error("Invalid user, journey or station");
        }
                
        const fromStop = await this.JourneyStop.findOne
        ({
            where:
            {
                journeyId: journeyId,
                stationId: fromStationId
            }
        });
        
        const toStop = await this.JourneyStop.findOne
        ({
            where:
            {
                journeyId: journeyId,
                stationId: toStationId
            }
        });

        // Finner ut om brukeren har selektert fra stasjon til stasjon
        // Finner også at brukeren ikke bestiller en tur feil vei på strekningen
        if(!fromStop || !toStop || fromStop.stopSequence >= toStop.stopSequence)
        {
            throw new Error("Invalid journey route");
        }

        const ticketCode = crypto.randomUUID();

        // Setter nåværende tidspunkt
        const now = Date.now();

        // Beregner 1,5 time varighet for biletten
        const lastingTime = 90 * 60 * 1000;

        const purchaseDate = new Date(now);
        const expirationDate = new Date(now + lastingTime);
        
        const status = true;
        
        const ticket = await this.Ticket.create
        ({
            userId: user.id,
            journeyId: journey.id,
            fromStationId: fromStation.id,
            toStationId: toStation.id,
            ticketCode: ticketCode,
            purchaseDate: purchaseDate,
            status: status,
            expirationDate: expirationDate
        });

        return ticket;
    }

    async getTicket(id, userId)
    {
        const ticket = await this.Ticket.findOne(
        {
            where: { id: id, userId: userId }
        });

        if(!ticket)
        {
            throw new Error('Ticket is not found');
        }

        // Date.now henter tidspunkt akkurat nå
        // new Date(ticket.expirationDate) lager et Date objekt fra utløpstiden som er lagret på billetten
        // getTime() konverterer dette tidspunktet til millisekunder siden 1. januar 1970
        // Sammenligner de to tidene. Hvis nåværende tidspunkt er lik eller større enn utløpstiden så blir status: false
        if(Date.now() >= new Date(ticket.expirationDate).getTime())
        {
            await ticket.update(
            {
                status: false
            });
        }

        return ticket;
    }
}

module.exports = TicketService;