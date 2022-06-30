sap.ui.define([
    "sap/dm/dme/types/BrowserDateTimeType"
], function (BrowserDateTimeType) {
    "use strict";

    var sandbox = sinon.createSandbox();
    const momentProto = moment.tz;
    QUnit.module("BrowserDateTime Type", function (hooks) {
        hooks.beforeEach(function () {
            this.BrowserDateTimeType = new BrowserDateTimeType();
            sandbox.stub(momentProto,"guess");
            momentProto.guess.withArgs().returns("Asia/Calcutta");
        });

        hooks.afterEach(function () {
            this.BrowserDateTimeType.destroy();
            sandbox.restore();
        });

        QUnit.test("Test formatValue function of BrowserDateTimeType - Locale - EN", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('en');
            assert.equal(this.BrowserDateTimeType.formatValue(""), "", 'result: ""');
            assert.equal(this.BrowserDateTimeType.formatValue("2021-10-28T08:38:35Z"), "Oct 28, 2021, 2:08:35 PM", 'result: "Oct 28, 2021, 2:08:35 PM"');
            //Input is in ISO
            assert.equal(this.BrowserDateTimeType.formatValue("2021-10-28T08:38:35.000Z"), "Oct 28, 2021, 2:08:35 PM", 'result: "Oct 28, 2021, 2:08:35 PM"');
        });

        QUnit.test("Test formatValue function of BrowserDateTimeType - Locale - DE", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('de');            
            assert.equal(this.BrowserDateTimeType.formatValue(""), "", 'result: ""');
            assert.equal(this.BrowserDateTimeType.formatValue("2021-10-28T08:38:35Z"), "28.10.2021, 14:08:35", 'result: "28.10.2021, 14:08:35"');
            //Input is in ISO
            assert.equal(this.BrowserDateTimeType.formatValue("2021-10-28T08:38:35.000Z"), "28.10.2021, 14:08:35", 'result: "28.10.2021, 14:08:35"');
        });

        QUnit.test("Test parseValue function of BrowserDateTimeType", function (assert) {
            assert.equal(this.BrowserDateTimeType.parseValue("","string"), "", 'result: ""');
            assert.equal(this.BrowserDateTimeType.parseValue("2021-10-28T14:08:35","string"), "2021-10-28T08:38:35.000Z", 'result: "2021-10-28T08:38:35.000Z"');
            assert.throws(
                function () {
                  this.BrowserDateTimeType.parseValue("abc","string");
                },
                {
                  message: "'abc' - Invalid Date",
                  name: "ParseException",
                },
                "Error thrown"
            );
        });

        QUnit.test("Test formatValue and parseValue of BrowserDateTimeType in CYCLE- Locale - EN", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('en');
            //Initial input from API in UTC, output is formatted
            assert.equal(this.BrowserDateTimeType.formatValue("2020-10-23T05:13:45Z"), "Oct 23, 2020, 10:43:45 AM", 'result: "Oct 23, 2020, 10:43:45 AM"');
            //User modified date in datetime picker passed as JS Date obj: Oct 28, 2021, 2:08:35 PM, output is UTC
            assert.equal(this.BrowserDateTimeType.parseValue("2021-10-28T14:08:35","string"), "2021-10-28T08:38:35.000Z", 'result: "2021-10-28T08:38:35.000Z"');
            //Above UTC as input, output is formatter value
            assert.equal(this.BrowserDateTimeType.formatValue("2021-10-28T08:38:35.000Z"), "Oct 28, 2021, 2:08:35 PM", 'result: "Oct 28, 2021, 2:08:35 PM"');
        });

        QUnit.test("Test formatValue and parseValue of BrowserDateTimeType in CYCLE- Locale - DE", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('de');
            //Initial input from API in UTC, output is formatted
            assert.equal(this.BrowserDateTimeType.formatValue("2020-10-23T05:13:45Z"), "23.10.2020, 10:43:45", 'result: "23.10.2020, 10:43:45"');
            //User modified date in datetime picker passed as JS Date obj: 28.10.2021, 14:08:35, output is UTC
            assert.equal(this.BrowserDateTimeType.parseValue("2021-10-28T14:08:35","string"), "2021-10-28T08:38:35.000Z", 'result: "2021-10-28T08:38:35.000Z"');
            //Above UTC as input, output is formatter value
            assert.equal(this.BrowserDateTimeType.formatValue("2021-10-28T08:38:35.000Z"), "28.10.2021, 14:08:35", 'result: "28.10.2021, 14:08:35"');
        });
    });
});