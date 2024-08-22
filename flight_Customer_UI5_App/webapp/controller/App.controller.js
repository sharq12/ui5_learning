sap.ui.define(["sap/ui/core/mvc/Controller"], function(Controller){
    "use strict";
    Controller.extend("sap.training.exc.controller.App", {
       
        onInit:function(){
         var contentDensity = this.getOwnerComponent().getContentDensityClass();   
         this.getView().addStyleClass(contentDensity);
        }
        
    })
})