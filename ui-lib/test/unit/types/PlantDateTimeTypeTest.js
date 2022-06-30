sap.ui.define([
    "sap/dm/dme/types/PlantDateTimeType",
    "sap/dm/dme/util/PlantSettings"
], function (PlantDateTimeType, PlantSettings) {
    "use strict";

    var sandbox = sinon.createSandbox();
    QUnit.module("PlantDateTime Type", function (hooks) {
        hooks.beforeEach(function () {
            this.PlantDateTimeType = new PlantDateTimeType();
        });

        hooks.afterEach(function () {
            this.PlantDateTimeType.destroy();
            sandbox.restore();
        });

        QUnit.test("Test formatValue function of PlantDateTimeType - Locale - EN", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('en');
            PlantSettings.setTimeZone("US/Central");
            assert.equal(this.PlantDateTimeType.formatValue(""), "", 'result: ""');
            assert.equal(this.PlantDateTimeType.formatValue("2020-10-23T05:13:45Z"), "Oct 23, 2020, 12:13:45 AM", 'result: "Oct 23, 2020, 12:13:45 AM"');
            PlantSettings.setTimeZone("Europe/Berlin");
            assert.equal(this.PlantDateTimeType.formatValue("2020-10-23T05:13:45Z"), "Oct 23, 2020, 7:13:45 AM", 'result: "Oct 23, 2020, 7:13:45 AM"');
            //Input is in ISO
            assert.equal(this.PlantDateTimeType.formatValue("2020-10-23T05:13:45.000Z"), "Oct 23, 2020, 7:13:45 AM", 'result: "Oct 23, 2020, 7:13:45 AM"');
        });

        QUnit.test("Test formatValue function of PlantDateTimeType - Locale - DE", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('de');
            PlantSettings.setTimeZone("US/Central");
            assert.equal(this.PlantDateTimeType.formatValue(""), "", 'result: ""');
            assert.equal(this.PlantDateTimeType.formatValue("2020-10-23T05:13:45Z"), "23.10.2020, 00:13:45", 'result: "23.10.2020, 00:13:45"');
            PlantSettings.setTimeZone("Europe/Berlin");
            assert.equal(this.PlantDateTimeType.formatValue("2020-10-23T05:13:45Z"), "23.10.2020, 07:13:45", 'result: "23.10.2020, 07:13:45"');
            //Input is in ISO
            assert.equal(this.PlantDateTimeType.formatValue("2020-10-23T05:13:45.000Z"), "23.10.2020, 07:13:45", 'result: "23.10.2020, 07:13:45"');
        });

        QUnit.test("Test parseValue function of PlantDateTimeType", function (assert) {
            PlantSettings.setTimeZone("US/Central");
            assert.equal(this.PlantDateTimeType.parseValue("","string"), "", 'result: ""');
            assert.equal(this.PlantDateTimeType.parseValue("2021-10-28T14:08:35","string"), "2021-10-28T19:08:35.000Z", 'result: "2021-10-28T19:08:35.000Z"');
            PlantSettings.setTimeZone("Europe/Berlin");
            assert.equal(this.PlantDateTimeType.parseValue("2021-10-28T14:08:35","string"), "2021-10-28T12:08:35.000Z", 'result: "2021-10-28T12:08:35.000Z"');
            PlantSettings.setTimeZone("US/Central");
            assert.equal(this.PlantDateTimeType.parseValue("2021-11-01T10:53:47","string"), "2021-11-01T15:53:47.000Z", 'result: "2021-11-01T15:53:47.000Z"');
            PlantSettings.setTimeZone("Europe/Amsterdam");
            assert.equal(this.PlantDateTimeType.parseValue("2021-11-04T16:53:47","string"), "2021-11-04T15:53:47.000Z", 'result: "2021-11-04T15:53:47.000Z"');

            assert.throws(
                function () {
                  this.PlantDateTimeType.parseValue("abc","string");
                },
                {
                  message: "'abc' - Invalid Date",
                  name: "ParseException",
                },
                "Error thrown"
            );
        });

        QUnit.test("Test formatValue and parseValue of PlantDateTimeType in CYCLE- Locale - EN", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('en');
            PlantSettings.setTimeZone("Europe/Berlin");
            //Initial input from API in UTC, output is formatted
            assert.equal(this.PlantDateTimeType.formatValue("2020-10-23T05:13:45Z"), "Oct 23, 2020, 7:13:45 AM", 'result: "Oct 23, 2020, 7:13:45 AM"');
            //User modified date in datetime picker passed as JS Date obj: Oct 28, 2021, 2:08:35 PM, output is UTC
            assert.equal(this.PlantDateTimeType.parseValue("2021-10-28T14:08:35","string"), "2021-10-28T12:08:35.000Z", 'result: "2021-10-28T12:08:35.000Z"');
            //Above UTC as input, output is formatter value
            assert.equal(this.PlantDateTimeType.formatValue("2021-10-28T12:08:35.000Z"), "Oct 28, 2021, 2:08:35 PM", 'result: "Oct 28, 2021, 2:08:35 PM"');
        });

        QUnit.test("Test formatValue and parseValue of PlantDateTimeType in CYCLE- Locale - DE", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('de');
            PlantSettings.setTimeZone("Europe/Berlin");
            //Initial input from API in UTC, output is formatted
            assert.equal(this.PlantDateTimeType.formatValue("2020-10-23T05:13:45Z"), "23.10.2020, 07:13:45", 'result: "23.10.2020, 07:13:45"');
            //User modified date in datetime picker passed as JS Date obj: 28.10.2021, 14:08:35, output is UTC
            assert.equal(this.PlantDateTimeType.parseValue("2021-10-28T14:08:35","string"), "2021-10-28T12:08:35.000Z", 'result: "2021-10-28T12:08:35.000Z"');
            //Above UTC as input, output is formatter value
            assert.equal(this.PlantDateTimeType.formatValue("2021-10-28T12:08:35.000Z"), "28.10.2021, 14:08:35", 'result: "28.10.2021, 14:08:35"');
        });
    });
});