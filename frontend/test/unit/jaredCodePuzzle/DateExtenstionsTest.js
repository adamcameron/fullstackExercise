let chai = require("chai");
chai.use(require("chai-datetime"));
let should = chai.should();

require("./DateExtensions.js");

describe("Tests for Date methods functions", function () {
    describe("Tests Date.getLastDayOfMonth method", function () {
        let testCases = [
            {it:"returns Jan 31, given Jan 1", testDate: new Date("2021-01-01"), expectedEndOfMonth:new Date("2021-01-31")},
            {it:"returns Jan 31, given Jan 31", testDate: new Date("2021-01-31"), expectedEndOfMonth:new Date("2021-01-31")},
            {it:"returns Feb 28, given Feb 1 in 2021", testDate: new Date("2021-02-01"), expectedEndOfMonth:new Date("2021-02-28")},
            {it:"returns Feb 29, given Feb 1 in 2020", testDate: new Date("2020-02-01"), expectedEndOfMonth:new Date("2020-02-29")},
            {it:"returns Dec 31, given Dec 1", testDate: new Date("2020-12-01"), expectedEndOfMonth:new Date("2020-12-31")},
            {it:"returns Dec 31, given Dec 31", testDate: new Date("2020-12-31"), expectedEndOfMonth:new Date("2020-12-31")}
        ];
        testCases.forEach(function (testCase) {
            it (testCase.it, function(){
                let endOfMonth = testCase.testDate.getLastDayOfMonth();

                endOfMonth.should.equalDate(testCase.expectedEndOfMonth);
            });
        });
    });

    describe("Tests Date.compare method", function () {
        let testCases = [
            {it:"returns -1 if d1 is before d2", d1: new Date("2021-01-15"), d2:new Date("2021-01-16"), expectedResult: -1},
            {it:"returns 1 if d1 is after d2", d1: new Date("2021-01-15"), d2:new Date("2021-01-14"), expectedResult: 1},
            {it:"returns 0 if d1 is the same d2", d1: new Date("2021-01-15"), d2:new Date("2021-01-15"), expectedResult: 0},
            {it:"returns 0 if d1 is the same d2 except for the time part", d1: new Date("2021-01-15 00:00:00.0"), d2:new Date("2021-01-15 00:00:00.1"), expectedResult: 0}
        ];
        testCases.forEach(function (testCase) {
            it (testCase.it, function(){
                let comparison = testCase.d1.compare(testCase.d2);

                comparison.should.equal(testCase.expectedResult);
            });
        });
    });

    describe("Tests Date.daysBetween method", function () {
        let testCases = [
            {it:"returns -1 if d1 is the day before d2", d1: new Date("2021-01-15"), d2:new Date("2021-01-16"), expectedResult: -1},
            {it:"returns 1 if d1 is the day after d2", d1: new Date("2021-01-15"), d2:new Date("2021-01-14"), expectedResult: 1},
            {it:"returns 0 if d1 is the same day as d2", d1: new Date("2021-01-15"), d2:new Date("2021-01-15"), expectedResult: 0},
            {it:"returns 0 if d1 is the same day as d2 except for the time part", d1: new Date("2021-01-15 00:00:00.0"), d2:new Date("2021-01-15 00:00:00.1"), expectedResult: 0}
        ];
        testCases.forEach(function (testCase) {
            it (testCase.it, function(){
                let diffInDays = testCase.d1.daysBetween(testCase.d2);

                diffInDays.should.equal(testCase.expectedResult);
            });
        });
    });

    describe("Tests for addDays method", function () {
        let testCases = [
            {
                it: "works within a month",
                date: new Date("2021-01-15"),
                days: 5,
                expectedResult: new Date("2021-01-20")
            },
            {
                it: "works across the end of a month",
                date: new Date("2021-01-15"),
                days: 25,
                expectedResult: new Date("2021-02-09")
            },
            {
                it: "works across the end of the year",
                date: new Date("2021-12-15"),
                days: 25,
                expectedResult: new Date("2022-01-09")
            },
            {
                it: "works with zero",
                date: new Date("2021-12-15"),
                days: 0,
                expectedResult: new Date("2021-12-15")
            },
            {
                it: "works with negative numbers",
                date: new Date("2021-12-15"),
                days: -5,
                expectedResult: new Date("2021-12-10")
            },
        ];
        testCases.forEach(function (testCase) {
            it (testCase.it, function(){
                let adjustedDate = testCase.date.addDays(testCase.days);

                adjustedDate.should.equalDate(testCase.expectedResult);
            });
        });
    });
});
