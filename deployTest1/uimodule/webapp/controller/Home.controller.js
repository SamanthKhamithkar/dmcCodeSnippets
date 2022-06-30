sap.ui.define([
  "sap/dm/poc/featureflag/controller/Base.controller",
  "sap/ui/core/format/NumberFormat",
  "sap/ui/model/json/JSONModel"
], (BaseController, NumberFormat, JSONModel) => {
  return BaseController.extend('sap.dm.poc.featureflag.controller.Home', {
    onInit: function() {
      var oData = {"value": 1231223.13};
      var oViewModel = new JSONModel(oData);
      oViewModel.setDefaultBindingMode("OneWay");
      this.getView().setModel(oViewModel,"viewModel");

      this.oFloatNumberFormat = NumberFormat.getFloatInstance({
          maxFractionDigits: 3,
          minFractionDigits : 3,
          groupingEnabled: true,
          roundingMode: "HALF_CEILING",
      } , sap.ui.getCore().getConfiguration().getLocale());

      this.oFloatNumberFormat_Short = NumberFormat.getFloatInstance({
          maxFractionDigits: 3,
          minFractionDigits : 3,
          groupingEnabled: true,
          roundingMode: "HALF_CEILING",
          style: "short",
      } , sap.ui.getCore().getConfiguration().getLocale());

      var de = new sap.ui.core.Locale("de");

      this.oFloatNumberFormat_De = NumberFormat.getFloatInstance({
          maxFractionDigits: 3,
          minFractionDigits : 3,
          groupingEnabled: true,
          roundingMode: "HALF_CEILING",
      } , de);

      this.oFloatNumberFormat_De_Long = NumberFormat.getFloatInstance({
          maxFractionDigits: 3,
          minFractionDigits : 3,
          groupingEnabled: true,
          style: "long",
          roundingMode: "HALF_CEILING",
      } , de);

      var us = new sap.ui.core.Locale("en_US");

      this.oFloatNumberFormat_US = NumberFormat.getFloatInstance({
          maxFractionDigits: 3,
          minFractionDigits : 3,
          groupingEnabled: true,
          roundingMode: "HALF_CEILING",
      } , us);

      var sv = new sap.ui.core.Locale("sv");

      this.oFloatNumberFormat_SV = NumberFormat.getFloatInstance({
          maxFractionDigits: 3,
          minFractionDigits : 3,
          groupingEnabled: true,
          roundingMode: "HALF_CEILING",
      } , sv);
  },

  floatFormat: function(evt){
      var oldValue = evt.getSource().data("customDataAttr");
      var value = evt.getSource().getValue();
      console.log(`Old Value:${oldValue}`);
      console.log(`Ind:${this.oFloatNumberFormat.format(value)}`);
      console.log(`Ind Parsed:${this.oFloatNumberFormat.parse(value)}`);
      console.log(`German:${this.oFloatNumberFormat_De.format(value)}`);
      console.log(`German Parsed:${this.oFloatNumberFormat_De.parse(value)}`);
      console.log(`US:${this.oFloatNumberFormat_US.format(value)}`);
      console.log(`US Parse:${this.oFloatNumberFormat_US.parse(value)}`);
      console.log(`SV Parse:${this.oFloatNumberFormat_SV.parse(value)}`);

    //  this.getView().byId("idText1").setText(`Old Value : ${oldValue}`);
      this.getView().byId("idText2").setText(`Ind : ${this.oFloatNumberFormat.format(value)}`);
      this.getView().byId("idText3").setText(`Ind Parsed : ${this.oFloatNumberFormat.parse(value)}`);
      this.getView().byId("idText4").setText(`German : ${this.oFloatNumberFormat_De.format(value)}`);
      this.getView().byId("idText5").setText(`German Parsed : ${this.oFloatNumberFormat_De.parse(value)}`);
      this.getView().byId("idText6").setText(`US : ${this.oFloatNumberFormat_US.format(value)}`);
      this.getView().byId("idText7").setText(`US Parsed : ${this.oFloatNumberFormat_US.parse(value)}`);
      this.getView().byId("idText8").setText(`SV Parsed : ${this.oFloatNumberFormat_SV.parse(value)}`);

      if(this.oFloatNumberFormat_US.format(value)){
        console.log("Success");
      } else {
        console.error("Error");
      }
      // return this.oFloatNumberFormat.format(value);
  },

  floatFormatter: function(value){
      var oFloatNumberFormat1 = NumberFormat.getFloatInstance({
          maxFractionDigits: 3,
          minFractionDigits : 3,
          groupingEnabled: true,
          roundingMode: "HALF_CEILING",
      } , sap.ui.getCore().getConfiguration().getLocale());

      return oFloatNumberFormat1.format(value);
  },

    /**
     * Press event handler for INTEGRTR logo
     */
    integrtrLogoPress() {
      window.open('https://www.integrtr.com', '_blank');
    },

    /**
     * Press event handler for GitHub logo
     */
    githubLogoPress() {
      window.open('https://github.com/integrtr/ui5-boilerplate', '_blank');
    },
  });
});
