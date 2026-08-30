// ========================================
// TRAVIAN AI — ACCOUNT ENGINE
// ========================================

let account = JSON.parse(
    localStorage.getItem("travianAccount")
) || {
    tribe: "Romans",
    serverSpeed: 3,
    villages: []
};

let editingVillageId = null;


// ========================================
// HELPERS
// ========================================

function get(id) {
    const element = document.getElementById(id);
    return element ? element.value : "";
}

function num(id) {
    return Number(get(id)) || 0;
}

function set(id, value) {
    const element = document.getElementById(id);
    if (element) element.value = value ?? "";
}

function saveAccount() {
    localStorage.setItem(
        "travianAccount",
        JSON.stringify(account)
    );
}


// ========================================
// VILLAGE DATA
// ========================================

function collectVillageData() {

    const buildings = {};

    Object.keys(BUILDINGS).forEach(key => {
        const element = document.getElementById(key);

        if (element) {
            buildings[key] = Number(element.value) || 0;
        }
    });


    const troops = {};

    Object.keys(ROMAN_TROOPS).forEach(key => {
        const element = document.getElementById(key);

        if (element) {
            troops[key] = Number(element.value) || 0;
        }
    });


    return {

        name: get("villageName").trim(),

        coordinates: get("coordinates"),

        population: num("population"),

        isCapital: get("isCapital") === "true",


        resources: {
            wood: num("wood"),
            clay: num("clay"),
            iron: num("iron"),
            crop: num("crop")
        },


        production: {
            wood: num("woodProd"),
            clay: num("clayProd"),
            iron: num("ironProd"),
            crop: num("cropProd")
        },


        storage: {
            warehouse: num("warehouse"),
            granary: num("granary")
        },


        cropConsumption: num("cropConsumption"),


        resourceFields: parseResourceFields(
            get("resourceFields")
        ),


        buildings,


        troops,


        hero: {
            level: num("heroLevel"),
            experience: num("heroXP"),
            health: num("heroHealth")
        },


        oasis: {
            count: num("oasisCount"),
            wood: num("oasisWood"),
            clay: num("oasisClay"),
            iron: num("oasisIron"),
            crop: num("oasisCrop")
        },


        queues: {
            building: get("buildingQueue"),
            field: get("fieldQueue"),
            barracks: get("barracksQueue"),
            stable: get("stableQueue")
        },


        updatedAt: new Date().toISOString()
    };
}


// ========================================
// RESOURCE FIELD PARSER
// ========================================

function parseResourceFields(text) {

    const result = {
        wood: [],
        clay: [],
        iron: [],
        crop: []
    };

    if (!text) return result;


    const sections = text.split("|");

    sections.forEach(section => {

        const parts = section.split(":");

        if (parts.length !== 2) return;

        const type = parts[0].trim();

        const levels = parts[1]
            .split(",")
            .map(x => Number(x.trim()))
            .filter(x => !isNaN(x));


        if (result[type]) {
            result[type] = levels;
        }

    });


    return result;
}


// ========================================
// SAVE VILLAGE
// ========================================

function saveVillage() {

    const name = get("villageName").trim();

    if (!name) {
        alert("נא להזין שם כפר.");
        return;
    }


    const data = collectVillageData();


    if (editingVillageId !== null) {

        const index =
            account.villages.findIndex(
                village => village.id === editingVillageId
            );


        if (index !== -1) {

            account.villages[index] = {
                ...account.villages[index],
                ...data
            };

        }

    } else {

        account.villages.push({
            id: Date.now(),
            ...data
        });

    }


    editingVillageId = null;

    saveAccount();

    renderVillages();

    clearForm();
}


// ========================================
// EDIT VILLAGE
// ========================================

