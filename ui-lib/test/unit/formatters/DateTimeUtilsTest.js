sap.ui.define([
    "sap/dm/dme/formatter/DateTimeUtils",
    "sap/dm/dme/util/PlantSettings",
    "sap/dm/dme/constants/DMCConstants"
], function (DateTimeUtils, PlantSettings, DMCConstants) {
    "use strict";

    QUnit.module("DateTimeUtils", {
    
    });

    QUnit.test("formatDate: argument is empty", function (assert) {
        var sResult = DateTimeUtils.formatDate("");
        assert.equal(sResult, "", "Result is empty");
    });

    QUnit.test("formatDate: 2020/09/20", function (assert) {
        var sResult = DateTimeUtils.formatDate("2020/09/20");
        assert.equal(sResult, "Sep 20, 2020", "Result is: Sep 20, 2020");
    });

    QUnit.test("formatDate: argument is 2020-09-20", function (assert) {
        var sResult = DateTimeUtils.formatDate("2020-09-20");
        assert.equal(sResult, "Sep 20, 2020", "Result is: Sep 20, 2020");
    });

    QUnit.test("formatDate: argument is 2020-Sep-20", function (assert) {
        var sResult = DateTimeUtils.formatDate("2020-Sep-20");
        assert.equal(sResult, "Sep 20, 2020", "Result is: Sep 20, 2020");
    });

    QUnit.test("formatDate: argument is 20-09-20", function (assert) {
        var sResult = DateTimeUtils.formatDate("20-09-20");
        assert.equal(sResult, "Sep 20, 2020", "Result is: Sep 20, 2020");
    });

    QUnit.test("formatDate: argument is 2021-05-01", function (assert) {
        var sResult = DateTimeUtils.formatDate("2021-05-01");
        assert.equal(sResult, "May 1, 2021", "Result is: May 1, 2021");
    });

    QUnit.test("formatDate: argument is 2021-05-01 12:22:12", function (assert) {
        var sResult = DateTimeUtils.formatDate("2021-05-01");
        assert.equal(sResult, "May 1, 2021", "Result is: May 1, 2021");
    });

    QUnit.test("formatDateTime: argument is empty", function (assert) {
        var sResult = DateTimeUtils.formatDateTime("");
        assert.equal(sResult, "", "Result is empty");
    });

    QUnit.test("formatDateTime: 2020/09/20", function (assert) {
        var sResult = DateTimeUtils.formatDateTime("2020/09/20");
        assert.equal(sResult, "Sep 20, 2020, 00:00:00", "Result is: Sep 20, 2020, 00:00:00");
    });

    QUnit.test("formatDateTime: 2020/09/20 13:20:10", function (assert) {
        var sResult = DateTimeUtils.formatDateTime("2020/09/20 13:20:10");
        assert.equal(sResult, "Sep 20, 2020, 13:20:10", "Result is: Sep 20, 2020, 13:20:10");
    });

    QUnit.test("formatDateTime: 2020-09-20T13:20:10", function (assert) {
        var sResult = DateTimeUtils.formatDateTime("2020-09-20T13:20:10");
        assert.equal(sResult, "Sep 20, 2020, 13:20:10", "Result is: Sep 20, 2020, 13:20:10");
    });

    QUnit.test("formatDateTime: 2020-09-20T01:20:10", function (assert) {
        var sResult = DateTimeUtils.formatDateTime("2020-09-20T01:20:10");
        assert.equal(sResult, "Sep 20, 2020, 01:20:10", "Result is: Sep 20, 2020, 01:20:10");
    });

    QUnit.test("formatDateTime: 2020-Sep-20 01:20:10AM", function (assert) {
        var sResult = DateTimeUtils.formatDateTime("20-09-20T01:20:19");
        assert.equal(sResult, "Sep 20, 2020, 01:20:19", "Result is: Sep 20, 2020, 01:20:19");
    });

    QUnit.test("formatDateInterval: 2020/08/20 2020/09/20", function (assert) {
        var sResult = DateTimeUtils.formatDateInterval("2020/08/20", "2020/09/20");
        assert.equal(sResult, "Aug 20 – Sep 20, 2020", "Result is: Aug 20 – Sep 20, 2020");
    });

    QUnit.test("formatDateInterval: 2021-06-14T14:44:41 2021-07-14T14:44:41", function (assert) {
        var sResult = DateTimeUtils.formatDateInterval("2021-06-14T14:44:41", "2021-07-14T14:44:41");
        assert.equal(sResult, "Jun 14 – Jul 14, 2021", "Jul 07 – Jul 07, 2021");
    });

    QUnit.test("formatDateInterval: Start date is not specified", function (assert) {
        var sResult = DateTimeUtils.formatDateInterval("", "2020/09/20");
        assert.equal(sResult, "", "Result is empty");
    });

    QUnit.test("formatDateInterval: End date is not specified", function (assert) {
        var sResult = DateTimeUtils.formatDateInterval("2020/09/20");
        assert.equal(sResult, "", "Result is empty");
    });

    QUnit.test("formatDateInterval: Start and End dates are not specified", function (assert) {
        var sResult = DateTimeUtils.formatDateInterval("2020/09/20");
        assert.equal(sResult, "", "Result is empty");
    });

    QUnit.test("formatTime: 01:01:01", function (assert) {
        var sResult = DateTimeUtils.formatTime("01:01:01");
        assert.equal(sResult, "1:01:01 AM", "Result is 1:01:01 AM");
    });

    QUnit.test("formatTime: argument is empty", function (assert) {
        var sResult = DateTimeUtils.formatTime("");
        assert.equal(sResult, "", "Result is empty");
    });

    QUnit.test("dmcDateValueFormat: static string output", function (assert) {
        var sResult = DateTimeUtils.dmcDateValueFormat();
        assert.equal(sResult, "yyyy-MM-ddTHH:mm:ssZ", 'Result is: "yyyy-MM-ddTHH:mm:ssZ"');
    });

    QUnit.test("dmcTimeZoneDate: Input- JSDateObj/UTC String - Output- timezone JSDate Obj", function (assert) {
        //Plant Timezone being set in PlantSettings and test cases for same
        PlantSettings.setTimeZone("Europe/Berlin");
        var timeZoneDate = "2020-10-23T07:13:45";
        assert.deepEqual(DateTimeUtils.dmcTimeZoneDate("2020-10-23T05:13:45Z",undefined), new Date(timeZoneDate),"Result Matched");
        assert.deepEqual(DateTimeUtils.dmcTimeZoneDate(new Date("2020-10-23T05:13:45Z"),""), new Date(timeZoneDate),"Result Matched");
        assert.equal(DateTimeUtils.dmcTimeZoneDate("",""), "Invalid Date","Invalid Date");
    });

    QUnit.test("dmcDateTimeFormatterFromUTC - EN", function (assert) {
        sap.ui.getCore().getConfiguration().setLanguage('en');
        assert.equal(DateTimeUtils.dmcDateTimeFormatterFromUTC("2020-10-23T05:13:45Z","US/Central"), "Oct 23, 2020, 12:13:45 AM", 'Result is: "Oct 23, 2020, 12:13:45 AM"');
        assert.equal(DateTimeUtils.dmcDateTimeFormatterFromUTC("2020-10-23T05:13:45Z","US/Pacific"), "Oct 22, 2020, 10:13:45 PM", 'Result is: "Oct 22, 2020, 10:13:45 PM"');
        assert.equal(DateTimeUtils.dmcDateTimeFormatterFromUTC("2020-10-23T05:13:45Z","Europe/Berlin"), "Oct 23, 2020, 7:13:45 AM", 'Result is: "Oct 23, 2020, 7:13:45 AM"');
        assert.equal(DateTimeUtils.dmcDateTimeFormatterFromUTC("","US/Central"), "", 'Result is: ""');
        assert.equal(DateTimeUtils.dmcDateTimeFormatterFromUTC(new Date("2020-10-23T05:13:45Z"),"Europe/Berlin"), "Oct 23, 2020, 7:13:45 AM", 'Result is: "Oct 23, 2020, 7:13:45 AM"');
        assert.equal(DateTimeUtils.dmcDateTimeFormatterFromUTC("2020-10-23T05:13:45Z","Europe/Berlin",DMCConstants.customStyleOptions.noSeconds), "Oct 23, 2020, 7:13 AM", 'Result is: "Oct 23, 2020, 7:13 AM"');
        //Input is ISO String
        assert.equal(DateTimeUtils.dmcDateTimeFormatterFromUTC("2020-10-23T05:13:45.000Z","Europe/Berlin",DMCConstants.customStyleOptions.noSeconds), "Oct 23, 2020, 7:13 AM", 'Result is: "Oct 23, 2020, 7:13 AM"');
        assert.equal(DateTimeUtils.dmcDateTimeFormatterFromUTC("2020-10-23T05:13:45.000Z","Europe/Berlin",DMCConstants.customStyleOptions.short), "10/23/20, 7:13 AM", 'Result is: "10/23/20, 7:13 AM"');
        //When Style="long" or "full", formatted output is with GMT value. Ex: "October 23, 2020 at 7:13:45 AM GMT+05:30"
        //GMT value keeps changing with browser Timezone we are in and test cases fail in GIT if we hardcode the output as it is.
        //Hence parsing the output before comparing to avoid such scenario.
        assert.deepEqual(DateTimeUtils.dmcParseDateTime(DateTimeUtils.dmcDateTimeFormatterFromUTC("2020-10-23T05:13:45.000Z","Europe/Berlin",DMCConstants.customStyleOptions.long), DMCConstants.customStyleOptions.long), DateTimeUtils.dmcParseDateTime("October 23, 2020 at 7:13:45 AM", DMCConstants.customStyleOptions.long), 'Result is: "Results Matched"');
        assert.deepEqual(DateTimeUtils.dmcParseDateTime(DateTimeUtils.dmcDateTimeFormatterFromUTC("2020-10-23T05:13:45.000Z","Europe/Berlin",DMCConstants.customStyleOptions.full), DMCConstants.customStyleOptions.full), DateTimeUtils.dmcParseDateTime("Friday, October 23, 2020 at 7:13:45 AM", DMCConstants.customStyleOptions.full), 'Result is: "Results Matched"');
        //Plant Timezone being set in PlantSettings and test cases for same
        PlantSettings.setTimeZone("Europe/Berlin");
        assert.equal(DateTimeUtils.dmcDateTimeFormatterFromUTC("2020-10-23T05:13:45Z",undefined),"Oct 23, 2020, 7:13:45 AM","Result is: 'Oct 23, 2020, 7:13:45 AM'");
        assert.equal(DateTimeUtils.dmcDateTimeFormatterFromUTC("2020-10-23T05:13:45Z",""),"Oct 23, 2020, 7:13:45 AM","Result is: 'Oct 23, 2020, 7:13:45 AM'");
        assert.throws(
            function () {
              DateTimeUtils.dmcDateTimeFormatterFromUTC("2020-10-23T05:13:45Z","Europe/Berlin","medium/full");
            },
            Error("Style is not supported"),
            "Error thrown"
        );
    });

/*    QUnit.test("dmcDateTimeFormatterFromUTC - DE", function (assert) {
        sap.ui.getCore().getConfiguration().setLanguage('de');
        assert.equal(DateTimeUtils.dmcDateTimeFormatterFromUTC("2020-10-23T05:13:45Z","US/Central"), "23.10.2020, 00:13:45", 'Result is: "23.10.2020, 00:13:45"');
        assert.equal(DateTimeUtils.dmcDateTimeFormatterFromUTC("2020-10-23T05:13:45Z","US/Pacific"), "22.10.2020, 22:13:45", 'Result is: "22.10.2020, 22:13:45"');
        assert.equal(DateTimeUtils.dmcDateTimeFormatterFromUTC("2020-10-23T05:13:45Z","Europe/Berlin"), "23.10.2020, 07:13:45", 'Result is: "23.10.2020, 07:13:45"');
        assert.equal(DateTimeUtils.dmcDateTimeFormatterFromUTC("","US/Central"), "", 'Result is: ""');
        assert.equal(DateTimeUtils.dmcDateTimeFormatterFromUTC(new Date("2020-10-23T05:13:45Z"),"Europe/Berlin"), "23.10.2020, 07:13:45", 'Result is: "23.10.2020, 07:13:45"');
        assert.equal(DateTimeUtils.dmcDateTimeFormatterFromUTC("2020-10-23T05:13:45Z","Europe/Berlin",DMCConstants.customStyleOptions.noSeconds), "23.10.2020, 07:13", 'Result is: "23.10.2020, 07:13"');
        //Input is ISO String
        assert.equal(DateTimeUtils.dmcDateTimeFormatterFromUTC("2020-10-23T05:13:45.000Z","Europe/Berlin",DMCConstants.customStyleOptions.noSeconds), "23.10.2020, 07:13", 'Result is: "23.10.2020, 07:13"');
        assert.equal(DateTimeUtils.dmcDateTimeFormatterFromUTC("2020-10-23T05:13:45.000Z","Europe/Berlin",DMCConstants.customStyleOptions.short), "23.10.20, 07:13", 'Result is: "23.10.20, 07:13"');
        //When Style="long" or "full", formatted output is with GMT value. Ex: "23. Oktober 2020 um 07:13:45 GMT+05:30"
        //GMT value keeps changing with browser Timezone we are in and test cases fail in GIT if we hardcode the output as it is.
        //Hence parsing the output before comparing to avoid such scenario.
        assert.deepEqual(DateTimeUtils.dmcParseDateTime(DateTimeUtils.dmcDateTimeFormatterFromUTC("2020-10-23T05:13:45.000Z","Europe/Berlin",DMCConstants.customStyleOptions.long),DMCConstants.customStyleOptions.long), DateTimeUtils.dmcParseDateTime("23. Oktober 2020 um 07:13:45", DMCConstants.customStyleOptions.long), 'Result is: "Results Matched"');
        assert.deepEqual(DateTimeUtils.dmcParseDateTime(DateTimeUtils.dmcDateTimeFormatterFromUTC("2020-10-23T05:13:45.000Z","Europe/Berlin",DMCConstants.customStyleOptions.full), DMCConstants.customStyleOptions.full), DateTimeUtils.dmcParseDateTime("Freitag, 23. Oktober 2020 um 07:13:45", DMCConstants.customStyleOptions.full), 'Result is: "Results Matched"');
        //Plant Timezone being set in PlantSettings and test cases for same
        PlantSettings.setTimeZone("Europe/Berlin");
        assert.equal(DateTimeUtils.dmcDateTimeFormatterFromUTC("2020-10-23T05:13:45Z",undefined), "23.10.2020, 07:13:45", 'Result is: "23.10.2020, 07:13:45"');
        assert.equal(DateTimeUtils.dmcDateTimeFormatterFromUTC("2020-10-23T05:13:45Z",""), "23.10.2020, 07:13:45", 'Result is: "23.10.2020, 07:13:45"');
        assert.throws(
            function () {
              DateTimeUtils.dmcDateTimeFormatterFromUTC("2020-10-23T05:13:45Z","Europe/Berlin","medium/full");
            },
            Error("Style is not supported"),
            "Error thrown"
        );
    });*/

    QUnit.test("dmcDateFormatterFromUTC - EN", function (assert) {
        sap.ui.getCore().getConfiguration().setLanguage('en');
        assert.equal(DateTimeUtils.dmcDateFormatterFromUTC("2020-10-23T05:13:45Z","US/Central"), "Oct 23, 2020", 'Result is: "Oct 23, 2020"');
        assert.equal(DateTimeUtils.dmcDateFormatterFromUTC("2020-10-23T05:13:45Z","US/Pacific"), "Oct 22, 2020", 'Result is: "Oct 22, 2020"');
        assert.equal(DateTimeUtils.dmcDateFormatterFromUTC("2020-10-23T05:13:45Z","Europe/Berlin"), "Oct 23, 2020", 'Result is: "Oct 23, 2020"');
        assert.equal(DateTimeUtils.dmcDateFormatterFromUTC("","US/Central"), "", 'Result is: ""');
        //Input is in ISO
        assert.equal(DateTimeUtils.dmcDateFormatterFromUTC("2020-10-23T05:13:45.000Z","Europe/Berlin"), "Oct 23, 2020", 'Result is: "Oct 23, 2020"');
        assert.equal(DateTimeUtils.dmcDateFormatterFromUTC("2020-10-23T05:13:45.000Z","Europe/Berlin",DMCConstants.customStyleOptions.short), "10/23/20", 'Result is: "10/23/20"');
        assert.deepEqual(DateTimeUtils.dmcDateFormatterFromUTC("2020-10-23T05:13:45.000Z","Europe/Berlin",DMCConstants.customStyleOptions.long), "October 23, 2020", 'Result is: "Results Matched"');
        assert.deepEqual(DateTimeUtils.dmcDateFormatterFromUTC("2020-10-23T05:13:45.000Z","Europe/Berlin",DMCConstants.customStyleOptions.full), "Friday, October 23, 2020", 'Result is: "Results Matched"');
        //Plant Timezone being set in PlantSettings and test cases for same
        PlantSettings.setTimeZone("Europe/Berlin");
        assert.equal(DateTimeUtils.dmcDateFormatterFromUTC("2020-10-23T05:13:45Z",undefined), "Oct 23, 2020", 'Result is: "Oct 23, 2020"')
        assert.equal(DateTimeUtils.dmcDateFormatterFromUTC("2020-10-23T05:13:45Z",""), "Oct 23, 2020", 'Result is: "Oct 23, 2020"')
    });

    QUnit.test("dmcDateFormatterFromUTC - DE", function (assert) {
        sap.ui.getCore().getConfiguration().setLanguage('de');
        assert.equal(DateTimeUtils.dmcDateFormatterFromUTC("2020-10-23T05:13:45Z","US/Central"), "23.10.2020", 'Result is: "23.10.2020"');
        assert.equal(DateTimeUtils.dmcDateFormatterFromUTC("2020-10-23T05:13:45Z","US/Pacific"), "22.10.2020", 'Result is: "22.10.2020"');
        assert.equal(DateTimeUtils.dmcDateFormatterFromUTC("2020-10-23T05:13:45Z","Europe/Berlin"), "23.10.2020", 'Result is: "23.10.2020"');
        assert.equal(DateTimeUtils.dmcDateFormatterFromUTC("","US/Central"), "", 'Result is: ""');
        //Input is in ISO
        assert.equal(DateTimeUtils.dmcDateFormatterFromUTC("2020-10-23T05:13:45.000Z","Europe/Berlin"), "23.10.2020", 'Result is: "23.10.2020"');
        assert.equal(DateTimeUtils.dmcDateFormatterFromUTC("2020-10-23T05:13:45.000Z","Europe/Berlin",DMCConstants.customStyleOptions.short), "23.10.20", 'Result is: "23.10.20"');
        assert.deepEqual(DateTimeUtils.dmcDateFormatterFromUTC("2020-10-23T05:13:45.000Z","Europe/Berlin",DMCConstants.customStyleOptions.long), "23. Oktober 2020", 'Result is: "Results Matched"');
        assert.deepEqual(DateTimeUtils.dmcDateFormatterFromUTC("2020-10-23T05:13:45.000Z","Europe/Berlin",DMCConstants.customStyleOptions.full), "Freitag, 23. Oktober 2020", 'Result is: "Results Matched"');
        //Plant Timezone being set in PlantSettings and test cases for same
        PlantSettings.setTimeZone("Europe/Berlin");
        assert.equal(DateTimeUtils.dmcDateFormatterFromUTC("2020-10-23T05:13:45Z",undefined), "23.10.2020", 'Result is: "23.10.2020"');
        assert.equal(DateTimeUtils.dmcDateFormatterFromUTC("2020-10-23T05:13:45Z",""), "23.10.2020", 'Result is: "23.10.2020"');
    });

    QUnit.test("dmcFormatDateInterval: EN", function (assert) {
        sap.ui.getCore().getConfiguration().setLanguage('en');
        assert.equal(DateTimeUtils.dmcFormatDateInterval("Oct 23, 2020", "Dec 23, 2020"), "Oct 23, 2020 – Dec 23, 2020", "Result is: Oct 23, 2020 – Dec 23, 2020");
        assert.equal(DateTimeUtils.dmcFormatDateInterval("Oct 23, 2020", "Oct 05, 2020"), "", "Result is: ");
        assert.equal(DateTimeUtils.dmcFormatDateInterval("Oct 23, 2020", undefined), "", "Result is: ");
        assert.equal(DateTimeUtils.dmcFormatDateInterval("", "Dec 23, 2020"), "", "Result is: ");
        assert.equal(DateTimeUtils.dmcFormatDateInterval("", ""), "", "Result is: ");
    });

    QUnit.test("dmcFormatDateInterval: DE", function (assert) {
        sap.ui.getCore().getConfiguration().setLanguage('de');
        assert.equal(DateTimeUtils.dmcFormatDateInterval("23.10.2020", "23.12.2020"), "23.10.2020 – 23.12.2020", "Result is: 23.10.2020 – 23.12.2020");
        assert.equal(DateTimeUtils.dmcFormatDateInterval("23.10.2020", "03.12.2020"), "23.10.2020 – 03.12.2020", "Result is: 23.10.2020 – 03.12.2020");
        assert.equal(DateTimeUtils.dmcFormatDateInterval("23.10.2020", "15.10.2020"), "", "Result is: ");
        assert.equal(DateTimeUtils.dmcFormatDateInterval("23.10.2020", undefined), "", "Result is: ");
        assert.equal(DateTimeUtils.dmcFormatDateInterval("", "23.12.2020"), "", "Result is: ");
        assert.equal(DateTimeUtils.dmcFormatDateInterval("", ""), "", "Result is: ");
    });

    QUnit.test("dmcFormatDateIntervalFromUTC: EN", function (assert) {
        sap.ui.getCore().getConfiguration().setLanguage('en');
        assert.equal(DateTimeUtils.dmcFormatDateIntervalFromUTC("2020-10-23T05:13:45Z", "2020-11-20T05:13:45Z", "US/Central"), "Oct 23, 2020 – Nov 19, 2020", "Result is: Oct 23, 2020 – Nov 19, 2020");
        assert.equal(DateTimeUtils.dmcFormatDateIntervalFromUTC("2020-10-23T05:13:45Z", "2020-11-20T05:13:45Z", "Europe/Berlin"), "Oct 23, 2020 – Nov 20, 2020", "Result is: Oct 23, 2020 – Nov 20, 2020");
        assert.equal(DateTimeUtils.dmcFormatDateIntervalFromUTC("2020-10-23T05:13:45Z", "2020-10-05T05:13:45Z", "US/Central"), "", "Result is: ");
        assert.equal(DateTimeUtils.dmcFormatDateIntervalFromUTC("2022-03-01T15:05:23Z", "2022-03-01T15:04:23Z", "US/Central"), "Mar 1, 2022 – Mar 1, 2022", "Result is: Mar 1, 2022 – Mar 1, 2022");
        //Plant Timezone being set in PlantSettings and test cases for same
        PlantSettings.setTimeZone("Europe/Berlin");
        assert.equal(DateTimeUtils.dmcFormatDateIntervalFromUTC("2020-10-23T05:13:45Z", "2020-11-20T05:13:45Z"), "Oct 23, 2020 – Nov 20, 2020", "Result is: Oct 23, 2020 – Nov 20, 2020");
        assert.equal(DateTimeUtils.dmcFormatDateIntervalFromUTC("2020-10-23T05:13:45Z", undefined), "", "Result is: ");
        assert.equal(DateTimeUtils.dmcFormatDateIntervalFromUTC("", "2020-10-23T05:13:45Z"), "", "Result is: ");
        assert.equal(DateTimeUtils.dmcFormatDateIntervalFromUTC("", ""), "", "Result is: ");
    });

    QUnit.test("dmcFormatDateIntervalFromUTC: DE", function (assert) {
        sap.ui.getCore().getConfiguration().setLanguage('de');
        assert.equal(DateTimeUtils.dmcFormatDateIntervalFromUTC("2020-10-23T05:13:45Z", "2020-11-20T05:13:45Z", "US/Central"), "23.10.2020 – 19.11.2020", "Result is: 23.10.2020 – 19.11.2020");
        assert.equal(DateTimeUtils.dmcFormatDateIntervalFromUTC("2020-10-23T05:13:45Z", "2020-11-20T05:13:45Z", "Europe/Berlin"), "23.10.2020 – 20.11.2020", "Result is: 23.10.2020 – 20.11.2020");
        assert.equal(DateTimeUtils.dmcFormatDateIntervalFromUTC("2020-10-23T05:13:45Z", "2020-10-05T05:13:45Z", "US/Central"), "", "Result is: ");
        assert.equal(DateTimeUtils.dmcFormatDateIntervalFromUTC("2022-03-01T15:05:23Z", "2022-03-01T15:04:23Z", "US/Central"), "01.03.2022 – 01.03.2022", "Result is: 01.03.2022 – 01.03.2022");
        //Plant Timezone being set in PlantSettings and test cases for same
        PlantSettings.setTimeZone("Europe/Berlin");
        assert.equal(DateTimeUtils.dmcFormatDateIntervalFromUTC("2020-10-23T05:13:45Z", "2020-11-20T05:13:45Z"), "23.10.2020 – 20.11.2020", "Result is: 23.10.2020 – 20.11.2020");
        assert.equal(DateTimeUtils.dmcFormatDateIntervalFromUTC("2020-10-23T05:13:45Z", undefined), "", "Result is: ");
        assert.equal(DateTimeUtils.dmcFormatDateIntervalFromUTC("", "2020-10-23T05:13:45Z"), "", "Result is: ");
        assert.equal(DateTimeUtils.dmcFormatDateIntervalFromUTC("", ""), "", "Result is: ");
    });

    QUnit.test("dmcDateToUTCFormat", function (assert) {
        assert.equal(DateTimeUtils.dmcDateToUTCFormat("2021/10/18","US/Central"), "2021-10-18T05:00:00.000Z", 'Result is: "2021-10-18T05:00:00.000Z"');
        assert.equal(DateTimeUtils.dmcDateToUTCFormat("2020-10-23T05:13:45","US/Central"), "2020-10-23T10:13:45.000Z", 'Result is: "2020-10-23T10:13:45.000Z"');
        assert.equal(DateTimeUtils.dmcDateToUTCFormat(new Date("2020-10-23T05:13:45"),"US/Central"), "2020-10-23T10:13:45.000Z", 'Result is: "2020-10-23T10:13:45.000Z"');
        assert.equal(DateTimeUtils.dmcDateToUTCFormat("2021-11-01T14:52:47","US/Central"), "2021-11-01T19:52:47.000Z", 'Result is: "2021-11-01T19:52:47.000Z"');
        assert.equal(DateTimeUtils.dmcDateToUTCFormat("","US/Central"), "Invalid date", 'Result is: "Invalid date"');
        assert.equal(DateTimeUtils.dmcDateToUTCFormat("abc","US/Central"), "Invalid date", 'Result is: "Invalid date"');
        //Plant Timezone being set in PlantSettings and test cases for same
        PlantSettings.setTimeZone("Europe/Berlin");
        assert.equal(DateTimeUtils.dmcDateToUTCFormat("2021/10/18",undefined), "2021-10-17T22:00:00.000Z", 'Result is: "2021-10-17T22:00:00.000Z"');
        assert.equal(DateTimeUtils.dmcDateToUTCFormat("2021/10/18",""), "2021-10-17T22:00:00.000Z", 'Result is: "2021-10-17T22:00:00.000Z"');
        assert.equal(DateTimeUtils.dmcDateToUTCFormat("",""), "Invalid date", 'Result is: "Invalid date"');
    });

    QUnit.test("dmcDateAddTime - EN", function (assert) {
        sap.ui.getCore().getConfiguration().setLanguage('en');
        assert.equal(DateTimeUtils.dmcDateAddTime(new Date("2021/10/18"),10,"s"), "Oct 18, 2021, 12:00:10 AM", 'Result is: "Oct 18, 2021, 12:00:10 AM"');
        assert.equal(DateTimeUtils.dmcDateAddTime("Oct 21, 2020, 14:43:50",10,"s"), "Oct 21, 2020, 2:44:00 PM", 'Result is: "Oct 21, 2020, 2:44:00 PM"');
        assert.equal(DateTimeUtils.dmcDateAddTime("Oct 21, 2020, 14:43:50",10,"m"), "Oct 21, 2020, 2:53:50 PM", 'Result is: "Oct 21, 2020, 2:53:50 PM"');
        assert.equal(DateTimeUtils.dmcDateAddTime("Oct 21, 2020, 14:43:50",10,"h"), "Oct 22, 2020, 12:43:50 AM", 'Result is: "Oct 22, 2020, 12:43:50 AM"');
        assert.equal(DateTimeUtils.dmcDateAddTime("Oct 23, 2020, 10:43:50 AM",10,"s"), "Oct 23, 2020, 10:44:00 AM", 'Result is: "Oct 23, 2020, 10:44:00 AM"');
        assert.equal(DateTimeUtils.dmcDateAddTime("Oct 23, 2020, 10:43:50 AM",10,"m"), "Oct 23, 2020, 10:53:50 AM", 'Result is: "Oct 23, 2020, 10:53:50 AM"');
        assert.equal(DateTimeUtils.dmcDateAddTime("Oct 23, 2020, 10:43:50 AM",10,"h"), "Oct 23, 2020, 8:43:50 PM", 'Result is: "Oct 23, 2020, 8:43:50 PM"');
        assert.equal(DateTimeUtils.dmcDateAddTime("",10,"s"), "", 'Result is: ""');
        assert.equal(DateTimeUtils.dmcDateAddTime("Oct 23, 2020, 10:43:50 AM","","s"), "Oct 23, 2020, 10:43:50 AM", 'Result is: "Oct 23, 2020, 10:43:50 AM"');
        assert.equal(DateTimeUtils.dmcDateAddTime("Oct 23, 2020, 10:43:50 AM",10,""), "Oct 23, 2020, 10:43:50 AM", 'Result is: "Oct 23, 2020, 10:43:50 AM"');
        assert.equal(DateTimeUtils.dmcDateAddTime("Oct 23, 2020, 10:43:50 AM",10,"s"), "Oct 23, 2020, 10:44:00 AM", 'Result is: "Oct 23, 2020, 10:44:00 AM"');
        assert.equal(DateTimeUtils.dmcDateAddTime("Oct 23, 2020, 10:43:50 AM",10,"s"), "Oct 23, 2020, 10:44:00 AM", 'Result is: "Oct 23, 2020, 10:44:00 AM"');
        assert.equal(DateTimeUtils.dmcDateAddTime("Oct 23, 2020, 10:43:50 AM",1,"d"), "Oct 24, 2020, 10:43:50 AM", 'Result is: "Oct 24, 2020, 10:43:50 AM"');
        assert.equal(DateTimeUtils.dmcDateAddTime("Oct 23, 2020, 10:43:50 AM",1,"w"), "Oct 30, 2020, 10:43:50 AM", 'Result is: "Oct 30, 2020, 10:43:50 AM"');
        assert.equal(DateTimeUtils.dmcDateAddTime("Oct 23, 2020, 10:43:50 AM",1,"M"), "Nov 23, 2020, 10:43:50 AM", 'Result is: "Nov 23, 2020, 10:43:50 AM"');
        assert.equal(DateTimeUtils.dmcDateAddTime("Oct 23, 2020, 10:43:50 AM",undefined,undefined), "Oct 23, 2020, 10:43:50 AM", 'Result is: "Oct 23, 2020, 10:43:50 AM"');
    });

    QUnit.test("dmcDateAddTime - DE", function (assert) {
        sap.ui.getCore().getConfiguration().setLanguage('de');
        assert.equal(DateTimeUtils.dmcDateAddTime("23.10.2020, 10:44:00",10,"s"), "23.10.2020, 10:44:10", 'Result is: "23.10.2020, 10:44:10"');
        assert.equal(DateTimeUtils.dmcDateAddTime("23.10.2020, 14:43:50",10,"s"), "23.10.2020, 14:44:00", 'Result is: "23.10.2020, 14:44:00"');
        assert.equal(DateTimeUtils.dmcDateAddTime("23.10.2020, 20:43:50",10,"m"), "23.10.2020, 20:53:50", 'Result is: "23.10.2020, 20:53:50"');
        assert.equal(DateTimeUtils.dmcDateAddTime("23.10.2020, 15:43:50",10,"h"), "24.10.2020, 01:43:50", 'Result is: "24.10.2020, 01:43:50"');
        assert.equal(DateTimeUtils.dmcDateAddTime(new Date("2021/10/18"),10,"s"), "18.10.2021, 00:00:10", 'Result is: "18.10.2021, 00:00:10"');
        assert.equal(DateTimeUtils.dmcDateAddTime("",10,"s"), "", 'Result is: ""');
        assert.equal(DateTimeUtils.dmcDateAddTime("23.10.2020, 10:43:50","","s"), "23.10.2020, 10:43:50", 'Result is: "23.10.2020, 10:43:50"');
        assert.equal(DateTimeUtils.dmcDateAddTime("03.12.2020, 10:43:50",10,""), "03.12.2020, 10:43:50", 'Result is: "03.12.2020, 10:43:50"');
        assert.equal(DateTimeUtils.dmcDateAddTime("Oct 23, 2020, 10:43:50 AM",1,"d"), "24.10.2020, 10:43:50", 'Result is: "24.10.2020, 10:43:50"');
        assert.equal(DateTimeUtils.dmcDateAddTime("Oct 23, 2020, 10:43:50 AM",1,"w"), "30.10.2020, 10:43:50", 'Result is: "30.10.2020, 10:43:50"');
        assert.equal(DateTimeUtils.dmcDateAddTime("Oct 23, 2020, 10:43:50 AM",1,"M"), "23.11.2020, 10:43:50", 'Result is: "23.11.2020, 10:43:50"');
        assert.equal(DateTimeUtils.dmcDateAddTime("23.10.2020, 10:43:50",undefined,undefined), "23.10.2020, 10:43:50", 'Result is: "23.10.2020, 10:43:50"');
    });

    QUnit.test("dmcParseDate - EN", function (assert) {
        assert.deepEqual(DateTimeUtils.dmcParseDate("2020-10-23T05:13:45"), new Date("2020-10-23T05:13:45"), 'Result Matched');
        sap.ui.getCore().getConfiguration().setLanguage('en');
        assert.deepEqual(DateTimeUtils.dmcParseDate("10/23/20", DMCConstants.customStyleOptions.short), new Date("2020-10-23T00:00:00"), 'Result Matched');
        assert.deepEqual(DateTimeUtils.dmcParseDate("October 23, 2020", DMCConstants.customStyleOptions.long), new Date("2020-10-23T00:00:00"), 'Result Matched');
        assert.deepEqual(DateTimeUtils.dmcParseDate("Friday, October 23, 2020"), new Date("2020-10-23T00:00:00"), 'Result Matched');
        assert.deepEqual(DateTimeUtils.dmcParseDate("Jan 29, 2022, 7:31:19 PM"), new Date("2022-01-29T19:31:19"), 'Result Matched');
    });

    QUnit.test("dmcParseDate - DE", function (assert) {
        sap.ui.getCore().getConfiguration().setLanguage('de');
        assert.deepEqual(DateTimeUtils.dmcParseDate("23.10.2020"), new Date("2020-10-23T00:00:00"), 'Result Matched');
        assert.deepEqual(DateTimeUtils.dmcParseDate("23.10.20", DMCConstants.customStyleOptions.short), new Date("2020-10-23T00:00:00"), 'Result Matched');
        assert.deepEqual(DateTimeUtils.dmcParseDate("23. Oktober 2020", DMCConstants.customStyleOptions.long), new Date("2020-10-23T00:00:00"), 'Result Matched');
        assert.deepEqual(DateTimeUtils.dmcParseDate("Freitag, 23. Oktober 2020", DMCConstants.customStyleOptions.full), new Date("2020-10-23T00:00:00"), 'Result Matched');
        assert.deepEqual(DateTimeUtils.dmcParseDate("29.01.2022"), new Date("2022-01-29T00:00:00"), 'Result Matched');
    });

    QUnit.test("dmcParseDateTime - EN", function (assert) {
        assert.deepEqual(DateTimeUtils.dmcParseDateTime("2020-10-23T05:13:45"), new Date("2020-10-23T05:13:45"), 'Result Matched');
        sap.ui.getCore().getConfiguration().setLanguage('en');
        assert.deepEqual(DateTimeUtils.dmcParseDateTime("10/23/20, 7:13 AM", DMCConstants.customStyleOptions.short), new Date("2020-10-23T07:13:00"), 'Result Matched');
        assert.deepEqual(DateTimeUtils.dmcParseDateTime("October 23, 2020 at 7:13:45 AM", DMCConstants.customStyleOptions.long), new Date("2020-10-23T07:13:45"), 'Result Matched');
        assert.deepEqual(DateTimeUtils.dmcParseDateTime("Friday, October 23, 2020 at 7:13:45 AM", DMCConstants.customStyleOptions.full), new Date("2020-10-23T07:13:45"), 'Result Matched');
    });

    QUnit.test("dmcParseDateTime - DE", function (assert) {
        sap.ui.getCore().getConfiguration().setLanguage('de');
        assert.deepEqual(DateTimeUtils.dmcParseDateTime("23.10.20, 07:13", DMCConstants.customStyleOptions.short), new Date("2020-10-23T07:13:00"), 'Result Matched');
        assert.deepEqual(DateTimeUtils.dmcParseDateTime("29.01.2022, 19:31:19"), new Date("2022-01-29T19:31:19"), 'Result Matched');
        assert.deepEqual(DateTimeUtils.dmcParseDateTime("23. Oktober 2020 um 07:13:45", DMCConstants.customStyleOptions.long), new Date("2020-10-23T07:13:45"), 'Result Matched');
        assert.deepEqual(DateTimeUtils.dmcParseDateTime("Freitag, 23. Oktober 2020 um 07:13:45", DMCConstants.customStyleOptions.full), new Date("2020-10-23T07:13:45"), 'Result Matched');
    });

    QUnit.test("dmcDateTimeStartOf", function (assert) {
        var date = new Date("2021-12-07T05:13:45");
        assert.deepEqual(DateTimeUtils.dmcDateTimeStartOf(date, "day"), new Date("2021-12-07T00:00:00"), 'Result Matched');
        assert.deepEqual(DateTimeUtils.dmcDateTimeStartOf(date, "week"), new Date("2021-12-05T00:00:00"), 'Result Matched');
        assert.deepEqual(DateTimeUtils.dmcDateTimeStartOf(date, "month"), new Date("2021-12-01T00:00:00"), 'Result Matched');
    });

    QUnit.test("dmcDateTimeEndOf", function (assert) {
        var date = new Date("2021-12-07T05:13:45");
        assert.deepEqual(DateTimeUtils.dmcDateTimeEndOf(date, "day"), new Date("2021-12-07T23:59:59.999"), 'Result Matched');
        assert.deepEqual(DateTimeUtils.dmcDateTimeEndOf(date, "week"), new Date("2021-12-11T23:59:59.999"), 'Result Matched');
        assert.deepEqual(DateTimeUtils.dmcDateTimeEndOf(date, "month"), new Date("2021-12-31T23:59:59.999"), 'Result Matched');
    });
});
