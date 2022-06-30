sap.ui.define([
    "sap/dm/dme/types/QuantityType"
], function (QuantityType) {
    "use strict";

    var sandbox = sinon.createSandbox();

    QUnit.module("Quantity Type", function (hooks) {
        hooks.beforeEach(function () {
            this.QuantityType = new QuantityType();
        });

        hooks.afterEach(function () {
            this.QuantityType.destroy();
            sandbox.restore();
        });

        QUnit.test("Test formatValue function of QuantityType - Locale - EN", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('en');

            assert.equal(this.QuantityType.formatValue(["",""]), "", "result  ''");
            assert.equal(this.QuantityType.formatValue(["","EA"]), "", "result  ''");
            assert.equal(this.QuantityType.formatValue([undefined,"EA"]), "", "result  ''");
            assert.equal(this.QuantityType.formatValue(["0","EA"]), "0", "result  '0'");
            assert.equal(this.QuantityType.formatValue(["0",""]), "0.000", "result  '0.000'");
            assert.equal(this.QuantityType.formatValue(["0",undefined]), "0.000", "result  '0.000'");
            assert.equal(this.QuantityType.formatValue(["0","KG"]), "0.000", "result  '0.000'");
            assert.equal(this.QuantityType.formatValue([123456,"EA"]), "123,456", "result  '123,456'");
            assert.equal(this.QuantityType.formatValue([123456.456789,"KG"]), "123,456.456", "result  '123,456.456'");
            assert.equal(this.QuantityType.formatValue(["123456","EA"]), "123,456", "result  '123,456'");
            assert.equal(this.QuantityType.formatValue(["123456","KG"]), "123,456.000", "result  '123,456.000'");
            assert.equal(this.QuantityType.formatValue(["123456.12","KG"]), "123,456.120", "result  '123,456.120'");
            assert.equal(this.QuantityType.formatValue([null,"EA"]), "", "result  ''");
            assert.deepEqual(this.QuantityType.formatValue([0,"EA"]), "0", "result  '0'");

        });

        QUnit.test("Test formatValue function of QuantityType - Locale - DE", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('de');

            assert.equal(this.QuantityType.formatValue(["",""]), "", "result  ''");
            assert.equal(this.QuantityType.formatValue(["","EA"]), "", "result  ''");
            assert.equal(this.QuantityType.formatValue([undefined,"EA"]), "", "result  ''");
            assert.equal(this.QuantityType.formatValue(["0","EA"]), "0", "result  '0'");
            assert.equal(this.QuantityType.formatValue(["0",""]), "0,000", "result  '0,000'");
            assert.equal(this.QuantityType.formatValue(["0",undefined]), "0,000", "result  '0,000'");
            assert.equal(this.QuantityType.formatValue(["0","KG"]), "0,000", "result  '0,000'");
            assert.equal(this.QuantityType.formatValue([123456,"EA"]), "123.456", "result  '123.456'");
            assert.equal(this.QuantityType.formatValue(["123456","EA"]), "123.456", "result  '123.456'");
            assert.equal(this.QuantityType.formatValue(["123456","KG"]), "123.456,000", "result  '123.456,000'");
            assert.equal(this.QuantityType.formatValue([null,"EA"]), "", "result  ''");
            assert.deepEqual(this.QuantityType.formatValue([0,"EA"]), "0", "result  '0'");

        });

        QUnit.test("Test parseValue function of QuantityType - Locale - EN", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('en');
            assert.deepEqual(this.QuantityType.parseValue("123,123.123","string",["123","EA"]), ['123123.123','EA'], "result:  ['123123.123','EA']");
			assert.deepEqual(this.QuantityType.parseValue("","string",["","EA"]), ['','EA'], "result:  ['','EA']");
			assert.deepEqual(this.QuantityType.parseValue("","string",["",""]), ['',''], "result:  ['','']");
            assert.throws(
                function () {
                  this.QuantityType.parseValue("123,456.789.764","string",["123,456.789.764","EA"]);
                },
                {
                  message: "'123,456.789.764' - Enter a valid number",
                  name: "ParseException",
                },
                "Error thrown"
              );

            assert.throws(
                function () {
                    this.QuantityType.parseValue("null","string",["null","EA"]);
                },
                {
                    message: "'null' - Enter a valid number",
                    name: "ParseException",
                },
                "Error thrown"
            );

            assert.throws(
              function () {
                this.QuantityType.parseValue(123456.456789, "string",[123456.456789,"KG"]);
              },
              {
                message: "'123456.456789' - Decimal cannot be greater than the maximum decimal limit : 3",
                name: "ParseException",
              },
              "Error thrown"
            );

            assert.throws(
              function () {
                this.QuantityType.parseValue("12,34,56.456789", "string",["12,34,56.456789","KG"]);
              },
              {
                message: "'12,34,56.456789' - Decimal cannot be greater than the maximum decimal limit : 3",
                name: "ParseException",
              },
              "Error thrown"
            );

            assert.throws(
                function () {
                  this.QuantityType.parseValue("-123.23", "string",["-123.23","EA"]);
                },
                {
                  message: "'-123.23' - Quantity must be greater than 0 and less than 11 integer digits",
                  name: "ParseException",
                },
                "Error thrown"
            );

            assert.throws(
                function () {
                  this.QuantityType.parseValue("123,123,123,123,123", "string",["123,123,123,123,123","EA"]);
                },
                {
                  message: "'123,123,123,123,123' - Quantity must be greater than 0 and less than 11 integer digits",
                  name: "ParseException",
                },
                "Error thrown"
            );
			assert.throws(
                function () {
                  this.QuantityType.parseValue("0", "string",["0","EA"]);
                },
                {
                  message: "'0' - Quantity must be greater than 0 and less than 11 integer digits",
                  name: "ParseException",
                },
                "Error thrown"
            );
        });

        QUnit.test("Test parseValue function of QuantityType - Locale - DE", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('de');
            assert.deepEqual(this.QuantityType.parseValue("123.123,123","string",["123","EA"]), ['123123.123','EA'], "result:  ['123123.123','EA']");

            assert.throws(
                function () {
                  this.QuantityType.parseValue("123.456,789,764","string",["123.456,789,764","EA"]);
                },
                {
                  message: "'123.456,789,764' - Enter a valid number",
                  name: "ParseException",
                },
                "Error thrown"
              );

            assert.throws(
                function () {
                    this.QuantityType.parseValue("null","string",["null","EA"]);
                },
                {
                    message: "'null' - Enter a valid number",
                    name: "ParseException",
                },
                "Error thrown"
            );

            assert.throws(
                function () {
                  this.QuantityType.parseValue("12.34.56,456789", "string",["12.34.56,456789","KG"]);
                },
                {
                  message: "'12.34.56,456789' - Decimal cannot be greater than the maximum decimal limit : 3",
                  name: "ParseException",
                },
                "Error thrown"
            );

          assert.throws(
              function () {
                this.QuantityType.parseValue("-123,23", "string",["-123,23","EA"]);
              },
              {
                message: "'-123,23' - Quantity must be greater than 0 and less than 11 integer digits",
                name: "ParseException",
              },
              "Error thrown"
          );

          assert.throws(
              function () {
                this.QuantityType.parseValue("123.123.123.123.123", "string",["123.123.123.123.123","EA"]);
              },
              {
                message: "'123.123.123.123.123' - Quantity must be greater than 0 and less than 11 integer digits",
                name: "ParseException",
              },
              "Error thrown"
          );

          assert.throws(
            function () {
              this.QuantityType.parseValue("12312312312312312312312313213", "string",["12312312312312312312312313213","EA"]);
            },
            {
              message: "'12312312312312312312312313213' - Quantity must be greater than 0 and less than 11 integer digits",
              name: "ParseException",
            },
            "Error thrown"
        );
        });

        QUnit.test("Test rawValue when user input is '123,456.456' - Locale - EN", function (assert) {
            sap.ui.getCore().getConfiguration().setLanguage('en');

            assert.equal(this.QuantityType.rawValue,"","result: ''");
            assert.deepEqual(this.QuantityType.parseValue("123,456.45","string",["123,456.456","EA"]), ['123456.45','EA'], "result:  ['123456.45','EA']");
            assert.equal(this.QuantityType.rawValue,"123,456.45","result: '123,456.45'");
			assert.equal(this.QuantityType.validateValue(["", "EA"]), true, "result: true");
			assert.equal(this.QuantityType.validateValue(["123456", "EA"]), true, "result: true");
            assert.throws(
                function () {
                  this.QuantityType.validateValue(["123456.45", "EA"]);
                },
                {
                  message: `'${this.QuantityType.rawValue}' - Decimals are not allowed for the current UOM`,
                  name: "ParseException",
                },
                "Error thrown"
            );
        });

        QUnit.test("Test rawValue when user input is '123.456,456' - Locale - DE", function (assert) {
          sap.ui.getCore().getConfiguration().setLanguage('de');

          assert.equal(this.QuantityType.rawValue,"","result: ''");
          assert.deepEqual(this.QuantityType.parseValue("123.456,45","string",["123.456,456","EA"]), ['123456.45','EA'], "result:  ['123456.45','EA']");
          assert.equal(this.QuantityType.rawValue,"123.456,45","result: '123.456,45'");
          assert.throws(
              function () {
                this.QuantityType.validateValue(["123456.45", "EA"]);
              },
              {
                message: `'${this.QuantityType.rawValue}' - Decimals are not allowed for the current UOM`,
                name: "ParseException",
              },
              "Error thrown"
          );
      });
    });
});
