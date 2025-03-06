sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.demo.b74ui5app.controller.View2", {
        onInit() {
            this.getOwnerComponent().getRouter().getRoute("RouteView2").attachPatternMatched(this.onPatternMatched,this);
        },
        onPatternMatched:function(oEvent){
           var empId =  oEvent.getParameter("arguments").key;
           this.getView().bindElement("/EmployeeSet('"+empId+"')");
        },
        onPressBack:function(){
            //this.getOwnerComponent().getRouter().navTo("RouteView1");
            history.go(-1);
        }
       
    });
});