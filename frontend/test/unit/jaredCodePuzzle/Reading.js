module.exports = class Reading {
    constructor(cumulative, readingDate){
        this.cumulative = cumulative;
        this.readingDate = new Date(readingDate);
    }

    static getEstimatesFromReadingsArray = function(readings) {
        if (readings.length < 2) {
            throw new RangeError("readings array must have at least two elements")
        }

        let estimates = [];
        let firstReading = readings.shift();
        while (readings.length) {
            let secondReading = readings.shift();

            if (secondReading.readingDate <= firstReading.readingDate) {
                throw new RangeError("readings must be in ascending date order");
            }

            let dailyCumulative = Reading.getDailyEstimatedCumluative(firstReading, secondReading);
            let missingEstimates = Reading.getEstimationDatesBetweenDates(firstReading.readingDate, secondReading.readingDate);

            missingEstimates.forEach(function (estimateDate) {
                let daysUntilMonthEnd = estimateDate.daysBetween(firstReading.readingDate);
                let estimatedCumulativeAtMonthEnd = Math.floor(firstReading.cumulative + (dailyCumulative * daysUntilMonthEnd));

                estimates.push(new Reading(estimatedCumulativeAtMonthEnd, estimateDate));
            });
            firstReading = secondReading;
        }

        return estimates;
    }

    static getDailyEstimatedCumluative(firstReading, secondReading) {
        let cumulativeDiff = secondReading.cumulative - firstReading.cumulative;
        let readingDaysDiff = secondReading.readingDate.daysBetween(firstReading.readingDate);
        return cumulativeDiff / readingDaysDiff;
    }

    static getEstimationDatesBetweenDates(d1, d2) {
        let estimations = [];
        let startDate = d1.addDays(1);
        let lastDayOfMonth = startDate.getLastDayOfMonth();

        while (lastDayOfMonth.compare(d2) < 0) {
            estimations.push(lastDayOfMonth);
            let firstOfNextMonth = lastDayOfMonth.addDays(1);
            lastDayOfMonth = firstOfNextMonth.getLastDayOfMonth();
        };

        return estimations;
    };
};