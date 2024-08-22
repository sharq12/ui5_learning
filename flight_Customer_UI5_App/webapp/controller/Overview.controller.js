sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/syncStyleClass",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    Controller,
    syncStyleClass,
    JSONModel,
    Filter,
    FilterOperator,
    MessageToast
  ) {
    "use strict";

    return Controller.extend("sap.training.exc.controller.Overview", {
      onInit: function () {
        var oModel = new JSONModel();
        oModel.setData({
          Form: "Form1",
          CustomerName: "Stark",
          Discount: "10",
          Street: "a21/32",
          PostCode: "110025",
          City: "New Delhi",
          Country: "India",
          Email: "rehanmfp35@gmail.com",
          Telephone: "9506678870",
        });
        // oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
        this.getView().setModel(oModel, "customer");
      },
      onSave: function () {
        // if (!this.pDialog) {
        //     this.pDialog = this.loadFragment({
        //         name: "sap.training.exc.view.Dialog"
        //     });
        //     this.pDialog.then(function (oDialog){
        //         syncStyleClass(this.getOwnerComponent().getContentDensityClass(), this.getView(), oDialog)
        //         return oDialog;
        //     }.bind(this));
        // }
        // this.pDialog.then(function (oDialog) {
        //     oDialog.open();
        // });
        let isShowMessage = false;
        const th = this;
        var oModelData = this.getView().getModel("customer").getData();
        var oResourceBundle = this.getView()
          .getModel("i18n")
          .getResourceBundle();
        if (oModelData.Discount === undefined) {
          oModelData.Discount = 0;
        }
        var oContext = this.byId("customerTable")
          .getBinding("items")
          .create({
            Form: oModelData.Form,
            CustomerName: oModelData.CustomerName,
            Discount: oModelData.Discount + "",
            Street: oModelData.Street,
            PostCode: oModelData.PostCode,
            City: oModelData.City,
            Country: oModelData.Country,
            Email: oModelData.Email,
            Telephone: oModelData.Telephone,
          });
        oContext.created().then(function () {
          // MessageToast.show(`Customer ${oModelData.CustomerName} created`);
          isShowMessage = true;
          th.showMessage(isShowMessage, th);
        });
      },
      showMessage: function (isShowMessage, th) {
        if (isShowMessage === true) {
          if (!th.pDialog) {
            th.pDialog = th.loadFragment({
              name: "sap.training.exc.view.Dialog",
            });
            th.pDialog.then(
              function (oDialog) {
                syncStyleClass(
                  th.getOwnerComponent().getContentDensityClass(),
                  th.getView(),
                  oDialog
                );
                return oDialog;
              }.bind(th)
            );
          }
          th.pDialog.then(function (oDialog) {
            oDialog.open();
          });
        }
      },
      onCloseDialog: function () {
        this.byId("dialog").close();
      },
      onCustomerChange: function (oEvent) {
        var oBindingContext = oEvent
          .getParameter("listItem")
          .getBindingContext();
        this.byId("bookingTable").setBindingContext(oBindingContext);
        console.log(oBindingContext);
      },
      onBookingSelect: function (oEvent) {
        var oBindingContext = oEvent
          .getParameter("listItem")
          .getBindingContext();
        console.log(oBindingContext);
        console.log(oBindingContext.oModel.oData);
      },
      onFilterCustomer: function (oEvent) {
        var aFilter = [];
        var sQuery = oEvent.getParameter("query");
        if (sQuery && sQuery.length > 0) {
          sQuery = sQuery.trim();
          sQuery = sQuery
            .split(" ")
            .map(
              (element) => element.charAt(0).toUpperCase() + element.slice(1)
            )
            .join(" ");
          aFilter.push(
            new Filter("CustomerName", FilterOperator.Contains, sQuery)
          );
        }
        var oTable = this.byId("customerTable");
        var oBinding = oTable.getBinding("items");
        oBinding.filter(aFilter);
      },
      onNavToDetails: function (oEvent) {
        var oItem = oEvent.getSource();
        var oPath = oItem.getBindingContext().getPath();
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("detail", {
          customerId: oItem
            .getBindingContext()
            .getPath()
            .substring("/UX_Customer".length),
        });
      },
      onAfterRendering: function (oEvent) {
        console.log("data rendered");
        MessageToast.show("all data loaded");
      },
    });
  }
);
