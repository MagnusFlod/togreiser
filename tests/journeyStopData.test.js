const journeyStopData = require('../journeyStopData.json');

describe('JourneyStop-data', () =>
{
    test('skal inneholde nøyaktig 432 stoppoppføringer', () =>
    {
        expect(journeyStopData.data).toHaveLength(432);
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

    test('Hver togreise skal ha stationId 1 - 9 og 9 - 1', () =>
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
                // Motsatt går telleren fra station 9 og ned
                if(Number(journeyIds[i]) <= 24)
                {
                    expect(journeyIdArray[j]).toBe(j + 1);
                }
                else
                {
                    expect(journeyIdArray[j]).toBe(9 - j);
                }
                
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

    test('Sjekk at alle ankomster og avganger har gyldig dato og tidsformat', () =>
    {
        for(let i = 0; i < journeyStopData.data.length; i++)
        {
            const arrivalDate = journeyStopData.data[i].arrivalTime;
            const departureDate = journeyStopData.data[i].departureTime;
            
            expect(Date.parse(arrivalDate)).not.toBeNaN();
            expect(Date.parse(departureDate)).not.toBeNaN();

        }
    });

    test('Alle togreiser skal følge forventede tidsintervaller', () =>
    {
        // Lage objekt av journeys
        const journeys = {};

        // Tidsforskjell mellom ankomster
        const arrivalOffsets = [0, 10, 27, 40, 45, 50, 54, 62, 72];

        // Tidsforskjell mellom avganger
        const departureOffsets = [0, 15, 30, 43, 47, 52, 56, 64, 90];

        // Gruppere stoppene etter journeyId
        for(let i = 0; i < journeyStopData.data.length; i++)
        {
            // Finner alle journeyId's
            const journeyId = journeyStopData.data[i].journeyId;

            if(journeyId >= 1 && journeyId <= 24)
            {
                // Hvis journeys IKKE har en nøkkel som tilsvarer journeyId
                if(!journeys[journeyId])
                {
                    // Opprettes et array per nye journeyId
                    journeys[journeyId] = [];
                }
    
                // Hver journeyId legges til per index i hvert journeyId-array
                journeys[journeyId].push(journeyStopData.data[i]);
            }
        
        }

        // Henter ut hver nøkkel
        const journeyIds = Object.keys(journeys);

        expect(journeyIds).toHaveLength(24);

        // Kontrollere hver togreise
        for(let i = 0; i < journeyIds.length; i++)
        {
            // Finner hver journeyId per journeyArray
            const journeyStops = journeys[journeyIds[i]];

            // Finner dato og tid på første stopp per journey-arrayer
            const firstDeparture = Date.parse(journeyStops[0].departureTime);

            // Går gjennom hver stasjon per journeyArray
            for(let j = 0; j < journeyStops.length; j++)
            {
                // Forventet ankomst blir da første avgang + hvert element i arrivalOffsets
                // Første avgang blir 06:00 + 0 = 06:00
                // Neste avgang blir 06:00 + 10 = 06:10
                // Neste blir 006:00 + 27 = 06:27
                const expectedArrival = firstDeparture + arrivalOffsets[j] * 60000;

                // Samme prinsipp
                // 06:00 + 15 = 06:15 osv
                const expectedDeparture = firstDeparture + departureOffsets[j] * 60000;

                expect(Date.parse(journeyStops[j].arrivalTime)).toBe(expectedArrival);

                expect(Date.parse(journeyStops[j].departureTime)).toBe(expectedDeparture);
            }
        }
    });

    test('Sjekk at alle ankomster og avganger har gyldig dato og tidsformat', () =>
    {
        for(let i = 0; i < journeyStopData.data.length; i++)
        {
            const arrivalDate = journeyStopData.data[i].arrivalTime;
            const departureDate = journeyStopData.data[i].departureTime;
            
            expect(Date.parse(arrivalDate)).not.toBeNaN();
            expect(Date.parse(departureDate)).not.toBeNaN();

        }
    });

    test('Alle togreiser skal følge forventede tidsintervaller for returtid', () =>
    {
        // Lage objekt av journeys
        const journeys = {};

        // Tidsforskjell mellom ankomster
        const arrivalOffsets = [0, 6, 13, 19, 26, 34, 49, 64, 79];

        const departureOffsets = [0, 8, 15, 22, 28, 38, 52, 66, 90];

        // Gruppere stoppene etter journeyId
        for(let i = 0; i < journeyStopData.data.length; i++)
        {
            if(journeyStopData.data[i].journeyId >= 25 && journeyStopData.data[i].journeyId <= 48)
            {
                // Finner alle journeyId's
                const journeyId = journeyStopData.data[i].journeyId;
    
                // Hvis journeys IKKE har en nøkkel som tilsvarer journeyId
                if(!journeys[journeyId])
                {
                    // Opprettes et array per nye journeyId
                    journeys[journeyId] = [];
                }
    
                // Hver journeyId legges til per index i hvert journeyId-array
                journeys[journeyId].push(journeyStopData.data[i]);
            }
        }

        // Henter ut hver nøkkel
        const journeyIds = Object.keys(journeys);

        expect(journeyIds).toHaveLength(24);

        // Kontrollere hver togreise
        for(let i = 0; i < journeyIds.length; i++)
        {
            // Finner hver journeyId per journeyArray
            const journeyStops = journeys[journeyIds[i]];

            // Finner dato og tid på første stopp per journey-arrayer
            const firstDeparture = Date.parse(journeyStops[0].departureTime);

            // Går gjennom hver stasjon per journeyArray
            for(let j = 0; j < journeyStops.length; j++)
            {
                // Forventet ankomst blir da første avgang + hvert element i arrivalOffsets
                // Første avgang blir 06:00 + 0 = 06:00
                // Neste avgang blir 06:00 + 10 = 06:10
                // Neste blir 006:00 + 27 = 06:27
                const expectedArrival = firstDeparture + arrivalOffsets[j] * 60000;

                // Samme prinsipp
                // 06:00 + 15 = 06:15 osv
                const expectedDeparture = firstDeparture + departureOffsets[j] * 60000;

                expect(Date.parse(journeyStops[j].arrivalTime)).toBe(expectedArrival);

                expect(Date.parse(journeyStops[j].departureTime)).toBe(expectedDeparture);
            }
            
        }
    });
});