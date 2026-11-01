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
        const stationIds = [];

        const journeyIds = [];

        for(let i = 0; i < journeyStopData.data.length; i++)
        {
            const journeyId = journeyStopData.data.journeyId;
            const stationId = journeyStopData.data.stationId;
            journeyId += journeyIds;
            stationId += stationIds;
        }
        /*
        for(let i = 0; i < stationIds.length; i++)
        {
            if(stationIds[i] !== i + 1)
            {
                return false;
            }
            return true;
        }*/
    });
});