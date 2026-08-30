const TROOP_COSTS = {
    legionnaire: {
        wood: 120,
        clay: 100,
        iron: 150,
        crop: 30
    },

    praetorian: {
        wood: 100,
        clay: 130,
        iron: 160,
        crop: 70
    },

    imperian: {
        wood: 150,
        clay: 160,
        iron: 210,
        crop: 80
    },

    equitesLegati: {
        wood: 140,
        clay: 160,
        iron: 20,
        crop: 40
    },

    equitesImperatoris: {
        wood: 550,
        clay: 440,
        iron: 320,
        crop: 100
    },

    equitesCaesaris: {
        wood: 550,
        clay: 640,
        iron: 800,
        crop: 180
    },

    ram: {
        wood: 900,
        clay: 360,
        iron: 500,
        crop: 70
    },

    fireCatapult: {
        wood: 960,
        clay: 1350,
        iron: 600,
        crop: 90
    },

    senator: {
        wood: 30750,
        clay: 27200,
        iron: 45000,
        crop: 37500
    },

    settler: {
        wood: 7200,
        clay: 5500,
        iron: 5800,
        crop: 6500
    }
};


function getTroopCost(type, amount = 1) {

    const cost = TROOP_COSTS[type];

    if (!cost) return null;

    return {
        wood: cost.wood * amount,
        clay: cost.clay * amount,
        iron: cost.iron * amount,
        crop: cost.crop * amount
    };
}


function getTroopTotalCost(type, amount = 1) {

    const cost = getTroopCost(type, amount);

    if (!cost) return 0;

    return (
        cost.wood +
        cost.clay +
        cost.iron +
        cost.crop
    );
}
