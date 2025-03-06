sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "com/demo/b74ui5app/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
    "sap/ui/export/Spreadsheet"

], (Controller, JSONModel, MessageBox,formatter,Filter,Sorter,Spreadsheet) => {
    "use strict";

    return Controller.extend("com.demo.b74ui5app.controller.View1", {
        onInit() {
            var empJSONModel = new JSONModel();
            this.getView().setModel(empJSONModel, "empJSONModel");

            var oModel = this.getOwnerComponent().getModel();

            //this statement will trigger odata servie call to back end
            oModel.read("/EmployeeSet", {
                success: function (data) {
                    for (var i = 0; i < data.results.length; i++) {
                        data.results[i].SNo = i + 1;
                    }

                    empJSONModel.setData(data);
                }
            });

           
           


        },
        f:formatter,
        onPressButton: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView2");
        },
        onSelFromSelectBox: function () {
            var selectBoxValue = this.byId("idSelect").getSelectedKey();
        },
        onSelFromCB: function () {
            var comboboxValue = this.byId("idCB").getSelectedKey();
        },
        onSelfromMCB: function () {
            var aMcbValues = this.byId("idMCB").getSelectedKeys();
        },
        onSelFromRBG: function () {
            var rbgIndex = this.byId("idRBG").getSelectedIndex();
        },
        onSubmit: function () {
            var selectBoxValue = this.byId("idSelect").getSelectedKey();
            var comboboxValue = this.byId("idCB").getSelectedKey();
            var aMcbValues = this.byId("idMCB").getSelectedKeys();
            var rbgIndex = this.byId("idRBG").getSelectedIndex();
        },
        onValueHelpRequested: function () {
            if (this.dialog === undefined) {
                this.dialog = sap.ui.xmlfragment(this.getView().getId(), "com.demo.b74ui5app.view.EmpIdF4Help", this);
                this.getView().addDependent(this.dialog);
            }
            this.dialog.open();
        },
        onCloseDialog: function () {
            this.dialog.close();
        },
        onPressRowF4Help: function (oEvent) {
            var empId = oEvent.getSource().getBindingContext().getProperty("Empid");
            this.byId("idEmpId").setValue(empId);
            this.dialog.close();
        },
        onPressRow:function(oEvent){
            var empId = oEvent.getSource().getBindingContext().getProperty("Empid");
            this.getOwnerComponent().getRouter().navTo("RouteView2",{
                key:empId
            });
        },
        onPressCreate:function(){
            this.getOwnerComponent().getRouter().navTo("RouteView3");
        },
        onPressEdit:function(){
            var empId = this.byId("idTable").getSelectedItem().getBindingContext().getProperty("Empid");
            this.getOwnerComponent().getRouter().navTo("RouteView4",{
                key:empId
            });
        },
        onPressDelete:function(){
            var empId = this.byId("idTable").getSelectedItem().getBindingContext().getProperty("Empid");
          
            var oModel = this.getOwnerComponent().getModel();
            oModel.remove("/EmployeeSet('"+empId+"')",{
                success:function(){
                    MessageBox.success(empId+" - deleted successfully");
                    oModel.refresh(true);
                },
                error:function(oError){
                    MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                }
            });
        },
        onPressGo:function(){
            var aFilters = [];
            var aSorters = [];
            var empId = this.byId("idEmpId").getValue();
            var name = this.byId("idName").getValue();
            var desig = this.byId("idDesig").getValue();
            var skill = this.byId("idSkill").getValue();
            var salary = this.byId("idSalary").getValue();
            var salary2 = this.byId("idSalary2").getValue();
            var salaryOpr = this.byId("idOpr").getSelectedKey();
            var doj = this.byId("idDoj").getValue();
            if(empId!==""){
                aFilters.push(new Filter("Empid","EQ",empId));
            }
            if(name!==""){
                aFilters.push(new Filter("Name","Contains",name));
            }
            if(desig!==""){
                aFilters.push(new Filter("Desig","EQ",desig));
            }
            if(skill!==""){
                aFilters.push(new Filter("Skill","EQ",skill));
            }
            if(salary!==""){
                aFilters.push(new Filter("Salary",salaryOpr,salary,salary2));
            }
            if(doj!==""){
                aFilters.push(new Filter("Doj","EQ",doj));
            }
            this.byId("idTable").getBinding("items").filter(aFilters);
            //sorting logic starts here 
            //Grouping logic goes first
            var groupField = this.byId("idGroupField").getSelectedKey();
            var groupOrder = this.byId("idGroupOrder").getSelectedIndex();
            if(groupField!=="" && groupOrder!== -1){
               aSorters.push(new Sorter(groupField,(groupOrder === 0)?false:true, function(oBindingContext){
                  if(groupField === "Skill"){
                    var skill = oBindingContext.getProperty("Skill");
                    return {
                     key:skill,
                     text:skill
                    };
                  }else{
                    var desig = oBindingContext.getProperty("Desig");
                    return {
                     key:desig,
                     text:desig
                    };
                  }   
                
               }));
            }
            var sortField = this.byId("idSortField").getSelectedKey();
            var sortOrder = this.byId("idSortOrder").getSelectedIndex();
            if(sortField!=="" && sortOrder!== -1){
               aSorters.push(new Sorter(sortField,(sortOrder === 0)?false:true));
            }
            this.byId("idTable").getBinding("items").sort(aSorters);
        },
        onPressReset:function(){
          this.byId("idEmpId").setValue("");
          this.byId("idName").setValue("");
          this.byId("idDesig").setValue("");
          this.byId("idSkill").setValue("");
          this.byId("idSalary").setValue("");
          this.byId("idSalary2").setValue("");
          this.byId("idOpr").setSelectedKey("EQ");
          this.byId("idDoj").setValue("");
          this.byId("idSortField").setSelectedKey("");
          this.byId("idSortOrder").setSelectedIndex(-1);
          this.byId("idGroupField").setSelectedKey("");
          this.byId("idGroupOrder").setSelectedIndex(-1);
          this.byId("idTable").getBinding("items").filter([]);
          this.byId("idTable").getBinding("items").sort([]);
        },
        onSelOperator:function(){
            var selOpr = this.byId("idOpr").getSelectedKey();
            if(selOpr === "BT"){
               this.byId("idSalary2").setVisible(true);
            }else{
                this.byId("idSalary2").setVisible(false);
            }
        },
        onPressExportToXL: function() {
			var aCols, oRowBinding, oSettings, oSheet;
			oRowBinding = this.byId("idTable").getBinding("items");
			// place your table columns and odata properties
			aCols = [{
				label: 'Employee ID',
				property: 'Empid'
			}, {
				label: 'Name',
				property: 'Name'
			}, {
				label: 'Designation',
				property: 'Desig'
			}, {
				label: 'Skill',
				property: 'Skill'
			}, {
				label: 'Email',
				property: 'Email'
			}, {
				label: 'Date Of Joining',
				property: 'Doj',
				type: 'Date',
				format: 'dd-MM-yyyy'
			}, {
				label: 'Salary',
				property: 'Salary',
				type:'Number',
				delimiter: true,
				scale: 2
			}];
			oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: oRowBinding,
				fileName: 'Employees.xlsx',
				worker: true
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build().finally(function() {
				oSheet.destroy();
			});

		}
    });
});