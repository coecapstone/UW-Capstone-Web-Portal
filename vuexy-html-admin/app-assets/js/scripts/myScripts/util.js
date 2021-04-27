// Site-wide configuration
//const baseURL = "https://uwcoe-api.azurewebsites.net/api/";
const baseURL = "https://engine.ce.washington.edu/api/";

/*
 * Simon Willison's addLoadEvent function,
 * frmo https://www.htmlgoodies.com/beyond/javascript/article.php/3724571/using-multiple-javascript-onload-functions.htm
 *
 * usage: addLoadEvent(func);
 *     or addLoadEvent(function() { some code; });
 */
function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
	window.onload = func;
    } else {
	window.onload = function() {
	    if (oldonload) {
		oldonload();
	    }
	    func();
	}
    }
}

const LEVEL_ADMIN = "Admin";
const LEVEL_FISCAL_STAFF = "FiscalStaff";
const LEVEL_SUBMITTER = "Submitter";
const LEVEL_APPROVER = "Approver";

class EngineUI {
    /*
     * This is the role chosen at in chooseRole.html,
     * not necessarily the authorized role a user might have
     * on a unit or subunit.
     * The level chosen determines the UI seen.
     */
    static get LEVEL_ADMIN() {
	return LEVEL_ADMIN;
    }
    static get LEVEL_FISCAL_STAFF() {
	return LEVEL_FISCAL_STAFF;
    }
    static get LEVEL_SUBMITTER() {
	return LEVEL_SUBMITTER;
    }
    static get LEVEL_APPROVER() {
	return LEVEL_APPROVER;
    }

    /*
     * Functions to get and set the level, unit and subunit
     * chosen by the user at login time.
     */
    static getLevel() {
	return window.sessionStorage.getItem("level");
    }
    static setLevel(level) {
	window.sessionStorage.setItem("level", level);
	window.sessionStorage.setItem("user_AccessLevel", level);
    }
    static getUnitID() {
	return window.sessionStorage.getItem("unitID");
    }
    static setUnitID(id) {
	window.sessionStorage.setItem("unitID", id);
    }
    static getUnitName() {
	return window.sessionStorage.getItem("unitName");
    }
    static setUnitName(name) {
	window.sessionStorage.setItem("unitName", name);
    }
    static getSubunitID() {
	return window.sessionStorage.getItem("subunitID");
    }
    static setSubunitID(id) {
	window.sessionStorage.setItem("subunitID", id);
    }
    static getSubunitName() {
	return window.sessionStorage.getItem("subunitName");
    }
    static setSubunitName(name) {
	window.sessionStorage.setItem("subunitName", name);
    }

    /*
     * XXX The decision as to whether a user is a super-user
     * XXX needs to come from a new user role, not be hard-coded in this way.
     */
    static canImpersonate()
    {
	var trueName = window.sessionStorage.getItem("true_uwnetid");
	if (trueName != "perseant" && trueName != "yangx38" && trueName != "xiyueyao" && trueName != "ab32") {
            return false;
	}
	return true;
    }
}

