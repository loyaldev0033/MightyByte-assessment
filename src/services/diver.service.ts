const locationStore: Record<string, { lat: number, long: number, timestamp: number }> = {};

export const updateDriverLocation = (driverId: string, lat: number, long: number) => {
    locationStore[driverId] = { lat, long, timestamp: Date.now() };
};

export const getDriverLocation = (driverId: string) => {
    return locationStore[driverId];
};
