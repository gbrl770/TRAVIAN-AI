// ========================================
// TRAVIAN AI - ACCOUNT DATA ENGINE
// ========================================

let account = JSON.parse(
    localStorage.getItem("travianAccount")
) || {
    tribe: "Romans",
    serverSpeed: 3,
    villages: []
};


// ========================================
// HELPERS
// ========================================

function value(id) {
    const element = document.getElementById(id);
    return element ? element.value : "";
}

function number(id) {
    return Number(value(id)) || 0;
}


// ========================================
// CREATE VILLAGE
// ========================================

function saveVillage() {

    const name = value("villageName").trim();

    if (!name) {
        alert("נא להזין שם כפר.");
        return;
    }

    const village = {

        id: Date.now(),

        name: name,

        coordinates: value("coordinates"),

        population: number("population"),

        isCapital: value("isCapital") === "true",

        // -------------------------------
        // RESOURCES
        // -------------------------------

        resources: {
            wood: number("wood"),
            clay: number("clay"),
            iron: number("iron"),
            crop: number("crop")
        },

        production: {
            wood: number("woodProd"),
            clay: number("clayProd"),
            iron: number("ironProd"),
            crop: number("cropProd")
        },

        storage: {
            warehouse: number("warehouse"),
            granary: number("granary")
        },

        cropConsumption: number("cropConsumption"),

        // -------------------------------
        // RESOURCE FIELDS
        // -------------------------------

        fields: {
            wood: [],
            clay: [],
            iron: [],
            crop: []
        },

        // -------------------------------
        // BUILDINGS
        // -------------------------------

        buildings: {},

        // -------------------------------
        // ROMAN TROOPS
        // -------------------------------

        troops: {
            legionnaire: number("legionnaire"),
            praetorian: number("praetorian"),
            imperian: number("imperian"),
            equitesLegati: number("equitesLegati"),
            equitesImperatoris: number("equitesImperatoris"),
            equitesCaesaris: number("equitesCaesaris"),
            ram: number("ram"),
            fireCatapult: number("fireCatapult"),
            senator: number("senator"),
            settler: number("settler")
        },

        // -------------------------------
        // HERO
        // -------------------------------

        hero: {
            level: number("heroLevel"),
            experience: number("heroXP"),
            health: number("heroHealth")
        },

        // -------------------------------
        // QUEUES
        // -------------------------------

        queues: {
            building: [],
            resourceField: [],
            barracks: [],
            stable: [],
            workshop: [],
            academy: [],
            smithy: []
        },

        updatedAt: new Date().toISOString()
    };


    account.villages.push(village);

    saveAccount();

    renderVillages();

    clearForm();

    alert("הכפר נשמר.");
}


// ========================================
// SAVE ACCOUNT
// ========================================

function saveAccount() {

    localStorage.setItem(
        "travianAccount",
        JSON.stringify(account)
    );

}


// ========================================
// RENDER VILLAGES
// ========================================

function renderVillages() {

    const container =
        document.getElementById("villagesContainer");

    if (!container) return;

    if (account.villages.length === 0) {

        container.innerHTML = `
            <div class="empty">
                עדיין לא הוספת כפרים.
            </div>
        `;

        updateDashboard();

        return;
    }


    let html = `
        <table>

            <thead>
                <tr>
                    <th>כפר</th>
                    <th>מיקום</th>
                    <th>אוכלוסייה</th>
                    <th>עץ</th>
                    <th>טיט</th>
                    <th>ברזל</th>
                    <th>יבול</th>
                    <th>יבול נטו</th>
                    <th>פעולה</th>
                </tr>
            </thead>

            <tbody>
    `;


    account.villages.forEach(village => {

        const netCrop =
            village.production.crop -
            village.cropConsumption;


        html += `
            <tr>

                <td>
                    <strong>${village.name}</strong>
                </td>

                <td>
                    ${village.coordinates || "-"}
                </td>

                <td>
                    ${village.population.toLocaleString()}
                </td>

                <td>
                    ${village.resources.wood.toLocaleString()}
                </td>

                <td>
                    ${village.resources.clay.toLocaleString()}
                </td>

                <td>
                    ${village.resources.iron.toLocaleString()}
                </td>

                <td>
                    ${village.resources.crop.toLocaleString()}
                </td>

                <td>
                    ${netCrop.toLocaleString()}/h
                </td>

                <td>
                    <button onclick="deleteVillage(${village.id})">
                        מחק
                    </button>
                </td>

            </tr>
        `;
    });


    html += `
            </tbody>
        </table>
    `;


    container.innerHTML = html;

    updateDashboard();
}


// ========================================
// DELETE
// ========================================

function deleteVillage(id) {

    if (!confirm("למחוק את הכפר?")) {
        return;
    }

    account.villages =
        account.villages.filter(
            village => village.id !== id
        );

    saveAccount();

    renderVillages();
}


// ========================================
// DASHBOARD
// ========================================

function updateDashboard() {

    let population = 0;

    let troops = 0;


    account.villages.forEach(village => {

        population += village.population;

        Object.values(village.troops)
            .forEach(amount => {
                troops += amount;
            });

    });


    const villageCount =
        document.getElementById("villageCount");

    const populationTotal =
        document.getElementById("populationTotal");

    const troopsTotal =
        document.getElementById("troopsTotal");


    if (villageCount)
        villageCount.value =
            account.villages.length;

    if (populationTotal)
        populationTotal.value =
            population.toLocaleString();

    if (troopsTotal)
        troopsTotal.value =
            troops.toLocaleString();
}


// ========================================
// CLEAR FORM
// ========================================

function clearForm() {

    document
        .querySelectorAll("input")
        .forEach(input => {

            if (input.readOnly) return;

            if (input.type === "number") {
                input.value = 0;
            }

            else {
                input.value = "";
            }

        });
}


// ========================================
// START
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {
        renderVillages();
    }
);
