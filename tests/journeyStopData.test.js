const journeyStopData = require('../journeyStopData.json');

describe('JourneyStop-data', () =>
{
    test('skal inneholde nøyaktig 216 stoppoppføringer', () =>
    {
        expect(journeyStopData.data).toHaveLength(216);
    });

    test('hver togreise skal ha nøyaktig 9 stopp', () =>
    {
        const journeys = {};

        journeyStopData.data.forEach(stop =>
        {
            const journeyId = stop.journeyId;

            if (!journeys[journeyId])
            {
                journeys[journeyId] = 0;
            }

            journeys[journeyId]++;
        });

        Object.values(journeys).forEach(numberOfStops =>
        {
            expect(numberOfStops).toBe(9);
        });
    });
});
