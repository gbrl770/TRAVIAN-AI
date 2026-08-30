let account = JSON.parse(
    localStorage.getItem("travianAccount")
) || {
    tribe: "Romans",
    serverSpeed: 3,
    villages: []
};

let editingVillageId = null;


// ================================
// HELPERS
// ================================

function value(id) {
    const element = document.getElementById(id);
    return element ? element.value : "";
}

function number(id) {
    return Number(value(id)) || 0;
}

function setValue(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.value = value ?? "";
    }
}


// ================================
// SAVE VILLAGE
// ================================

function saveVillage() {

    const name = value("villageName").trim();

    if (!name) {
        alert("נא להזין שם כפר.");
        return;
    }

    const villageData = {

        name: name,

        coordinates: value("coordinates"),

        population: number("population"),

        isCapital: value("isCapital") === "true",

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

        fields: {
            wood: [],
            clay: [],
            iron: [],
            crop: []
        },

        buildings: {},

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

        hero: {
            level: number("heroLevel"),
            experience: number("heroXP"),
            health: number("heroHealth")
        },

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


    // EDIT EXISTING VILLAGE

    if (editingVillageId !== null) {

        const index =
            account.villages.findIndex(
                village => village.id === editingVillageId
            );

        if (index !== -1) {

            account.villages[index] = {
                ...account.villages[index],
                ...villageData
            };

        }

        editingVillageId = null;

    }

    // CREATE NEW VILLAGE

    else {

        account.villages.push({
            id: Date.now(),
            ...villageData
        });

    }


    saveAccount();

    renderVillages();

    clearForm();

    alert("הכפר נשמר בהצלחה.");
}


// ================================
// EDIT VILLAGE
// ================================

function editVillage(id) {

    const village =
        account.villages.find(
            village => village.id === id
        );

    if (!village) return;


    editingVillageId = id;


    setValue("villageName", village.name);

    setValue("coordinates", village.coordinates);

    setValue("population", village.population);

    setValue(
        "isCapital",
        village.isCapital ? "true" : "false"
    );


    setValue("wood", village.resources.wood);
    setValue("clay", village.resources.clay);
    setValue("iron", village.resources.iron);
    setValue("crop", village.resources.crop);


    setValue("woodProd", village.production.wood);
    setValue("clayProd", village.production.clay);
    setValue("ironProd", village.production.iron);
    setValue("cropProd", village.production.crop);


    setValue(
        "warehouse",
        village.storage?.warehouse
    );

    setValue(
        "granary",
        village.storage?.granary
    );

    setValue(
        "cropConsumption",
        village.cropConsumption
    );


    setValue(
        "legionnaire",
        village.troops.legionnaire
    );

    setValue(
        "praetorian",
        village.troops.praetorian
    );

    setValue(
        "imperian",
        village.troops.imperian
    );

    setValue(
        "equitesLegati",
        village.troops.equitesLegati
    );

    setValue(
        "equitesImperatoris",
        village.troops.equitesImperatoris
    );

    setValue(
        "equitesCaesaris",
        village.troops.equitesCaesaris
    );

    setValue(
        "ram",
        village.troops.ram
    );

    setValue(
        "fireCatapult",
        village.troops.fireCatapult
    );

    setValue(
        "senator",
        village.troops.senator
    );

    setValue(
        "settler",
        village.troops.settler
    );


    setValue(
        "heroLevel",
        village.hero?.level
    );

    setValue(
        "heroXP",
        village.hero?.experience
    );

    setValue(
        "heroHealth",
        village.hero?.health ?? 100
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ================================
// SAVE ACCOUNT
// ================================

function saveAccount() {

    localStorage.setItem(
        "travianAccount",
        JSON.stringify(account)
    );

}


// ================================
// RENDER VILLAGES
// ================================

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
                    <th>פעולות</th>

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

                    <button
                        onclick="editVillage(${village.id})">
                        ✏️ ערוך
                    </button>

                    <button
                        onclick="deleteVillage(${village.id})">
                        🗑️ מחק
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


// ================================
// DELETE
// ================================

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


// ================================
// DASHBOARD
// ================================

function updateDashboard() {

    let population = 0;
    let troops = 0;


    account.villages.forEach(village => {

        population += village.population;


        Object.values(village.troops)
            .forEach(amount => {

                troops += Number(amount) || 0;

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


// ================================
// CLEAR FORM
// ================================

function clearForm() {

    editingVillageId = null;


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


    const capital =
        document.getElementById("isCapital");

    if (capital) {
        capital.value = "false";
    }

}


// ================================
// START
// ================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderVillages();

    }
);
