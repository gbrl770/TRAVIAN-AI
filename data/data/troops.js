const ROMAN_TROOPS = {
    legionnaire: {
        name: "לגיונר",
        type: "infantry",
        attack: 40,
        defenseInfantry: 35,
        defenseCavalry: 50,
        crop: 1
    },

    praetorian: {
        name: "פרטוריאן",
        type: "infantry",
        attack: 30,
        defenseInfantry: 65,
        defenseCavalry: 35,
        crop: 1
    },

    imperian: {
        name: "אימפריאן",
        type: "infantry",
        attack: 70,
        defenseInfantry: 40,
        defenseCavalry: 25,
        crop: 1
    },

    equitesLegati: {
        name: "אקוויטס לגטי",
        type: "cavalry",
        attack: 0,
        defenseInfantry: 20,
        defenseCavalry: 10,
        crop: 2
    },

    equitesImperatoris: {
        name: "אקוויטס אימפרטוריס",
        type: "cavalry",
        attack: 120,
        defenseInfantry: 65,
        defenseCavalry: 50,
        crop: 3
    },

    equitesCaesaris: {
        name: "אקוויטס קיסריס",
        type: "cavalry",
        attack: 180,
        defenseInfantry: 80,
        defenseCavalry: 105,
        crop: 4
    },

    ram: {
        name: "איל ניגוח",
        type: "siege",
        attack: 60,
        defenseInfantry: 30,
        defenseCavalry: 75,
        crop: 3
    },

    fireCatapult: {
        name: "קטפולטת אש",
        type: "siege",
        attack: 75,
        defenseInfantry: 60,
        defenseCavalry: 10,
        crop: 6
    },

    senator: {
        name: "סנאטור",
        type: "conquest",
        attack: 50,
        defenseInfantry: 40,
        defenseCavalry: 30,
        crop: 5
    },

    settler: {
        name: "מתיישב",
        type: "expansion",
        attack: 0,
        defenseInfantry: 80,
        defenseCavalry: 80,
        crop: 1
    }
};
