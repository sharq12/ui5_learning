/* global QUnit */
// https://api.qunitjs.com/config/autostart/
QUnit.config.autostart = false;

sap.ui.require([
	"comdemo/b74ui5app/test/unit/AllTests"
], function (Controller) {
	"use strict";
	QUnit.start();
});