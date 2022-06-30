sap.ui.define([
    "sap/dm/dme/formatter/NumberFormatter"
], function(NumberFormatter) {
    "use strict";
    
    QUnit.module("NumberFormatter", {
        
    });

    QUnit.test("formatFloatNumber", function (assert) {
        assert.equal(NumberFormatter.formatFloatNumber(""), "", "Returned ''");
        assert.equal(NumberFormatter.formatFloatNumber(null), "", "Returned ''");
        assert.equal(NumberFormatter.formatFloatNumber("0"), "0", "Returned '0'");
        assert.equal(NumberFormatter.formatFloatNumber("0.0"), "0", "Returned '0'");
        assert.equal(NumberFormatter.formatFloatNumber("1.50"), "1.500", "Returned 1.500");
        assert.equal(NumberFormatter.formatFloatNumber("1.0000"), "1", "Returned 1");
        assert.equal(NumberFormatter.formatFloatNumber("100.000"), "100", "Returned 100");
        assert.equal(NumberFormatter.formatFloatNumber("1.0010"), "1.001", "Returned 1.001");
        assert.equal(NumberFormatter.formatFloatNumber("10000"), "10,000", "Returned 10,000");
    });

    QUnit.test("showValueWithUom UOM(CCM)", function (assert) {
        assert.equal(NumberFormatter.showValueWithUom("0"), "0", "Returned '0'");
        assert.equal(NumberFormatter.showValueWithUom("0.0"), "0", "Returned '0'");
        assert.equal(NumberFormatter.showValueWithUom("1.50"), "1.500", "Returned 1.500");
        assert.equal(NumberFormatter.showValueWithUom("1.0000"), "1", "Returned 1");

        assert.equal(NumberFormatter.showValueWithUom("0","CCM"), "0"+" CCM", "Returned '0 CCM'");
        assert.equal(NumberFormatter.showValueWithUom("0.0","CCM"), "0"+" CCM", "Returned '0 CCM'");
        assert.equal(NumberFormatter.showValueWithUom("1.50","CCM"), "1.500"+" CCM", "Returned 1.500 CCM");
        assert.equal(NumberFormatter.showValueWithUom("1.0000","CCM"), "1"+" CCM", "Returned 1 CCM");
        assert.equal(NumberFormatter.showValueWithUom("10000","CCM"), "10,000"+" CCM", "Returned 10,000 CCM");
    });

    QUnit.test("dmcLocaleIntNumberFormatter-EN", function (assert) {
        sap.ui.getCore().getConfiguration().setLanguage('en');
        assert.equal(NumberFormatter.dmcLocaleIntNumberFormatter(""), "", "Returned ''");
        assert.equal(NumberFormatter.dmcLocaleIntNumberFormatter("0.000000"), "0", "Returned '0'");
        assert.equal(NumberFormatter.dmcLocaleIntNumberFormatter(null), "", "Returned ''");
        assert.equal(NumberFormatter.dmcLocaleIntNumberFormatter(12), "12", "Returned '12'");
        assert.equal(NumberFormatter.dmcLocaleIntNumberFormatter(12000), "12,000", "Returned '12'");
        assert.equal(NumberFormatter.dmcLocaleIntNumberFormatter(-12), "-12", "Returned '-12'");
    });

    QUnit.test("dmcLocaleIntNumberFormatter-DE", function (assert) {
        sap.ui.getCore().getConfiguration().setLanguage('de');
        assert.equal(NumberFormatter.dmcLocaleIntNumberFormatter(""), "", "Returned ''");
        assert.equal(NumberFormatter.dmcLocaleIntNumberFormatter("0.000000"), "0", "Returned '0'");
        assert.equal(NumberFormatter.dmcLocaleIntNumberFormatter(null), "", "Returned ''");
        assert.equal(NumberFormatter.dmcLocaleIntNumberFormatter("100.00"), "100","Returned 100");
        assert.equal(NumberFormatter.dmcLocaleIntNumberFormatter("1000.00"), "1.000","Returned 1.000");
        assert.equal(NumberFormatter.dmcLocaleIntNumberFormatter(12), "12", "Returned '12'");
        assert.equal(NumberFormatter.dmcLocaleIntNumberFormatter(-12), "-12", "Returned '12'");
    });

    QUnit.test("dmcLocaleFloatNumberFormatter-EN", function (assert) {
        sap.ui.getCore().getConfiguration().setLanguage('en');
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter(""), "", "Returned ''");
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter("0.000000"), "0.000", "Returned '0.000'");
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter(null), "", "Returned ''");
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter("1000.345"), "1,000.345", "Returned '1,000.345'");
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter("111.11"), "111.110", "Returned '111.110'");
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter(111.1111), "111.111", "Returned '111.111'");
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter(11111.1111), "11,111.111", "Returned '11,111.111'");
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter(-11111.1111), "-11,111.111", "Returned '-11,111.111'");
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter(12), "12.000", "Returned '12.000'");
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter("1.2.4,456.546,456"), "", "Returned ''");
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter("64.123456"), "64.123", "Returned '64.123'");
        var oOptions = {
            maxFractionDigits: 2,
            minFractionDigits: 1
        };
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter("0.000000", oOptions), "0.00", "Returned '0.00'");
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter("0", oOptions), "0.0", "Returned '0.0'");
        // When maxFractionDigits is less than minFractionDigits, then max = min
        oOptions = {
            maxFractionDigits: 2,
            minFractionDigits: 3
        };
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter("0.000000", oOptions), "0.000", "Returned '0.000'");
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter("0", oOptions), "0.000", "Returned '0.000'");

        oOptions = {
            maxFractionDigits: 0,
            minFractionDigits: 0
        };
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter("0.000000", oOptions), "0", "Returned '0'");
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter("0", oOptions), "0", "Returned '0'");

        oOptions = {
            maxFractionDigits: undefined,
            minFractionDigits: undefined
        };
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter("0.000000", oOptions), "0.000", "Returned '0.000'");
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter("0", oOptions), "0.000", "Returned '0.000'");
    });

    QUnit.test("dmcLocaleFloatNumberFormatter-DE", function (assert) {
        sap.ui.getCore().getConfiguration().setLanguage('de');
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter(""), "", "Returned ''");
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter("0.000000"), "0,000", "Returned '0,000'");
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter(null), "", "Returned ''");
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter("11.00"), "11,000","Returned 11,000");
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter(1111.111), "1.111,111","Returned 1.111,111");
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter(-1111.111), "-1.111,111","Returned -1.111,111");
        var options = {
            maxFractionDigits : 2,
            minFractionDigits : 1
        };
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter("0.000000", options), "0,00", "Returned '0,00'");
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter("0", options), "0,0", "Returned '0,0'");
        //When maxFractionDigits is less than minFractionDigits, then max = min
        var options1 = {
            maxFractionDigits : 2,
            minFractionDigits : 3
        }
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter("0.000000", options1), "0,000", "Returned '0,000'");
        assert.equal(NumberFormatter.dmcLocaleFloatNumberFormatter("0", options1), "0,000", "Returned '0,000'");
    });

    QUnit.test("dmcLocaleNumberParser-EN", function (assert) {
        sap.ui.getCore().getConfiguration().setLanguage('en');
        assert.equal(NumberFormatter.dmcLocaleNumberParser(""), "", "Returned ''");
        assert.equal(NumberFormatter.dmcLocaleNumberParser("0.000000"), "0.000000", "Returned '0.000000'");
        assert.equal(NumberFormatter.dmcLocaleNumberParser(null), "", "Returned ''");
        assert.equal(NumberFormatter.dmcLocaleNumberParser("1,000.345"), "1000.345", "Returned '1000.345'");
        assert.equal(NumberFormatter.dmcLocaleNumberParser("123.12"), "123.12", "Returned '123.12'");
        assert.equal(NumberFormatter.dmcLocaleNumberParser(123.456), "123.456", "Returned '123.456'");
        assert.equal(NumberFormatter.dmcLocaleNumberParser(12), "12", "Returned '12'");
        assert.equal(NumberFormatter.dmcLocaleNumberParser("1.2.4,456.546,456"), "", "Returned ''");
        assert.equal(NumberFormatter.dmcLocaleNumberParser("0.123456789"), "0.123456789", "Returned '0.123456789'");
    });

    QUnit.test("dmcLocaleNumberParser-DE", function (assert) {
        sap.ui.getCore().getConfiguration().setLanguage('de');
        assert.equal(NumberFormatter.dmcLocaleNumberParser(""), "", "Returned ''");
        assert.equal(NumberFormatter.dmcLocaleNumberParser("0.000000"), "", "Returned ''");
        assert.equal(NumberFormatter.dmcLocaleNumberParser(null), "", "Returned ''");
        assert.equal(NumberFormatter.dmcLocaleNumberParser("1,50"), "1.50", "Returned 1.50");
        assert.equal(NumberFormatter.dmcLocaleNumberParser("100.000"), "100000", "Returned 100000");
        assert.equal(NumberFormatter.dmcLocaleNumberParser("100.000,123"), "100000.123","Returned 100000.123");
        assert.equal(NumberFormatter.dmcLocaleNumberParser("0,123456789"), "0.123456789", "Returned '0.123456789'");
    });

    QUnit.test("dmcLocaleQuantityFormatterDisplay-EN", function (assert) {
        sap.ui.getCore().getConfiguration().setLanguage('en');
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay(""), "", "Returned ''");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay("", "PC"), "", "Returned ''");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay("0.000000"), "0.000", "Returned '0.000'");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay("0.000000", "EA"), "0", "Returned '0'");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay("0.000000", "KG"), "0.000", "Returned '0.000'");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay(null), "", "Returned ''");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay(null, "EA"), "", "Returned ''");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay("123.12", "PC"), "", "Returned ''");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay("123.12", "KG"), "123.120", "Returned '123.120'");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay(123.456, "EA"), "", "Returned ''");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay(123.456, "KG"), "123.456", "Returned '123.456'");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay(12, "EA"), "12", "Returned '12'");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay(12, "KG"), "12.000", "Returned '12.000'");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay("64.123456", "KG"), "64.123", "Returned '64.123'");
        var options = {
            maxFractionDigits : 2,
            minFractionDigits : 1
        };
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay("64.123456", "KG", options), "64.12", "Returned '64.12'");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay("64", "KG", options), "64.0", "Returned '64.0'");
        //When maxFractionDigits is less than minFractionDigits, then max = min
        var options1 = {
            maxFractionDigits : 2,
            minFractionDigits : 3
        };
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay("64.123456", "KG", options1), "64.123", "Returned '64.123'");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay("64", "KG", options1), "64.000", "Returned '64.000'");
    });

    QUnit.test("dmcLocaleQuantityFormatterDisplay-DE", function (assert) {
        sap.ui.getCore().getConfiguration().setLanguage('de');
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay(""), "", "Returned ''");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay("", "PC"), "", "Returned ''");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay("0.000000"), "0,000", "Returned '0,000'");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay("0.000000", "EA"), "0", "Returned '0'");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay("0.000000", "KG"), "0,000", "Returned '0,000'");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay(null), "", "Returned ''");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay(null, "EA"), "", "Returned ''");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay("10.00", "EA"), "10","Returned 10");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay("10.00", "KG"), "10,000","Returned 10,000");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay("12345678.000000", "EA"), "12.345.678", "Returned '12.345.678'");
        var options = {
            maxFractionDigits : 2,
            minFractionDigits : 1
        };
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay("64.123456", "KG", options), "64,12", "Returned '64,12'");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay("64", "KG", options), "64,0", "Returned '64,0'");
        //When maxFractionDigits is less than minFractionDigits, then max = min
        var options1 = {
            maxFractionDigits : 2,
            minFractionDigits : 3
        };
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay("64.123456", "KG", options1), "64,123", "Returned '64,123'");
        assert.equal(NumberFormatter.dmcLocaleQuantityFormatterDisplay("64", "KG", options1), "64,000", "Returned '64,000'");
    });

    QUnit.test("decimal constraints", function(assert) {
        var result = { "precision": 14, "scale": 3 };
        assert.deepEqual(NumberFormatter.dmcLocaleDecimalConstraints(), result, "Decimal Constraints matched");

    });

    QUnit.test("Integer constraints", function(assert) {
        var result = { "precision": 14, "scale": 0 };
        assert.deepEqual(NumberFormatter.dmcLocaleIntegerConstraints(), result, "Integer Constraints matched");

    });
});
