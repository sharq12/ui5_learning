sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
],
function (Controller, JSONModel, MessageToast, Filter,FilterOperator, Sorter) {
    "use strict";

    return Controller.extend("project4odatacrud.controller.View1", {
        onInit: function () {
          const oDataModel = this.getOwnerComponent().getModel();
          this.oDataRead(oDataModel);
        //   this.oDataFilter(oDataModel);
        //   this.oDataSorter(oDataModel);
        //   this.oDataFilterSorter(oDataModel);
        //   this.oDataSkipTop(oDataModel);
        //   this.oDataReadKey(oDataModel);
          this.oDataGetExpanded(oDataModel);
        },

        oDataRead: function(oDataModel){
                oDataModel.read("/Products", {success: function(oData, response){
                    if(oData.results){
                        var lv_d1 = oData.results; 
                        var oProductJSONModel = new JSONModel();
                        oProductJSONModel.setData({Products:lv_d1});
                        // this.getView().setModel(oProductJSONModel);      // set model on view 
                        this.getView().byId("_IDProductTable").setModel(oProductJSONModel)    // set model on table 

                    }
                }.bind(this), error: function(oError){
                    MessageToast.show(oError);
                }})
        },
        oDataFilter: function(oDataModel){
            var that = this;
            var aFilter = [];
            var oFilter = new Filter({
                path: 'Rating',
                operator: FilterOperator.EQ,
                value1: 3,
            }) ;
            aFilter.push(oFilter);
            oDataModel.read("/Products", { success:function(oData, response){
                if(oData.results){
                    var lv_d1 = oData.results;
                    var oProductJSONModel = new JSONModel();
                    oProductJSONModel.setData({Products: lv_d1});
                    that.getView().byId("_IDProductTable").setModel(oProductJSONModel);
                }
            }, error: function(oError){
                MessageToast.show(oError);
            }, 
            filters: aFilter})
        },
        oDataSorter: function(oDataModel){
            var that = this;
            var  aSorter = [];
            var oSorter = new Sorter('Price');
            aSorter.push(oSorter);
            oDataModel.read("/Products", {sorters: aSorter, success:function(oData, response){
                if(oData.results){
                    var lv_d1 = oData.results;
                    var oProductJSONModel = new JSONModel();
                    oProductJSONModel.setData({Products: lv_d1});
                    that.getView().byId("_IDProductTable").setModel(oProductJSONModel);
                }
            }, error: function(oError){
                MessageToast.show(oError);
            } })
        },
        oDataFilterSorter: function(oDataModel){
            var aFilter = [];
            var aSorter = [];
            var oFilter = new Filter({
                path: 'Rating',
                operator: FilterOperator.EQ,
                value1: 3
            })
            aFilter.push(oFilter)
            var oSorter = new Sorter('Price');
            aSorter.push(oSorter);

            oDataModel.read("/Products", {sorters: aSorter,
                 filters: aFilter,
                 success: function(oData, response){
                    if(oData.results){
                        var oProductJSONModel = new JSONModel();
                        oProductJSONModel.setData({Products: oData.results});
                        this.getView().byId("_IDProductTable").setModel(oProductJSONModel);
                    }
                 }.bind(this),
                 error: function(oError){
                    MessageToast.show(oError);
                 }
                })
        },
        oDataSkipTop: function(oDataModel){
            var that = this;
            oDataModel.read("/Products", {
                urlParameters: {"$skip": "0", "$top": "4"},
                success: function(oData, response){
                    if(oData.results){
                        var oProductJSONModel = new JSONModel();
                        oProductJSONModel.setData({Products: oData.results})
                        that.getView().byId("_IDProductTable").setModel(oProductJSONModel);
                    }
                }, 
                error: function(oError){MessageToast.show(oError)}
            })
        },
        oDataReadKey: function(oDataModel){
            var that = this;
            oDataModel.read("/Products(2)",{success: function(oData, response){
                if(oData){
                    var oProductJSONModel = new JSONModel();          
                    oProductJSONModel.setData({Products: [oData]});   
                    that.getView().byId("_IDProductTable").setModel(oProductJSONModel);
                }
            }, 
            error: function(oError){MessageToast.show(oError)}} )
        },
        onEditPress: function(oEvent){
            var that = this;
            var oDataModel = this.getOwnerComponent().getModel();
            oDataModel.setUseBatch(false);

           if(oEvent.getSource().getText() === "Edit"){
                oEvent.getSource().getParent().getParent().getCells()[4].setEditable(true);
                oEvent.getSource().setText("Submit");
           }else {
            var oID = parseInt(oEvent.getSource().getBindingContext().getProperty("ID"));
            var oInput = oEvent.getSource().getParent().getParent().getCells()[4].getValue();
            oDataModel.update("/Products("+oID+")", {Rating:oInput}, {success:function(OData, response){
                that.oDataRead(that.getOwnerComponent().getModel());
            }, error: function(oError){
                MessageToast.show(oError);
            }})
            oEvent.getSource().setText("Edit");
            oEvent.getSource().getParent().getParent().getCells()[4].setEditable(false);
           }
        },
        onDuplicatePress: function(oEvent){
         var that = this;
         var oDataModel = this.getOwnerComponent().getModel();
         oDataModel.setUseBatch(false);
          var oID =  oEvent.getSource().getBindingContext().getProperty("ID");
          oID = 100 + oID;
          var oDataObject = oEvent.getSource().getBindingContext().getObject();
          oDataObject.ID = oID;
          oDataModel.create("/Products", oDataObject, {success:function(OData, response){
            that.oDataRead(that.getOwnerComponent().getModel());
        }, error: function(oError){
            MessageToast.show(oError);}
        })
        }, 
        onDeletePress: function(oEvent){
            var that = this;
            var oID = oEvent.getSource().getBindingContext().getProperty("ID");
            var oDataModel = this.getOwnerComponent().getModel();
            oDataModel.setUseBatch(false);
            oDataModel.remove(`/Products(${oID})`, {success: function(oData, response){
                that.oDataRead(oDataModel);
            }, error: function(oError){
                MessageToast.show(JSON.stringify(oError));

            }
        })
        },
        oDataGetExpanded: function(oDataModel){
            var that = this;
            oDataModel.setUseBatch(false);
            oDataModel.read("/Categories", {urlParameters:{"$expand": "Products"} , success: function(oData, oResponse){
                  console.log(oData.results);
            }, error: function(oError){
                console.log(oError);
            }})
        }

    });
});
