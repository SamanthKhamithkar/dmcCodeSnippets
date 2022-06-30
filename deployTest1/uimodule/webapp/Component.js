sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
], function(UIComponent, JSONModel) {
  "use strict";

  return UIComponent.extend('sap.dm.poc.featureflag.Component', {
    metadata: {
      manifest: 'json',
      config: {
				fullWidth: true
			}
    },

    /**
     * The component is initialized by UI5 automatically during the
     * startup of the app and calls the init method once.
     * @public
     * @override
     */
    init: function() {
      var oModel = new JSONModel({
				"name": this.getMetadata().getComponentName()
			});
			sap.ui.getCore().setModel(oModel, "ComponentData");
      // Initialize UI component
      // eslint-disable-next-line prefer-rest-params
      UIComponent.prototype.init.apply(this, arguments);

      // create the views based on the url/hash
      this.getRouter().initialize();
    },
  });
});
