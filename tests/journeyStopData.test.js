const journeyStopData = require('../journeyStopData.json');

describe('JourneyStop-data', () =>
{
    test('skal inneholde nøyaktig 216 stoppoppføringer', () =>
    {
        expect(journeyStopData.data).toHaveLength(216);
    });

    test('hver togreise skal ha nøyaktig 9 stopp', () =>
    {
        // Lager et tomt objekt
        const journeys = {};

        journeyStopData.data.forEach(stop =>
        {
            const journeyId = stop.journeyId;

            // Hvis det IKKE finnes en nøkkel som holder verdien av journeyID, så er betingelsen true
            // Nøkkelen eller journeyId identifiserer hvilken togreiser det er
            if (!journeys[journeyId])
            {
                // På første iterasjon så får journeyId verdien 1. Dette er nøkkelen
                // Hvis betingelsen er true, så setter man verdien 0 på nøkkel nummer1
                // journeys er objektet
                // journeys[1] = 0
                /*{
                    1: 0
                }
                */
                // Telleren øker deretter verdiene på nøkkel 1
                /*{
                    1: 1
                }{
                    1: 2
                } osv
                */
                journeys[journeyId] = 0;
            }
            // Så kommer telleren til 9. objekt. journeyId får ny verdi. 2
            // Når telleren da er på f.eks 2: 4, så blir betingelsen if (!journeys[journeyId]) false
            // Da hopper telleren videre til neste iterasjon
            // Da opprettes det en teller for hver eneste journeyId
            journeys[journeyId]++;
        });

        Object.values(journeys).forEach(numberOfStops =>
        {
            expect(numberOfStops).toBe(9);
        });
    });

    test('Hver togreise skal ha stationId 1 - 9', () =>
    {

        const journeys = {};

        for(let i = 0; i < journeyStopData.data.length; i++)
        {
            const stationId = journeyStopData.data[i].stationId;
            const journeyId = journeyStopData.data[i].journeyId;
            // Hvis journeys IKKE har en nøkkel med verdien av journeyId, så opprettes et tomt array med nøkkel journeyId: 1
            if(!journeys[journeyId])
            {
                journeys[journeyId] = [];
            }
            // Så legges hver stationId til per journeyId-nøkkelverdi
            // Det blir da totalt 24 nøkler med 9 verdier per nøkkel hvis json-fila er korrekt
            journeys[journeyId].push(stationId);

        }

        const journeyIds = Object.keys(journeys);
        
        // Gå gjennom hver nøkkel i journeys
        for(let i = 0; i < journeyIds.length; i++)
        {
            // Finner hvert array i journeys
            const journeyIdArray = journeys[journeyIds[i]];
            
            // Går gjennom hvert element i hvert array per journeyId-nøkkel
            for(let j = 0; j < journeyIdArray.length; j++)
            {
                // Forventet verdi. j er telleren. journeyIdArray[j] er verdien på indeksen
                // Den forventer at hver verdi er teller + 1
                // Første iterasjon = 0 + 1 = 1. StationID: 1
                expect(journeyIdArray[j]).toBe(j + 1);
                
            }
        }
    });

    test('Hver togreise skal ha stopSequence 1 -9', () =>
    {
        const journeys = {};

        for(let i = 0; i < journeyStopData.data.length; i++)
        {
            const journeyId = journeyStopData.data[i].journeyId;
            const stop = journeyStopData.data[i].stopSequence;

            if(!journeys[journeyId])
            {
                journeys[journeyId] = [];
            }
            journeys[journeyId].push(stop);
        }

        const journeyIds = Object.keys(journeys);

        for(let i = 0; i < journeyIds.length; i++)
        {
            const journeyIdArray = journeys[journeyIds[i]];

            for(let j = 0; j < journeyIdArray.length; j++)
            {
                expect(journeyIdArray[j]).toBe(j + 1);
            }
        }
    });

    test('En stasjon skal ikke ha avgangstid før ankomsttid', () =>
    {

        for(let i = 0; i < journeyStopData.data.length; i++)
        {
            const arrival = new Date(journeyStopData.data[i].arrivalTime);
            const departure = new Date(journeyStopData.data[i].departureTime);

            expect(departure.getTime()).toBeGreaterThanOrEqual(arrival.getTime());
        }
    });

    test('Ankomstid fra en stasjon kan ikke være før ankomstiden på neste stasjon', () =>
    {
        for(let i = 0; i < journeyStopData.data.length - 1; i++)
        {
            const currentJourney = journeyStopData.data[i].journeyId;
            const nextJourney = journeyStopData.data[i + 1].journeyId;

            if(currentJourney === nextJourney)
            {
                const departure = new Date(journeyStopData.data[i].departureTime);
                const nextArrival = new Date(journeyStopData.data[i + 1].arrivalTime);

                expect(nextArrival.getTime()).toBeGreaterThanOrEqual(departure.getTime());
            }
        }
    });
});