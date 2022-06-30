sap.ui.define([
    "sap/dm/dme/types/PlantDateType",
    "sap/dm/dme/util/PlantSettings"
], function (PlantDateType, PlantSettings) {
    "use strict";

    var sandbox = sinon.createSandbox();
    QUnit.module("PlantDate Type", function (hooks) {
        hooks.beforeEach(function () {
            this.PlantDateType = new PlantDateType();
        });

        hooks.afterEach(function () {
            this.PlantDateType.destroy();
            sandbox.restore();
        });

        QUnit.test("Test formatValue function of PlantDateType - Locale - EN", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('en');
            PlantSettings.setTimeZone("US/Central");
            assert.equal(this.PlantDateType.formatValue(""), "", 'result: ""');
            assert.equal(this.PlantDateType.formatValue("2020-10-23T05:13:45Z"), "Oct 23, 2020", 'result: "Oct 23, 2020"');
            assert.equal(this.PlantDateType.formatValue("2021-10-28T05:00:00Z"), "Oct 28, 2021", 'result: "Oct 28, 2021"');
            PlantSettings.setTimeZone("Europe/Berlin");
            assert.equal(this.PlantDateType.formatValue("2020-10-23T23:13:45Z"), "Oct 24, 2020", 'result: "Oct 24, 2020"');
            assert.equal(this.PlantDateType.formatValue("2021-10-27T22:00:00Z"), "Oct 28, 2021", 'result: "Oct 28, 2021"');
            //Input is in ISO
            assert.equal(this.PlantDateType.formatValue("2020-10-23T23:13:45.000Z"), "Oct 24, 2020", 'result: "Oct 24, 2020"');
        });

        QUnit.test("Test formatValue function of PlantDateType - Locale - DE", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('de');
            PlantSettings.setTimeZone("US/Central");
            assert.equal(this.PlantDateType.formatValue(""), "", 'result: ""');
            assert.equal(this.PlantDateType.formatValue("2020-10-23T05:13:45Z"), "23.10.2020", 'result: "23.10.2020"');
            assert.equal(this.PlantDateType.formatValue("2021-10-28T05:00:00Z"), "28.10.2021", 'result: "28.10.2021"');
            PlantSettings.setTimeZone("Europe/Berlin");
            assert.equal(this.PlantDateType.formatValue("2020-10-23T23:13:45Z"), "24.10.2020", 'result: "24.10.2020"');
            assert.equal(this.PlantDateType.formatValue("2021-10-27T22:00:00Z"), "28.10.2021", 'result: "28.10.2021"');
            //Input is in ISO
            assert.equal(this.PlantDateType.formatValue("2020-10-23T23:13:45.000Z"), "24.10.2020", 'result: "24.10.2020"');
        });

        QUnit.test("Test parseValue function of PlantDateType", function (assert) {
            PlantSettings.setTimeZone("US/Central");
            assert.equal(this.PlantDateType.parseValue("","string"), "", 'result: ""');
            assert.equal(this.PlantDateType.parseValue("2021-10-28T14:08:35","string"), "2021-10-28T19:08:35.000Z", 'result: "2021-10-28T19:08:35.000Z"');
            assert.equal(this.PlantDateType.parseValue("2021-10-28T00:00:00","string"), "2021-10-28T05:00:00.000Z", 'result: "2021-10-28T05:00:00.000Z"');
            PlantSettings.setTimeZone("Europe/Berlin");
            assert.equal(this.PlantDateType.parseValue("2021-10-28T14:08:35","string"), "2021-10-28T12:08:35.000Z", 'result: "2021-10-28T12:08:35.000Z"');
            assert.equal(this.PlantDateType.parseValue("2021-10-28T00:00:00","string"), "2021-10-27T22:00:00.000Z", 'result: "2021-10-27T22:00:00.000Z"');
            PlantSettings.setTimeZone("US/Central");
            assert.equal(this.PlantDateType.parseValue("2021-11-01T10:53:47","string"), "2021-11-01T15:53:47.000Z", 'result: "2021-11-01T15:53:47.000Z"');
            PlantSettings.setTimeZone("Europe/Amsterdam");
            assert.equal(this.PlantDateType.parseValue("2021-11-04T16:53:47","string"), "2021-11-04T15:53:47.000Z", 'result: "2021-11-04T15:53:47.000Z"');
            assert.throws(
                function () {
                  this.PlantDateType.parseValue("abc","string");
                },
                {
                  message: "'abc' - Invalid Date",
                  name: "ParseException",
                },
                "Error thrown"
            );
        });

        QUnit.test("Test formatValue and parseValue of PlantDateType in CYCLE- Locale - EN", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('en');
            PlantSettings.setTimeZone("Europe/Berlin");
            //Initial input from API in UTC, output is formatted
            assert.equal(this.PlantDateType.formatValue("2020-10-23T05:13:45Z"), "Oct 23, 2020", 'result: "Oct 23, 2020"');
            //User modified date in date picker passed as JS Date obj: Oct 28, 2021, output is UTC
            assert.equal(this.PlantDateType.parseValue("2021-10-28T00:00:00","string"), "2021-10-27T22:00:00.000Z", 'result: "2021-10-27T22:00:00.000Z"');
            //Above UTC as input, output is formatter value
            assert.equal(this.PlantDateType.formatValue("2021-10-27T22:00:00.000Z"), "Oct 28, 2021", 'result: "Oct 28, 2021"');
        });

        QUnit.test("Test formatValue and parseValue of PlantDateType in CYCLE- Locale - DE", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('de');
            PlantSettings.setTimeZone("Europe/Berlin");
            //Initial input from API in UTC, output is formatted
            assert.equal(this.PlantDateType.formatValue("2020-10-23T05:13:45Z"), "23.10.2020", 'result: "23.10.2020"');
            //User modified date in date picker passed as JS Date obj: 28.10.2021 output is UTC
            assert.equal(this.PlantDateType.parseValue("2021-10-28T00:00:00","string"), "2021-10-27T22:00:00.000Z", 'result: "2021-10-27T22:00:00.000Z"');
            //Above UTC as input, output is formatter value
            assert.equal(this.PlantDateType.formatValue("2021-10-27T22:00:00.000Z"), "28.10.2021", 'result: "28.10.2021"');
        });
    });
});