function editVillage(id) {

    const village =
        account.villages.find(
            village => village.id === id
        );


    if (!village) return;


    editingVillageId = id;


    set("villageName", village.name);
    set("coordinates", village.coordinates);
    set("population", village.population);

    set(
        "isCapital",
        village.isCapital ? "true" : "false"
    );


    set("wood", village.resources.wood);
    set("clay", village.resources.clay);
    set("iron", village.resources.iron);
    set("crop", village.resources.crop);


    set("woodProd", village.production.wood);
    set("clayProd", village.production.clay);
    set("ironProd", village.production.iron);
    set("cropProd", village.production.crop);


    set("warehouse", village.storage.warehouse);
    set("granary", village.storage.granary);
    set("cropConsumption", village.cropConsumption);


    Object.entries(village.buildings || {})
        .forEach(([key, value]) => {
            set(key, value);
        });


    Object.entries(village.troops || {})
        .forEach(([key, value]) => {
            set(key, value);
        });


    set("heroLevel", village.hero?.level);
    set("heroXP", village.hero?.experience);
    set("heroHealth", village.hero?.health ?? 100);


    set("oasisCount", village.oasis?.count);
    set("oasisWood", village.oasis?.wood);
    set("oasisClay", village.oasis?.clay);
    set("oasisIron", village.oasis?.iron);
    set("oasisCrop", village.oasis?.crop);


    set("buildingQueue", village.queues?.building);
    set("fieldQueue", village.queues?.field);
    set("barracksQueue", village.queues?.barracks);
    set("stableQueue", village.queues?.stable);


    const fields = village.resourceFields;

    if (fields) {

        set(
            "resourceFields",
            `wood: ${fields.wood.join(",")}| clay: ${fields.clay.join(",")}| iron: ${fields.iron.join(",")}| crop: ${fields.crop.join(",")}`
        );

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ========================================
// DELETE VILLAGE
// ========================================

function deleteVillage(id) {

    if (!confirm("למחוק את הכפר?")) return;


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
    let netCrop = 0;


    account.villages.forEach(village => {

        population += village.population;


        Object.values(village.troops || {})
            .forEach(amount => {
                troops += Number(amount) || 0;
            });


        netCrop +=
            village.production.crop -
            village.cropConsumption;

    });


    set("villageCount", account.villages.length);

    set(
        "populationTotal",
        population.toLocaleString()
    );

    set(
        "troopsTotal",
        troops.toLocaleString()
    );

    set(
        "netCropTotal",
        netCrop.toLocaleString()
    );
}


// ========================================
// VILLAGE TABLE
// ========================================

function renderVillages() {

    const container =
        document.getElementById("villagesContainer");


    if (!container) return;


    if (!account.villages.length) {

        container.innerHTML = `
            <div class="empty">
                עדיין לא הוספת כפרים.
            </div>
        `;

        updateDashboard();
        updateAI();

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
                    <strong>
                        ${village.name}
                    </strong>

                    ${village.isCapital ? " 🏛️" : ""}
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
                        ✏️
                    </button>

                    <button
                        onclick="deleteVillage(${village.id})">
                        🗑️
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

    updateAI();
}


// ========================================
// BASIC AI ANALYSIS
// ========================================

function updateAI() {

    const container =
        document.getElementById("aiAnalysis");


    if (!container) return;


    if (!account.villages.length) {

        container.textContent =
            "הוסף נתוני כפר כדי לקבל ניתוח.";

        return;
    }


    const villages =
        account.villages.map(village => ({

            name: village.name,

            netCrop:
                village.production.crop -
                village.cropConsumption,

            population:
                village.population,

            troops:
                Object.values(village.troops || {})
                    .reduce(
                        (sum, value) =>
                            sum + Number(value),
                        0
                    )

        }));


    const strongest =
        [...villages].sort(
            (a, b) => b.troops - a.troops
        )[0];


    const lowestCrop =
        [...villages].sort(
            (a, b) => a.netCrop - b.netCrop
        )[0];


    container.innerHTML = `

        <strong>ניתוח חשבון</strong>

        <br><br>

        🏰 כפרים:
        <strong>${villages.length}</strong>

        <br>

        ⚔️ הכפר עם הצבא הגדול ביותר:
        <strong>${strongest.name}</strong>
        (${strongest.troops.toLocaleString()} חיילים)

        <br>

        🌾 הכפר עם היבול הנטו הנמוך ביותר:
        <strong>${lowestCrop.name}</strong>
        (${lowestCrop.netCrop.toLocaleString()}/שעה)

    `;
}


// ========================================
// CLEAR FORM
// ========================================

function clearForm() {

    editingVillageId = null;


    document
        .querySelectorAll("input, textarea")
        .forEach(element => {

            if (element.readOnly) return;

            if (element.type === "number") {
                element.value = 0;
            } else {
                element.value = "";
            }

        });


    set("isCapital", "false");
    set("heroHealth", 100);
}


// ========================================
// EXPORT
// ========================================

function exportData() {

    const data =
        JSON.stringify(account, null, 2);


    const blob =
        new Blob(
            [data],
            { type: "application/json" }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "travian-ai-account.json";


    link.click();


    URL.revokeObjectURL(url);
}


// ========================================
// IMPORT
// ========================================

function importData(event) {

    const file =
        event.target.files[0];


    if (!file) return;


    const reader =
        new FileReader();


    reader.onload = function(e) {

        try {

            const imported =
                JSON.parse(e.target.result);


            if (
                !imported ||
                !Array.isArray(imported.villages)
            ) {
                throw new Error();
            }


            account = imported;

            saveAccount();

            renderVillages();


        } catch {

            alert(
                "קובץ הנתונים אינו תקין."
            );

        }

    };


    reader.readAsText(file);

    event.target.value = "";
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
