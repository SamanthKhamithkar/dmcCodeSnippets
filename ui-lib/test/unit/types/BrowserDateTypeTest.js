sap.ui.define([
    "sap/dm/dme/types/BrowserDateType"
], function (BrowserDateType) {
    "use strict";

    var sandbox = sinon.createSandbox();
    const momentProto = moment.tz;
    QUnit.module("BrowserDate Type", function (hooks) {
        hooks.beforeEach(function () {
            this.BrowserDateType = new BrowserDateType();
            sandbox.stub(momentProto,"guess");
            momentProto.guess.withArgs().returns("Asia/Calcutta");
        });

        hooks.afterEach(function () {
            this.BrowserDateType.destroy();
            sandbox.restore();
        });

        QUnit.test("Test formatValue function of BrowserDateType - Locale - EN", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('en');
            assert.equal(this.BrowserDateType.formatValue(""), "", 'result: ""');
            assert.equal(this.BrowserDateType.formatValue("2021-10-28T08:38:35.000Z"), "Oct 28, 2021", 'result: "Oct 28, 2021"');
            assert.equal(this.BrowserDateType.formatValue("2021-10-27T18:30:00Z"), "Oct 28, 2021", 'result: "Oct 28, 2021"');
            assert.equal(this.BrowserDateType.formatValue("2021-10-28T00:00:00Z"), "Oct 28, 2021", 'result: "Oct 28, 2021"');
        });

        QUnit.test("Test formatValue function of BrowserDateType - Locale - DE", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('de');            
            assert.equal(this.BrowserDateType.formatValue(""), "", 'result: ""');
            assert.equal(this.BrowserDateType.formatValue("2021-10-28T08:38:35.000Z"), "28.10.2021", 'result: "28.10.2021"');
            assert.equal(this.BrowserDateType.formatValue("2021-10-27T18:30:00Z"), "28.10.2021", 'result: "28.10.2021"');
            assert.equal(this.BrowserDateType.formatValue("2021-10-28T00:00:00Z"), "28.10.2021", 'result: "28.10.2021"');
        });

        QUnit.test("Test parseValue function of BrowserDateType", function (assert) {
            assert.equal(this.BrowserDateType.parseValue("","string"), "", 'result: ""');
            assert.equal(this.BrowserDateType.parseValue("2021-10-28T14:08:35","string"), "2021-10-28T08:38:35.000Z", 'result: "2021-10-28T08:38:35.000Z"');
            assert.equal(this.BrowserDateType.parseValue("2021-10-28T00:00:00","string"), "2021-10-27T18:30:00.000Z", 'result: "2021-10-27T18:30:00.000Z"');
            assert.equal(this.BrowserDateType.parseValue("2021-10-28","string"), "2021-10-27T18:30:00.000Z", 'result: "2021-10-27T18:30:00.000Z"');
            assert.throws(
                function () {
                  this.BrowserDateType.parseValue("abc","string");
                },
                {
                  message: "'abc' - Invalid Date",
                  name: "ParseException",
                },
                "Error thrown"
            );
        });

        QUnit.test("Test formatValue and parseValue of BrowserDateType in CYCLE- Locale - EN", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('en');
            //Initial input from API in UTC, output is formatted
            assert.equal(this.BrowserDateType.formatValue("2020-10-23T05:13:45Z"), "Oct 23, 2020", 'result: "Oct 23, 2020"');
            //User modified date in date picker passed as JS Date obj: Oct 28, 2021, output is UTC
            assert.equal(this.BrowserDateType.parseValue("2021-10-28T00:00:00","string"), "2021-10-27T18:30:00.000Z", 'result: "2021-10-27T18:30:00.000Z"');
            //Above UTC as input, output is formatter value
            assert.equal(this.BrowserDateType.formatValue("2021-10-27T18:30:00.000Z"), "Oct 28, 2021", 'result: "Oct 28, 2021"');
        });

        QUnit.test("Test formatValue and parseValue of BrowserDateType in CYCLE- Locale - DE", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('de');
            //Initial input from API in UTC, output is formatted
            assert.equal(this.BrowserDateType.formatValue("2020-10-23T05:13:45Z"), "23.10.2020", 'result: "23.10.2020"');
            //User modified date in date picker passed as JS Date obj: 28.10.2021 output is UTC
            assert.equal(this.BrowserDateType.parseValue("2021-10-28T00:00:00","string"), "2021-10-27T18:30:00.000Z", 'result: "2021-10-27T18:30:00.000Z"');
            //Above UTC as input, output is formatter value
            assert.equal(this.BrowserDateType.formatValue("2021-10-27T18:30:00.000Z"), "28.10.2021", 'result: "28.10.2021"');
        });
    });
});