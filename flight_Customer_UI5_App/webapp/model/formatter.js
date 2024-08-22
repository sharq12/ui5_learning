sap.ui.define(["sap/base/i18n/ResourceBundle"], function(ResourceBundle){

    "use strict";
    return {

       
        classText: function(sClass){
            // var oBundle =  this.getView().getModel("i18n").getResourceBundle();
            var oResourceBundle = ResourceBundle.create({ url: "i18n/i18n.properties"});
            switch (sClass){
                case "C":
                    // return "Bussiness Class";
                    return oResourceBundle.getText("flightClassC");
                case "Y":
                    // return "Economy Class";
                    return oResourceBundle.getText("flightClassY");
                case "F":
                    // return "First Class";
                    return oResourceBundle.getText("flightClassF");
                default:
                    return sClass;
            }
        },

        cancelStatus: function(status){
            switch(status){
                case "X":
                    return "Cancelled";
                case "":
                    return "Booked";
                default:
                    return status;
            }
        }
    }
})