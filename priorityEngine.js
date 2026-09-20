function calculatePriority(data) {

    let score = 0;

    if (data.conscious === false) {
        score += 5;
    }

    if (data.breathingDifficulty === true) {
        score += 5;
    }

    if (data.severeBleeding === true) {
        score += 5;
    }

    if (data.chestPain === true) {
        score += 4;
    }

    if (data.unconscious === true) {
        score += 5;
    }

    if (data.distanceKm > 20) {
        score += 2;
    }


    let recommendation = "LOW";

    if (score >= 10) {
        recommendation = "CRITICAL";
    } else if (score >= 7) {
        recommendation = "HIGH";
    } else if (score >= 4) {
        recommendation = "MODERATE";
    }


    return {

        score,

        recommendation,

        requiresHumanReview: true,

        disclaimer:
            "AI-assisted prioritization only. "
            + "Clinical/EMS personnel must make the final decision."

    };

}


module.exports = {
    calculatePriority
};
