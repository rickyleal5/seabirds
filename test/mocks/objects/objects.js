const colonies = [
    {
        id: 1
    },
    {
        id: 2
    }
];

const species = [
    {
        id: 'tCOGU',
        name: 'Common guillemot'
    },
    {
        id: 'tRAZO',
        name: 'Razorbill'
    }
];

const birds = [
    {
        id: 1,
        speciesId: 'tCOGU',
        colonyId: 1
    },
    {
        id: 2,
        speciesId: 'tRAZO',
        colonyId: 2
    }
];

const gpsTracks = [
    {
        id: 1,
        latitude: 1.1,
        longitude: -1.1,
        altitude: -1.1,
        unix: 1111111111n,
        birdId: 1,
        year: 2011,
        dateTime: new Date('2011-01-01 01:01:01' + ' UTC').getTime(),
        maxDepth: -1.1,
        coverageRatio: 1.1,
        isDive0m: false,
        isDive1m: false,
        isDive2m: false,
        isDive3m: false,
        isDive4m: false,
        isDive5m: false
    },
    {
        id: 2,
        latitude: 2.2,
        longitude: -2.2,
        altitude: -2.2,
        unix: 2222222222n,
        birdId: 2,
        year: 2012,
        dateTime: new Date('2022-02-02 02:02:02' + ' UTC').getTime(),
        maxDepth: -2.2,
        coverageRatio: 2.2,
        isDive0m: false,
        isDive1m: false,
        isDive2m: false,
        isDive3m: false,
        isDive4m: false,
        isDive5m: false
    }
];

export const mocks = {
    colonies,
    species,
    birds,
    gpsTracks
};
