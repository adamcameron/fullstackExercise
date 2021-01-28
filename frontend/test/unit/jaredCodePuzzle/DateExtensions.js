Date.prototype.getLastDayOfMonth = function() {
    let lastDayOfMonth = new Date(this.toDateString());
    lastDayOfMonth.setDate(1);
    lastDayOfMonth.setMonth(lastDayOfMonth.getMonth()+1);
    lastDayOfMonth.setDate(0);

    return lastDayOfMonth;
};

Date.prototype.compare = function (date) {
    let d1ToCompare = new Date(this.toDateString());
    let d2ToCompare = new Date(date.toDateString());
    return Math.sign(d1ToCompare.valueOf() - d2ToCompare.valueOf());
};

Date.prototype.daysBetween = function (date) {
    const millisecondsInDay = 1000 * 60 * 60 * 24;
    let d1ToDiff = new Date(this.toDateString());
    let d2ToDiff = new Date(date.toDateString());

    return (d1ToDiff - d2ToDiff) / millisecondsInDay;
};

Date.prototype.addDays = function (days) {
    let newDate = new Date(this);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
};