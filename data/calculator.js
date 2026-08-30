const TRAVIAN_CALCULATOR = {

    resources: ["wood", "clay", "iron", "crop"],

    getTotalResources(village) {
        return (
            Number(village.resources.wood || 0) +
            Number(village.resources.clay || 0) +
            Number(village.resources.iron || 0) +
            Number(village.resources.crop || 0)
        );
    },

    getNetCrop(village) {
        return (
            Number(village.production.crop || 0) -
            Number(village.cropConsumption || 0)
        );
    },

    getTotalTroops(village) {
        return Object.values(village.troops || {})
            .reduce((total, amount) => total + Number(amount || 0), 0);
    },

    getTroopAttack(village) {
        return Object.entries(village.troops || {})
            .reduce((total, [type, amount]) => {
                const troop = ROMAN_TROOPS[type];
                if (!troop) return total;

                return total +
                    Number(amount || 0) *
                    Number(troop.attack || 0);
            }, 0);
    },

    getInfantryDefense(village) {
        return Object.entries(village.troops || {})
            .reduce((total, [type, amount]) => {
                const troop = ROMAN_TROOPS[type];
                if (!troop) return total;

                return total +
                    Number(amount || 0) *
                    Number(troop.defenseInfantry || 0);
            }, 0);
    },

    getCavalryDefense(village) {
        return Object.entries(village.troops || {})
            .reduce((total, [type, amount]) => {
                const troop = ROMAN_TROOPS[type];
                if (!troop) return total;

                return total +
                    Number(amount || 0) *
                    Number(troop.defenseCavalry || 0);
            }, 0);
    },

    getTotalCropConsumption(village) {
        return Object.entries(village.troops || {})
            .reduce((total, [type, amount]) => {
                const troop = ROMAN_TROOPS[type];
                if (!troop) return total;

                return total +
                    Number(amount || 0) *
                    Number(troop.crop || 0);
            }, 0);
    },

    getResourceProduction(village) {
        return {
            wood: Number(village.production.wood || 0),
            clay: Number(village.production.clay || 0),
            iron: Number(village.production.iron || 0),
            crop: Number(village.production.crop || 0)
        };
    },

    getHourlyProduction(village) {
        const production = this.getResourceProduction(village);

        return {
            wood: production.wood,
            clay: production.clay,
            iron: production.iron,
            crop: production.crop -
                Number(village.cropConsumption || 0)
        };
    },

    getStorageStatus(village) {
        return {
            warehouse: Number(village.storage?.warehouse || 0),
            granary: Number(village.storage?.granary || 0)
        };
    },

    getVillagePower(village) {
        return (
            this.getTroopAttack(village) +
            this.getInfantryDefense(village) +
            this.getCavalryDefense(village)
        );
    },

    getAccountSummary(account) {

        const summary = {
            villages: account.villages.length,
            population: 0,
            troops: 0,
            attack: 0,
            infantryDefense: 0,
            cavalryDefense: 0,
            netCrop: 0,
            production: {
                wood: 0,
                clay: 0,
                iron: 0,
                crop: 0
            }
        };

        account.villages.forEach(village => {

            summary.population +=
                Number(village.population || 0);

            summary.troops +=
                this.getTotalTroops(village);

            summary.attack +=
                this.getTroopAttack(village);

            summary.infantryDefense +=
                this.getInfantryDefense(village);

            summary.cavalryDefense +=
                this.getCavalryDefense(village);

            summary.netCrop +=
                this.getNetCrop(village);

            const production =
                this.getResourceProduction(village);

            summary.production.wood += production.wood;
            summary.production.clay += production.clay;
            summary.production.iron += production.iron;
            summary.production.crop += production.crop;
        });

        return summary;
    }
};
