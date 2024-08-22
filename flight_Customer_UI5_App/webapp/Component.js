sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel"
],
    function (UIComponent, Device, JSONModel) {
        "use strict";
        console.log("index.js");

        return UIComponent.extend("sap.training.exc.Component", {

        metadata: {
            manifest: "json"
        },
        init: function() {
            // call the base component's init function 
            UIComponent.prototype.init.apply(this, arguments);
            console.log("component.js");

            // get Device Model for touch and desktop
            var oDeviceModel = new JSONModel(Device);
            oDeviceModel.setDefaultBindingMode("OneWay");
            this.setModel(oDeviceModel, "device");

            // initializing the router 
            this.getRouter().initialize();
        },

        getContentDensityClass: function(){
            if(!this._sContentDensityClass){
                if(Device.support.touch){
                    this._sContentDensityClass = "sapUiSizeCozy";
                }else{
                    this._sContentDensityClass = "sapUISizeCompact";
                }
            }
            return this._sContentDensityClass
        }





        });
    }
);