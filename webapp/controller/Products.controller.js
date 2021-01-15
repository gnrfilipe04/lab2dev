sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, JSONModel, Filter, FilterOperator) {
	"use strict";
	return Controller.extend("ProductsLab2Dev.controller.Products", {
		
		
		onInit : function () {
			var oViewModel = new JSONModel({
				currency: "EUR"
			});
			
			this.getView().setModel(oViewModel, "view");
			
			sap.ui.core.BusyIndicator.show();
			
			fetch("/Northwind/Products?$format=json").then(function(response){
				return response.json();
			}).then(function(json){
				
				var oData = new JSONModel(json.d.results);
				
				oData.setSizeLimit(Infinity);
				
				this.getOwnerComponent().setModel(oData, "invoice");
				
				sap.ui.core.BusyIndicator.hide();
				
			}.bind(this));

		},
		onFilterInvoices : function (oEvent) {

			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
			}

			// filter binding
			var oList = this.byId("invoiceList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},
		
		onPress: function (oEvent) {
			var oItem = oEvent.getSource();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("detail", {
				invoicePath: window.encodeURIComponent(oItem.getBindingContext("invoice").getPath().substr(1))
			});
		}
		
		
	});
});