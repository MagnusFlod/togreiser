/*
const fs = require('fs');

const journeyData = require('./journeyData.json');

const journeyStopData = [];

const arrivalOffsets = [0, 10, 27, 40, 45, 50, 54, 62, 72];

const departureOffsets = [0, 15, 30, 43, 47, 52, 56, 64, 90];

for(let i = 0; i < journeyData.data.length; i++)
{
    const journeyDate = journeyData.data[i].journeyDate;

    const journeyId = i + 1;

    const firstDeparture = Date.parse(journeyDate + 'Z');

    for(let j = 0; j < arrivalOffsets.length; j++)
    {
        const stationId = j + 1;
        const stopSequence = j + 1;
        const expectedArrival = firstDeparture + arrivalOffsets[j] * 60000;
        const expectedDeparture = firstDeparture + departureOffsets[j] * 60000;

        const arrivalTime = new Date(expectedArrival).toISOString().slice(0, 19);
        const departureTime = new Date(expectedDeparture).toISOString().slice(0, 19);

        const journey =
        {
            journeyId: journeyId,
            stationId: stationId,
            stopSequence: stopSequence,
            arrivalTime: arrivalTime,
            departureTime: departureTime
        }

        journeyStopData.push(journey);

    }
    
}

fs.writeFileSync
(
    './journeyStopDataGenerated.json',
    JSON.stringify({ data: journeyStopData }, null, 2)
);
*/



const fs = require('fs');

const journeyData = require('./journeyData.json');

const journeyStopData = [];

const arrivalOffsets = [0, 6, 13, 19, 26, 34, 49, 64, 79];

const departureOffsets = [0, 8, 15, 22, 28, 38, 52, 66, 90];

let journeyId = 25;

for(let i = 0; i < journeyData.data.length; i++)
{
    const trainId = journeyData.data[i].trainId;

    if(trainId >= 7 && trainId <= 12)
    {
        const journeyDate = journeyData.data[i].journeyDate;

        const currentJourneyId = journeyId;

        const firstDeparture = Date.parse(journeyDate + 'Z');

        for(let j = 0; j < arrivalOffsets.length; j++)
        {
            const stationId = 9 - j;
            const stopSequence = j + 1;

            const expectedArrival = firstDeparture + arrivalOffsets[j] * 60000;
            const expectedDeparture = firstDeparture + departureOffsets[j] * 60000;

            const arrivalTime = new Date(expectedArrival).toISOString().slice(0, 19);
            const departureTime = new Date(expectedDeparture).toISOString().slice(0, 19);

            const journey =
            {
                journeyId: currentJourneyId,
                stationId: stationId,
                stopSequence: stopSequence,
                arrivalTime: arrivalTime,
                departureTime: departureTime
            };

            journeyStopData.push(journey);
        }

        journeyId++;
    }
}

fs.writeFileSync(
    './journeyStopDataReturnGenerated.json',
    JSON.stringify({ data: journeyStopData }, null, 2)
);


