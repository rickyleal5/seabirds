export const extractGPSTrack = (data) => {
    const gpsTrack = {
        id: data[''],
        latitude: parseFloat(data.lat),
        longitude: parseFloat(data.lon),
        altitude: parseFloat(data.alt),
        unix: BigInt(data?.unix),
        birdId: parseInt(data?.bird),
        speciesId: data?.species,
        year: parseInt(data?.year.slice(1)),
        dateTime: new Date(data?.date_time + ' UTC').getTime(),
        maxDepth: parseFloat(data?.['max_depth.m']),
        colonyId: parseInt(data?.colony2),
        coverageRatio: parseFloat(data?.coverage_ratio),
        isDive0m: String(data?.is_dive_0m) === 'TRUE',
        isDive1m: String(data?.is_dive_1m) === 'TRUE',
        isDive2m: String(data?.is_dive_2m) === 'TRUE',
        isDive3m: String(data?.is_dive) === 'TRUE',
        isDive4m: String(data?.is_dive_4m) === 'TRUE',
        isDive5m: String(data?.is_dive_5m) === 'TRUE'
    };

    return gpsTrack;
};

export const speciesName = {
    tRAZO: 'Razorbill',
    tCOGU: 'Common guillemot',
    tEUSH: 'European shag'
};
