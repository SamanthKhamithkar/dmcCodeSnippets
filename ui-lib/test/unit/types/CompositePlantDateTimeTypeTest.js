sap.ui.define([
    "sap/dm/dme/types/CompositePlantDateTimeType",
    "sap/dm/dme/util/PlantSettings"
], function (CompositePlantDateTimeType, PlantSettings) {
    "use strict";

    var sandbox = sinon.createSandbox();
    QUnit.module("CompositePlantDateTime Type", function (hooks) {
        hooks.beforeEach(function () {
            this.CompositePlantDateTimeType = new CompositePlantDateTimeType();
        });

        hooks.afterEach(function () {
            this.CompositePlantDateTimeType.destroy();
            sandbox.restore();
        });

        QUnit.test("Test formatValue function of CompositePlantDateTimeType - Locale - EN", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('en');
            PlantSettings.setTimeZone("US/Central");
            assert.equal(this.CompositePlantDateTimeType.formatValue(["",""]), "", 'result: ""');
            assert.equal(this.CompositePlantDateTimeType.formatValue(["2020-10-23T05:13:45Z",""]), "Oct 23, 2020, 12:13:45 AM", 'result: "Oct 23, 2020, 12:13:45 AM"');
            assert.equal(this.CompositePlantDateTimeType.formatValue(["2020-10-23T05:13:45Z",undefined]), "Oct 23, 2020, 12:13:45 AM", 'result: "Oct 23, 2020, 12:13:45 AM"');
            assert.equal(this.CompositePlantDateTimeType.formatValue([undefined,undefined]), "", 'result: ""');
            assert.equal(this.CompositePlantDateTimeType.formatValue(["2020-10-23T05:13:45Z","medium/short"]), "Oct 23, 2020, 12:13 AM", 'result: "Oct 23, 2020, 12:13 AM"');
            PlantSettings.setTimeZone("Europe/Berlin");
            assert.equal(this.CompositePlantDateTimeType.formatValue(["2020-10-23T05:13:45Z",""]), "Oct 23, 2020, 7:13:45 AM", 'result: "Oct 23, 2020, 7:13:45 AM"');
            assert.equal(this.CompositePlantDateTimeType.formatValue(["2020-10-23T05:13:45Z","medium/short"]), "Oct 23, 2020, 7:13 AM", 'result: "Oct 23, 2020, 7:13 AM"');
            //Input is in ISO
            assert.equal(this.CompositePlantDateTimeType.formatValue(["2020-10-23T05:13:45.000Z","medium/short"]), "Oct 23, 2020, 7:13 AM", 'result: "Oct 23, 2020, 7:13 AM"');
        });

        QUnit.test("Test formatValue function of CompositePlantDateTimeType - Locale - DE", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('de');
            PlantSettings.setTimeZone("US/Central");
            assert.equal(this.CompositePlantDateTimeType.formatValue(["",""]), "", 'result: ""');
            assert.equal(this.CompositePlantDateTimeType.formatValue(["2020-10-23T05:13:45Z",""]), "23.10.2020, 00:13:45", 'result: "23.10.2020, 00:13:45"');
            assert.equal(this.CompositePlantDateTimeType.formatValue(["2020-10-23T05:13:45Z",undefined]), "23.10.2020, 00:13:45", 'result: "23.10.2020, 00:13:45"');
            assert.equal(this.CompositePlantDateTimeType.formatValue([undefined,undefined]), "", 'result: ""');
            assert.equal(this.CompositePlantDateTimeType.formatValue(["2020-10-23T05:13:45Z","medium/short"]), "23.10.2020, 00:13", 'result: "23.10.2020, 00:13"');
            PlantSettings.setTimeZone("Europe/Berlin");
            assert.equal(this.CompositePlantDateTimeType.formatValue(["2020-10-23T05:13:45Z",""]), "23.10.2020, 07:13:45", 'result: "23.10.2020, 07:13:45"');
            assert.equal(this.CompositePlantDateTimeType.formatValue(["2020-10-23T05:13:45Z","medium/short"]), "23.10.2020, 07:13", 'result: "23.10.2020, 07:13"');
            //Input is in ISO
            assert.equal(this.CompositePlantDateTimeType.formatValue(["2020-10-23T05:13:45.000Z","medium/short"]), "23.10.2020, 07:13", 'result: "23.10.2020, 07:13"');
        });

        QUnit.test("Test parseValue function of CompositePlantDateTimeType", function (assert) {
            PlantSettings.setTimeZone("US/Central");
            assert.deepEqual(this.CompositePlantDateTimeType.parseValue("","string",["previousValueInField",""]), ['',''], "result:  ['','']");
            assert.deepEqual(this.CompositePlantDateTimeType.parseValue("2021-10-28T14:08:35","string",["previousValueInField",""]), ['2021-10-28T19:08:35.000Z',''], "result:  ['2021-10-28T19:08:35.000Z','']");
            assert.deepEqual(this.CompositePlantDateTimeType.parseValue("2021-10-28T14:08:35","string",["previousValueInField","medium/short"]), ['2021-10-28T19:08:35.000Z','medium/short'], "result:  ['2021-10-28T19:08:35.000Z','medium/short']");
            PlantSettings.setTimeZone("Europe/Berlin");
            assert.deepEqual(this.CompositePlantDateTimeType.parseValue("2021-10-28T14:08:35","string",["previousValueInField",""]), ['2021-10-28T12:08:35.000Z',''], "result:  ['2021-10-28T12:08:35.000Z','']");
            assert.deepEqual(this.CompositePlantDateTimeType.parseValue("2021-10-28T14:08:35","string",["previousValueInField","medium/short"]), ['2021-10-28T12:08:35.000Z','medium/short'], "result:  ['2021-10-28T12:08:35.000Z','medium/short']");
            PlantSettings.setTimeZone("Europe/Amsterdam");
            assert.deepEqual(this.CompositePlantDateTimeType.parseValue("2021-11-04T16:53:47","string",["previousValueInField",""]), ['2021-11-04T15:53:47.000Z',''], "result:  ['2021-11-04T15:53:47.000Z','']");
            assert.deepEqual(this.CompositePlantDateTimeType.parseValue("2021-11-04T16:53:47","string",["previousValueInField","medium/short"]), ['2021-11-04T15:53:47.000Z','medium/short'], "result:  ['2021-11-04T15:53:47.000Z','medium/short']");
            assert.throws(
                function () {
                  this.CompositePlantDateTimeType.parseValue("abc","string",["previousValueInField","medium/short"]);
                },
                {
                  message: "'abc' - Invalid Date",
                  name: "ParseException",
                },
                "Error thrown"
            );
        });

        QUnit.test("Test formatValue and parseValue of CompositePlantDateTimeType in CYCLE- Locale - EN", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('en');
            PlantSettings.setTimeZone("Europe/Berlin");
            //Initial input from API in UTC, output is formatted
            assert.equal(this.CompositePlantDateTimeType.formatValue(["2020-10-23T05:13:45Z","medium/short"]), "Oct 23, 2020, 7:13 AM", 'result: "Oct 23, 2020, 7:13 AM"');
            //User modified date in datetime picker passed as JS Date obj: Oct 28, 2021, 2:08 PM, output is UTC
            assert.deepEqual(this.CompositePlantDateTimeType.parseValue("2021-10-28T14:08:00","string",["previousValueInField","medium/short"]), ['2021-10-28T12:08:00.000Z','medium/short'], "result:  ['2021-10-28T12:08:00.000Z','medium/short']");
            //Above UTC as input, output is formatter value
            assert.equal(this.CompositePlantDateTimeType.formatValue(["2021-10-28T12:08:00.000Z","medium/short"]), "Oct 28, 2021, 2:08 PM", 'result: "Oct 28, 2021, 2:08 PM"');
        });

        QUnit.test("Test formatValue and parseValue of CompositePlantDateTimeType in CYCLE- Locale - DE", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('de');
            PlantSettings.setTimeZone("Europe/Berlin");
            //Initial input from API in UTC, output is formatted
            assert.equal(this.CompositePlantDateTimeType.formatValue(["2020-10-23T05:13:45Z","medium/short"]), "23.10.2020, 07:13", 'result: "23.10.2020, 07:13"');
            //User modified date in datetime picker passed as JS Date obj: 28.10.2021, 14:08, output is UTC
            assert.deepEqual(this.CompositePlantDateTimeType.parseValue("2021-10-28T14:08:00","string",["previousValueInField","medium/short"]), ['2021-10-28T12:08:00.000Z','medium/short'], "result:  ['2021-10-28T12:08:00.000Z','medium/short']");
            //Above UTC as input, output is formatter value
            assert.equal(this.CompositePlantDateTimeType.formatValue(["2021-10-28T12:08:00.000Z","medium/short"]), "28.10.2021, 14:08", 'result: "28.10.2021, 14:08"');
        });
    });
});