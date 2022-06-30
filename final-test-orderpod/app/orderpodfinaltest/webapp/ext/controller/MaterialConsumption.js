sap.ui.define([
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
],
	function (MessageToast, JSONModel){
		"use strict";
		return {
			demoFunction: function(oEvent) {
				MessageToast.show('Button Pressed');
			},

			onLiveChange: function(oEvent){
				MessageToast.show('Data entered'+oEvent.getSource().getValue());
			},

			onEdit: function(oEvent){
				var oJSONModel = new JSONModel({
					editable : true
				});
				this._controller.getView().setModel(oJSONModel,"editModel");
				MessageToast.show('Edit Button Pressed');
			}
		};
	});