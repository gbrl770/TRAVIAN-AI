const TRAVIAN_AI = {

    analyze(account) {

        if (!account || !account.villages?.length) {
            return [{
                priority: "info",
                title: "אין מספיק נתונים",
                text: "הוסף לפחות כפר אחד כדי להתחיל ניתוח."
            }];
        }

        const recommendations = [];

        account.villages.forEach(village => {

            const netCrop =
                TRAVIAN_CALCULATOR.getNetCrop(village);

            const troops =
                TRAVIAN_CALCULATOR.getTotalTroops(village);

            const warehouse =
                Number(village.storage?.warehouse || 0);

            const granary =
                Number(village.storage?.granary || 0);

            const crop =
                Number(village.resources?.crop || 0);

            if (netCrop < 0) {
                recommendations.push({
                    priority: "critical",
                    village: village.name,
                    title: "מחסור ביבול",
                    text: `לכפר יש יבול נטו של ${netCrop}/שעה. יש לטפל באספקת היבול.`
                });
            }

            if (crop > granary * 0.9 && granary > 0) {
                recommendations.push({
                    priority: "high",
                    village: village.name,
                    title: "האסם כמעט מלא",
                    text: "כדאי לנצל או להעביר יבול לפני שהייצור ייתקע."
                });
            }

            if (warehouse > 0) {

                const totalResources =
                    TRAVIAN_CALCULATOR.getTotalResources(village);

                const capacity =
                    warehouse * 4;

                if (totalResources > capacity * 0.9) {
                    recommendations.push({
                        priority: "high",
                        village: village.name,
                        title: "המחסן כמעט מלא",
                        text: "כדאי לבצע בנייה, מסחר או העברת משאבים."
                    });
                }
            }

            if (troops === 0) {
                recommendations.push({
                    priority: "medium",
                    village: village.name,
                    title: "אין צבא",
                    text: "אין כרגע חיילים רשומים בכפר."
                });
            }
        });

        if (!recommendations.length) {
            recommendations.push({
                priority: "good",
                title: "החשבון נראה תקין",
                text: "לא נמצאה כרגע בעיה בסיסית הדורשת פעולה."
            });
        }

        return recommendations;
    }
};


function getAIRecommendations() {

    const results =
        TRAVIAN_AI.analyze(account);

    const container =
        document.getElementById("aiAnalysis");

    if (!container) return;

    container.innerHTML =
        results.map(item => `
            <div class="ai-item">
                <strong>
                    ${item.title}
                </strong>

                ${item.village
                    ? `<span> — ${item.village}</span>`
                    : ""}

                <br>

                ${item.text}
            </div>
        `).join("");
}
