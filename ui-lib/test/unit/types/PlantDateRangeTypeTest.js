sap.ui.define([
    "sap/dm/dme/types/PlantDateRangeType",
    "sap/dm/dme/util/PlantSettings"
], function (PlantDateRangeType, PlantSettings) {
    "use strict";

    var sandbox = sinon.createSandbox();
    QUnit.module("PlantDateRangeType", function (hooks) {
        hooks.beforeEach(function () {
            this.PlantDateRangeType = new PlantDateRangeType();
        });

        hooks.afterEach(function () {
            this.PlantDateRangeType.destroy();
            sandbox.restore();
        });

        QUnit.test("Test formatValue function of PlantDateRangeType - Locale - EN", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('en');
            PlantSettings.setTimeZone("US/Central");
            assert.equal(this.PlantDateRangeType.formatValue(["",""]), "", 'result: ""');
            assert.equal(this.PlantDateRangeType.formatValue(["2020-10-23T05:13:45Z","2020-10-31T05:13:45Z"]), "Oct 23, 2020 – Oct 31, 2020", 'result: "Oct 23, 2020 – Oct 31, 2020"');
            assert.equal(this.PlantDateRangeType.formatValue(["2020-10-23T05:00:00.000Z","2020-10-24T04:59:59.000Z"]), "Oct 23, 2020", 'result: "Oct 23, 2020"');
            assert.equal(this.PlantDateRangeType.formatValue(["2020-10-23T05:13:45Z",undefined]), "", 'result: ""');
            assert.equal(this.PlantDateRangeType.formatValue([undefined,undefined]), "", 'result: ""');
            PlantSettings.setTimeZone("Europe/Berlin");
            assert.equal(this.PlantDateRangeType.formatValue(["2020-10-23T05:13:45Z","2020-10-27T23:13:45Z"]), "Oct 23, 2020 – Oct 28, 2020", 'result: "Oct 23, 2020 – Oct 28, 2020"');
            assert.equal(this.PlantDateRangeType.formatValue(["2021-11-07T23:00:00.000Z","2021-11-08T22:59:59.000Z"]), "Nov 8, 2021", 'result: "Nov 8, 2021"');
        });

        QUnit.test("Test formatValue function of PlantDateRangeType - Locale - DE", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('de');
            PlantSettings.setTimeZone("US/Central");
            assert.equal(this.PlantDateRangeType.formatValue(["",""]), "", 'result: ""');
            assert.equal(this.PlantDateRangeType.formatValue(["2020-10-23T05:13:45Z","2020-10-31T05:13:45Z"]), "23.10.2020 – 31.10.2020", 'result: "23.10.2020 – 31.10.2020"');
            assert.equal(this.PlantDateRangeType.formatValue(["2020-10-23T05:00:00.000Z","2020-10-24T04:59:59.000Z"]), "23.10.2020", 'result: "23.10.2020"');
            assert.equal(this.PlantDateRangeType.formatValue(["2020-10-23T05:13:45Z",undefined]), "", 'result: ""');
            assert.equal(this.PlantDateRangeType.formatValue([undefined,undefined]), "", 'result: ""');
            PlantSettings.setTimeZone("Europe/Berlin");
            assert.equal(this.PlantDateRangeType.formatValue(["2020-10-23T05:13:45Z","2020-10-27T23:13:45Z"]), "23.10.2020 – 28.10.2020", 'result: "23.10.2020 – 28.10.2020"');
            assert.equal(this.PlantDateRangeType.formatValue(["2021-11-07T23:00:00.000Z","2021-11-08T22:59:59.000Z"]), "08.11.2021", 'result: "08.11.2021"');
        });

        QUnit.test("Test parseValue function of PlantDateRangeType", function (assert) {
            PlantSettings.setTimeZone("US/Central");
            assert.deepEqual(this.PlantDateRangeType.parseValue("","string",["previousValueInField","previousValueInField"]), ['',''], "result:  ['','']");
            assert.deepEqual(this.PlantDateRangeType.parseValue("Oct 23, 2020 - Oct 28, 2020","string",["previousValueInField",""]), ['2020-10-23T05:00:00.000Z','2020-10-29T04:59:59.000Z'], "result:  ['2020-10-23T05:00:00.000Z','2020-10-29T04:59:59.000Z']");
            assert.deepEqual(this.PlantDateRangeType.parseValue("Oct 23, 2020 - Oct 23, 2020","string",["previousValueInField",""]), ['2020-10-23T05:00:00.000Z','2020-10-24T04:59:59.000Z'], "result:  ['2020-10-23T05:00:00.000Z','2020-10-24T04:59:59.000Z']");
            assert.deepEqual(this.PlantDateRangeType.parseValue("08.11.2021 - 23.11.2021","string",["previousValueInField",""]), ['2021-11-08T06:00:00.000Z','2021-11-24T05:59:59.000Z'], "result:  ['2021-11-08T06:00:00.000Z','2021-11-24T05:59:59.000Z']");
            PlantSettings.setTimeZone("Europe/Berlin");
            assert.deepEqual(this.PlantDateRangeType.parseValue("Oct 23, 2020 - Oct 28, 2020","string",["previousValueInField",""]), ['2020-10-22T22:00:00.000Z','2020-10-28T22:59:59.000Z'], "result:  ['2020-10-22T22:00:00.000Z','2020-10-28T22:59:59.000Z']");
            assert.deepEqual(this.PlantDateRangeType.parseValue("08.11.2021 - 23.11.2021","string",["previousValueInField",""]), ['2021-11-07T23:00:00.000Z','2021-11-23T22:59:59.000Z'], "result:  ['2021-11-07T23:00:00.000Z','2021-11-23T22:59:59.000Z']");
            assert.deepEqual(this.PlantDateRangeType.parseValue("08.11.2021 - 08.11.2021","string",["previousValueInField",""]), ['2021-11-07T23:00:00.000Z','2021-11-08T22:59:59.000Z'], "result:  ['2021-11-07T23:00:00.000Z','2021-11-08T22:59:59.000Z']");
            PlantSettings.setTimeZone("Europe/Amsterdam");
            assert.deepEqual(this.PlantDateRangeType.parseValue("Oct 23, 2020 - Oct 28, 2020","string",["previousValueInField",""]), ['2020-10-22T22:00:00.000Z','2020-10-28T22:59:59.000Z'], "result:  ['2020-10-22T22:00:00.000Z','2020-10-28T22:59:59.000Z']");
            assert.deepEqual(this.PlantDateRangeType.parseValue("08.11.2021 - 23.11.2021","string",["previousValueInField",""]), ['2021-11-07T23:00:00.000Z','2021-11-23T22:59:59.000Z'], "result:  ['2021-11-07T23:00:00.000Z','2021-11-23T22:59:59.000Z']");
            assert.deepEqual(this.PlantDateRangeType.parseValue("08.11.2021","string",["previousValueInField",""]), ['2021-11-07T23:00:00.000Z','2021-11-08T22:59:59.000Z'], "result:  ['2021-11-07T23:00:00.000Z','2021-11-08T22:59:59.000Z']");
            assert.throws(
                function () {
                  this.PlantDateRangeType.parseValue("Oct 23, 2020 - 1bc","string",["previousValueInField",""]);
                },
                {
                  message: "'Oct 23, 2020 - 1bc' - Invalid Date",
                  name: "ParseException",
                },
                "Error thrown"
            );
            assert.throws(
                function () {
                  this.PlantDateRangeType.parseValue("abc - 1bc","string",["previousValueInField",""]);
                },
                {
                  message: "'abc - 1bc' - Invalid Date",
                  name: "ParseException",
                },
                "Error thrown"
            );
        });

        QUnit.test("Test validateValue function of PlantDateRangeType", function (assert) {
            var result = true;
            assert.equal(this.PlantDateRangeType.validateValue(), result, 'result: true');
        });
    });
});
