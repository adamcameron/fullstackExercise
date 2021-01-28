let chai = require("chai");
chai.use(require("chai-datetime"));
let should = chai.should();

require("./DateExtensions.js");

let Reading = require("./Reading.js");

describe("Tests a method Reading.getEstimatesFromReadingsArray that returns an array of Readings representing month-end estimates for the input range of customer readings", function () {
    describe("Tests for validation cases", function() {
        it("should throw a RangeError if the readings array does not have at least two entries", function (){
            let readings = [
                new Reading(100, "2021-04-25")
            ];
            (function() {Reading.getEstimatesFromReadingsArray(readings)}).should.throw(RangeError);
        });

        it("should not throw a RangeError if the readings array has at least two entries", function (){
            let readings = [
                new Reading(100, "2021-04-25"),
                new Reading(200, "2021-05-05")
            ];
            (function() {Reading.getEstimatesFromReadingsArray(readings)}).should.not.throw(RangeError);
        });

        it("should throw a RangeError if the second date is not after the first date", function (){
            let readings = [
                new Reading(200, "2021-05-05"),
                new Reading(100, "2021-04-25")
            ];
            (function() {Reading.getEstimatesFromReadingsArray(readings)}).should.throw(RangeError);
        });
    });

    describe("Tests for returned estimation array cases", function () {
        it("should not include a final month-end reading in the estimates", function () {
            let readings = [
                new Reading(100, "2021-04-25"),
                new Reading(460, "2021-05-31")
            ];
            let expectedEstimates = [
                new Reading(150, "2021-04-30")
            ];

            let actualEstimates = Reading.getEstimatesFromReadingsArray(readings);

            actualEstimates.should.eql(expectedEstimates);
        });

        it("should return the estimate between two monthly readings", function (){
            let readings = [
                new Reading(100, "2021-04-25"),
                new Reading(200, "2021-05-05")
            ];
            let expectedEstimates = [
                new Reading(150, "2021-04-30")
            ];

            let actualEstimates = Reading.getEstimatesFromReadingsArray(readings);

            actualEstimates.should.eql(expectedEstimates);
        });

        it("should return three estimates between two reading dates with three missing estimates", function (){
            let readings = [
                new Reading(100, "2021-04-25"),
                new Reading(800, "2021-07-04")
            ];
            let expectedEstimates = [
                new Reading(150, "2021-04-30"),
                new Reading(460, "2021-05-31"),
                new Reading(760, "2021-06-30")
            ];

            let actualEstimates = Reading.getEstimatesFromReadingsArray(readings);

            actualEstimates.should.eql(expectedEstimates);
        });

        it("should return the integer part of the estimated reading", function () {
            let readings = [
                new Reading(100, "2021-04-25"),
                new Reading(300, "2021-05-25")
            ];
            let expectedEstimates = [
                new Reading(Math.floor(133.3333333), "2021-04-30")
            ];

            let actualEstimates = Reading.getEstimatesFromReadingsArray(readings);

            actualEstimates.should.eql(expectedEstimates);
        });

        it("should return all estimates between each pair of reading dates, for multiple reading dates", function () {
            let readings = [
                new Reading(100, "2021-04-25"),
                new Reading(500, "2021-07-04"),
                new Reading(1000, "2021-08-13"),
                new Reading(2000, "2022-01-22"),
                new Reading(2200, "2022-01-31")
            ];
            let expectedEstimates = [
                new Reading(128, "2021-04-30"),
                new Reading(305, "2021-05-31"),
                new Reading(477, "2021-06-30"),
                new Reading(837, "2021-07-31"),
                new Reading(1111, "2021-08-31"),
                new Reading(1296, "2021-09-30"),
                new Reading(1487, "2021-10-31"),
                new Reading(1672, "2021-11-30"),
                new Reading(1864, "2021-12-31")
            ];

            let actualEstimates = Reading.getEstimatesFromReadingsArray(readings);

            actualEstimates.should.eql(expectedEstimates);
        });

        it("should not return an estimate if there was an actual reading on that day", function () {
            let readings = [
                new Reading(100, "2021-04-25"),
                new Reading(500, "2021-07-31"),
                new Reading(1000, "2021-08-13")
            ];
            let expectedEstimates = [
                new Reading(120, "2021-04-30"),
                new Reading(248, "2021-05-31"),
                new Reading(372, "2021-06-30")
            ];

            let actualEstimates = Reading.getEstimatesFromReadingsArray(readings);

            actualEstimates.should.eql(expectedEstimates);
        });

        it("should return an empty array if all readings are on the last day of the month", function () {
            let readings = [
                new Reading(100, "2021-04-30"),
                new Reading(500, "2021-05-31"),
                new Reading(1000, "2021-06-30"),
                new Reading(2000, "2021-07-31"),
                new Reading(2200, "2021-08-31")
            ];
            let expectedEstimates = [];

            let actualEstimates = Reading.getEstimatesFromReadingsArray(readings);

            actualEstimates.should.eql(expectedEstimates);
        });

        it("tests a potential off-by-one scenario when the reading is the day before the end of the month", function () {
            let readings = [
                new Reading(100, "2021-04-29"),
                new Reading(120, "2021-05-01")
            ];
            let expectedEstimates = [new Reading(110, "2021-04-30")];

            let actualEstimates = Reading.getEstimatesFromReadingsArray(readings);

            actualEstimates.should.eql(expectedEstimates);
        });
    });
});

describe("Tests for helper functions", function () {
    describe("Tests for Reading.getEstimationDatesBetweenDates method", function () {
        let testCases = [
            {
                it: "returns nothing when there are no estimates dates between the test dates",
                d1: new Date("2021-01-15"),
                d2: new Date("2021-01-30"),
                expectedResult: []
            },
            {
                it: "correctly omits the first date if it is an estimation date",
                d1: new Date("2021-01-31"),
                d2: new Date("2021-02-15"),
                expectedResult: []
            },
            {
                it: "correctly omits the second date if it is an estimation date",
                d1: new Date("2021-01-15"),
                d2: new Date("2021-01-31"),
                expectedResult: []
            },
            {
                it: "correctly returns the last date of the month for all months between the dates",
                d1: new Date("2021-01-01"),
                d2: new Date("2021-04-29"),
                expectedResult: [new Date("2021-01-31"), new Date("2021-02-28"), new Date("2021-03-31")]
            }
        ];
        testCases.forEach(function (testCase) {
            it(testCase.it, function(){
                let estimationDates = Reading.getEstimationDatesBetweenDates(testCase.d1, testCase.d2);

                estimationDates.should.eql(testCase.expectedResult);
            });
        });
    });
});
