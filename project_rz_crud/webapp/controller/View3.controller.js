sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller,MessageBox) => {
    "use strict";

    return Controller.extend("com.demo.b74ui5app.controller.View3", {
        onInit() {
        },
        onPressBack:function(){
            history.go(-1);
        },
        onPressSave:function(){
            var empId = this.byId("idEmpId").getValue();
            var name = this.byId("idName").getValue();
            var desig = this.byId("idDesig").getValue();
            var skill = this.byId("idSkill").getValue();
            var email = this.byId("idEmail").getValue();
            var salary = this.byId("idSalary").getValue();
            var doj = this.byId("idDoj").getValue();

            var payload = {
                Empid : empId,
                Name : name,
                Desig:desig,
                Skill:skill,
                Email:email,
                Salary:salary,
                Doj:doj
            };
            var oModel = this.getOwnerComponent().getModel();

            oModel.create("/EmployeeSet",payload,{
                success:function(req,res){
                    MessageBox.success(res.data.Empid+" - Created successfully");
                    oModel.refresh(true);
                },
                error:function(oError){
                    MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                }
            });

        }
       
    });
});