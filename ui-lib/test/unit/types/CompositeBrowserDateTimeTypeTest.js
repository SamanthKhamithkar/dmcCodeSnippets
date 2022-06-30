sap.ui.define([
    "sap/dm/dme/types/CompositeBrowserDateTimeType"
], function (CompositeBrowserDateTimeType) {
    "use strict";

    var sandbox = sinon.createSandbox();
    const momentProto = moment.tz;
    QUnit.module("CompositeBrowserDateTime Type", function (hooks) {
        hooks.beforeEach(function () {
            this.CompositeBrowserDateTimeType = new CompositeBrowserDateTimeType();
            sandbox.stub(momentProto,"guess");
            momentProto.guess.withArgs().returns("Asia/Calcutta");
        });

        hooks.afterEach(function () {
            this.CompositeBrowserDateTimeType.destroy();
            sandbox.restore();
        });

        QUnit.test("Test formatValue function of CompositeBrowserDateTimeType - Locale - EN", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('en');
            assert.equal(this.CompositeBrowserDateTimeType.formatValue(["",""]), "", 'result: ""');
            assert.equal(this.CompositeBrowserDateTimeType.formatValue(["2021-10-28T08:38:35Z",""]), "Oct 28, 2021, 2:08:35 PM", 'result: "Oct 28, 2021, 2:08:35 PM"');
            assert.equal(this.CompositeBrowserDateTimeType.formatValue(["2021-10-28T08:38:35Z",undefined]), "Oct 28, 2021, 2:08:35 PM", 'result: "Oct 28, 2021, 2:08:35 PM"');
            assert.equal(this.CompositeBrowserDateTimeType.formatValue([undefined,undefined]), "", 'result: ""');
            assert.equal(this.CompositeBrowserDateTimeType.formatValue(["2021-10-28T08:38:35Z","medium/short"]), "Oct 28, 2021, 2:08 PM", 'result: "Oct 28, 2021, 2:08 PM"');
            //Input is in ISO
            assert.equal(this.CompositeBrowserDateTimeType.formatValue(["2021-10-28T08:38:35.000Z","medium/short"]), "Oct 28, 2021, 2:08 PM", 'result: "Oct 28, 2021, 2:08 PM"');
        });

        QUnit.test("Test formatValue function of CompositeBrowserDateTimeType - Locale - DE", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('de');
            assert.equal(this.CompositeBrowserDateTimeType.formatValue(["",""]), "", 'result: ""');
            assert.equal(this.CompositeBrowserDateTimeType.formatValue(["2021-10-28T08:38:35Z",""]), "28.10.2021, 14:08:35", 'result: "28.10.2021, 14:08:35"');
            assert.equal(this.CompositeBrowserDateTimeType.formatValue(["2021-10-28T08:38:35Z",undefined]), "28.10.2021, 14:08:35", 'result: "28.10.2021, 14:08:35"');
            assert.equal(this.CompositeBrowserDateTimeType.formatValue([undefined,undefined]), "", 'result: ""');
            assert.equal(this.CompositeBrowserDateTimeType.formatValue(["2021-10-28T08:38:35Z","medium/short"]), "28.10.2021, 14:08", 'result: "28.10.2021, 14:08"');
            //Input is in ISO
            assert.equal(this.CompositeBrowserDateTimeType.formatValue(["2021-10-28T08:38:35.000Z","medium/short"]), "28.10.2021, 14:08", 'result: "28.10.2021, 14:08"');
        });

        QUnit.test("Test parseValue function of CompositeBrowserDateTimeType", function (assert) {
            assert.deepEqual(this.CompositeBrowserDateTimeType.parseValue("","string",["previousValueInField",""]), ['',''], "result:  ['','']");
            assert.deepEqual(this.CompositeBrowserDateTimeType.parseValue("2021-10-28T14:08:35","string",["previousValueInField",""]), ['2021-10-28T08:38:35.000Z',''], "result:  ['2021-10-28T08:38:35.000Z','']");
            assert.deepEqual(this.CompositeBrowserDateTimeType.parseValue("2021-10-28T14:08:35","string",["previousValueInField","medium/short"]), ['2021-10-28T08:38:35.000Z','medium/short'], "result:  ['2021-10-28T08:38:35.000Z','medium/short']");
            assert.throws(
                function () {
                  this.CompositeBrowserDateTimeType.parseValue("abc","string",["previousValueInField","medium/short"]);
                },
                {
                  message: "'abc' - Invalid Date",
                  name: "ParseException",
                },
                "Error thrown"
            );
        });

        QUnit.test("Test formatValue and parseValue of CompositeBrowserDateTimeType in CYCLE- Locale - EN", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('en');
            //Initial input from API in UTC, output is formatted
            assert.equal(this.CompositeBrowserDateTimeType.formatValue(["2020-10-23T05:13:45Z","medium/short"]), "Oct 23, 2020, 10:43 AM", 'result: "Oct 23, 2020, 10:43 AM"');
            //User modified date in datetime picker passed as JS Date obj: Oct 28, 2021, 2:08 PM, output is UTC
            assert.deepEqual(this.CompositeBrowserDateTimeType.parseValue("2021-10-28T14:08:00","string",["previousValueInField","medium/short"]), ['2021-10-28T08:38:00.000Z','medium/short'], "result:  ['2021-10-28T08:38:00.000Z','medium/short']");
            //Above UTC as input, output is formatter value
            assert.equal(this.CompositeBrowserDateTimeType.formatValue(["2021-10-28T08:38:00.000Z","medium/short"]), "Oct 28, 2021, 2:08 PM", 'result: "Oct 28, 2021, 2:08 PM"');
        });

        QUnit.test("Test formatValue and parseValue of CompositeBrowserDateTimeType in CYCLE- Locale - DE", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('de');
            //Initial input from API in UTC, output is formatted
            assert.equal(this.CompositeBrowserDateTimeType.formatValue(["2020-10-23T05:13:45Z","medium/short"]), "23.10.2020, 10:43", 'result: "23.10.2020, 10:43"');
            //User modified date in datetime picker passed as JS Date obj: Oct 28, 2021, 2:08 PM, output is UTC
            assert.deepEqual(this.CompositeBrowserDateTimeType.parseValue("2021-10-28T14:08:00","string",["previousValueInField","medium/short"]), ['2021-10-28T08:38:00.000Z','medium/short'], "result:  ['2021-10-28T08:38:00.000Z','medium/short']");
            //Above UTC as input, output is formatter value
            assert.equal(this.CompositeBrowserDateTimeType.formatValue(["2021-10-28T08:38:00.000Z","medium/short"]), "28.10.2021, 14:08", 'result: "28.10.2021, 14:08"');
        });
    });
});