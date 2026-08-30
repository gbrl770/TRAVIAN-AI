const BUILDING_COSTS = {
    mainBuilding: {
        base: { wood: 90, clay: 80, iron: 70, crop: 50 },
        factor: 1.28
    },

    warehouseBuilding: {
        base: { wood: 130, clay: 160, iron: 90, crop: 40 },
        factor: 1.28
    },

    granaryBuilding: {
        base: { wood: 80, clay: 100, iron: 70, crop: 20 },
        factor: 1.28
    },

    residence: {
        base: { wood: 580, clay: 460, iron: 350, crop: 180 },
        factor: 1.28
    },

    palace: {
        base: { wood: 550, clay: 800, iron: 750, crop: 250 },
        factor: 1.28
    },

    heroMansion: {
        base: { wood: 210, clay: 140, iron: 260, crop: 120 },
        factor: 1.28
    },

    barracks: {
        base: { wood: 210, clay: 140, iron: 260, crop: 120 },
        factor: 1.28
    },

    stable: {
        base: { wood: 280, clay: 210, iron: 320, crop: 110 },
        factor: 1.28
    },

    workshop: {
        base: { wood: 320, clay: 200, iron: 380, crop: 130 },
        factor: 1.28
    },

    academy: {
        base: { wood: 280, clay: 320, iron: 420, crop: 220 },
        factor: 1.28
    },

    smithy: {
        base: { wood: 170, clay: 200, iron: 380, crop: 130 },
        factor: 1.28
    },

    market: {
        base: { wood: 80, clay: 70, iron: 120, crop: 70 },
        factor: 1.28
    },

    rallyPoint: {
        base: { wood: 110, clay: 160, iron: 90, crop: 70 },
        factor: 1.28
    },

    cityWall: {
        base: { wood: 160, clay: 100, iron: 160, crop: 70 },
        factor: 1.28
    }
};


function getBuildingCost(building, level) {

    const data = BUILDING_COSTS[building];

    if (!data || level < 1) return null;

    const multiplier =
        Math.pow(data.factor, level - 1);

    return {
        wood: Math.round(data.base.wood * multiplier),
        clay: Math.round(data.base.clay * multiplier),
        iron: Math.round(data.base.iron * multiplier),
        crop: Math.round(data.base.crop * multiplier)
    };
}
