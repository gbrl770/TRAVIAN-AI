// ========================================
// Travian AI - Data Manager
// ========================================

let villages = JSON.parse(
    localStorage.getItem("travianVillages")
) || [];


// ----------------------------------------
// Helper
// ----------------------------------------

function value(id) {
    return document.getElementById(id).value;
}

function number(id) {
    return Number(value(id)) || 0;
}


// ----------------------------------------
// Save Village
// ----------------------------------------

function saveVillage() {

    const name = value("villageName").trim();

    if (!name) {
        alert("נא להזין שם כפר.");
        return;
    }

    const village = {

        id: Date.now(),

        name: name,

        coordinates: value("coordinates").trim(),

        population: number("population"),

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

        troops: {
            legionnaire: number("legionnaire"),
            praetorian: number("praetorian"),
            imperian: number("imperian"),
            imperatoris: number("imperatoris")
        },

        buildings: {
            mainBuilding: number("mainBuilding"),
            residence: number("residence"),
            heroMansion: number("heroMansion"),
            barracks: number("barracks"),
            stable: number("stable"),
            market: number("market")
        },

        updatedAt: new Date().toISOString()
    };


    villages.push(village);

    saveData();

    renderVillages();

    clearForm();

    alert("הכפר נשמר בהצלחה.");
}


// ----------------------------------------
// Save to browser
// ----------------------------------------

function saveData() {

    localStorage.setItem(
        "travianVillages",
        JSON.stringify(villages)
    );

}


// ----------------------------------------
// Display Villages
// ----------------------------------------

function renderVillages() {

    const container =
        document.getElementById("villagesContainer");


    if (!container) {
        return;
    }


    if (villages.length === 0) {

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
                    <th>🪵 עץ</th>
                    <th>🧱 טיט</th>
                    <th>⛓️ ברזל</th>
                    <th>🌾 יבול</th>
                    <th>פעולה</th>
                </tr>

            </thead>

            <tbody>
    `;


    villages.forEach(village => {

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
                    <button
                        onclick="deleteVillage(${village.id})"
                    >
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


// ----------------------------------------
// Delete Village
// ----------------------------------------

function deleteVillage(id) {

    const confirmed =
        confirm("האם אתה בטוח שברצונך למחוק את הכפר?");

    if (!confirmed) {
        return;
    }


    villages =
        villages.filter(
            village => village.id !== id
        );


    saveData();

    renderVillages();
}


// ----------------------------------------
// Dashboard
// ----------------------------------------

function updateDashboard() {

    let population = 0;

    let troops = 0;


    villages.forEach(village => {

        population += village.population;


        troops +=
            village.troops.legionnaire +
            village.troops.praetorian +
            village.troops.imperian +
            village.troops.imperatoris;

    });


    const villageCount =
        document.getElementById("villageCount");

    const populationTotal =
        document.getElementById("populationTotal");

    const troopsTotal =
        document.getElementById("troopsTotal");


    if (villageCount) {
        villageCount.textContent =
            villages.length;
    }


    if (populationTotal) {
        populationTotal.textContent =
            population.toLocaleString();
    }


    if (troopsTotal) {
        troopsTotal.textContent =
            troops.toLocaleString();
    }
}


// ----------------------------------------
// Clear Form
// ----------------------------------------

function clearForm() {

    const inputs =
        document.querySelectorAll("input");


    inputs.forEach(input => {

        if (input.type === "number") {
            input.value = 0;
        }

        else {
            input.value = "";
        }

    });

}


// ----------------------------------------
// Start Application
// ----------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderVillages();

    }
);
