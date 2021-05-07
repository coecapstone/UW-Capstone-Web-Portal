// Site-wide configuration
//const baseURL = "https://uwcoe-api.azurewebsites.net/api/";
const baseURL = "https://engine.ce.washington.edu/api/";

/*
 * Simon Willison's addLoadEvent function,
 * from https://www.htmlgoodies.com/beyond/javascript/article.php/3724571/using-multiple-javascript-onload-functions.htm
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

/*
 * Symbolic constants for keeping data in session storage.
 */
const SESSION_KEY_ADDRESS = "address";
const SESSION_KEY_AIRFARE = "airfare";
const SESSION_KEY_AIRFARE_FILE = "airfare_file";
const SESSION_KEY_AMOUNT = "amount";
const SESSION_KEY_BIRTHDAY = "birthday";
const SESSION_KEY_BUDGET1 = "budget1";
const SESSION_KEY_BUDGET2 = "budget2";
const SESSION_KEY_BUDGET_LENGTH = "budget_length";
const SESSION_KEY_CAR = "car";
const SESSION_KEY_CARRENTAL = "carRental";
const SESSION_KEY_CAR_FILE = "car_file";
const SESSION_KEY_DATE = "date";
const SESSION_KEY_DEPARTURE = "departure";
const SESSION_KEY_DESTIONATION = "destionation";
const SESSION_KEY_EMAIL = "email";
const SESSION_KEY_FIRSTNAME = "firstname";
const SESSION_KEY_FLIGHT = "flight";
const SESSION_KEY_FLIGHT_AMOUNT = "flight_amount";
const SESSION_KEY_FLIGHT_COMPANY = "flight_company";
const SESSION_KEY_FLIGHT_DEPARTDATE = "flight_departdate";
const SESSION_KEY_FLIGHT_FROM = "flight_from";
const SESSION_KEY_FLIGHT_NUMBER = "flight_number";
const SESSION_KEY_FLIGHT_REFERENCE = "flight_reference";
const SESSION_KEY_FLIGHT_RETURNDATE = "flight_returndate";
const SESSION_KEY_FLIGHT_TO = "flight_to";
const SESSION_KEY_FORMYSELF = "ForMyself";
const SESSION_KEY_HOTEL = "hotel";
const SESSION_KEY_HOTELFEE = "hotelFee";
const SESSION_KEY_HOTEL_ADDRESS = "hotel_address";
const SESSION_KEY_HOTEL_AMOUNT = "hotel_amount";
const SESSION_KEY_HOTEL_FILE = "hotel_file";
const SESSION_KEY_HOTEL_LINK = "hotel_link";
const SESSION_KEY_HOTEL_MOVEIN = "hotel_movein";
const SESSION_KEY_HOTEL_MOVEOUT = "hotel_moveout";
const SESSION_KEY_HOTEL_NAME = "hotel_name";
const SESSION_KEY_HOTEL_NOTE = "hotel_note";
const SESSION_KEY_HOTEL_NUM = "hotel_num";
const SESSION_KEY_HOTEL_ZIP = "hotel_zip";
const SESSION_KEY_ID = "id";
const SESSION_KEY_INFOMATION = "infomation";
const SESSION_KEY_LASTNAME = "lastname";
const SESSION_KEY_LEVEL = "level";
const SESSION_KEY_LEVEL_ALT = "user_AccessLevel";
const SESSION_KEY_MEAL = "meal";
const SESSION_KEY_MEALPROVIDED = "mealProvided";
const SESSION_KEY_MEAL_AMOUNT = "meal_amount";
const SESSION_KEY_NAME = "name";
const SESSION_KEY_NOTE = "note";
const SESSION_KEY_ORDERID = "orderId";
const SESSION_KEY_PASSPORT_FILE = "passport_file";
const SESSION_KEY_PERSONALTRAVEL = "personalTravel";
const SESSION_KEY_PERSONALTRAVELDETAILS = "personalTravelDetails";
const SESSION_KEY_PROFILE_PIC_URL = "profile_pic_url";
const SESSION_KEY_PURPOSE = "purpose";
const SESSION_KEY_REASON = "reason";
const SESSION_KEY_REFERENCENUMBER = "ReferenceNumber";
const SESSION_KEY_REGISTRATION = "registration";
const SESSION_KEY_REGISTRATION_FILE = "registration_file";
const SESSION_KEY_RENTAL_FILE = "rental_file";
const SESSION_KEY_REQUESTID = "RequestID";
const SESSION_KEY_REQUESTTYPE = "RequestType";
const SESSION_KEY_RETURNDATE = "returndate";
const SESSION_KEY_SOMEONEAFFLIATION = "SomeoneAffliation";
const SESSION_KEY_SOMEONEEMAIL = "SomeoneEmail";
const SESSION_KEY_SOMEONENAME = "SomeoneName";
const SESSION_KEY_SPLIT1 = "split1";
const SESSION_KEY_SPLIT2 = "split2";
const SESSION_KEY_STATUS = "status";
const SESSION_KEY_SUBMIT_DATE = "submit_date";
const SESSION_KEY_SUBUNITID = "subunitID";
const SESSION_KEY_SUBUNITNAME = "subunitName";
const SESSION_KEY_TRAIN = "train";
const SESSION_KEY_TRAIN_FILE = "train_file";
const SESSION_KEY_TRAVELBEFORE = "TravelBefore";
const SESSION_KEY_TRUE_UWNETID = "true_uwnetid";
const SESSION_KEY_TYPE = "type";
const SESSION_KEY_UNITID = "unitID";
const SESSION_KEY_UNITNAME = "unitName";
const SESSION_KEY_US = "US";
const SESSION_KEY_USER_ACCESSLEVEL = "user_AccessLevel";
const SESSION_KEY_USER_EMAIL = "user_email";
const SESSION_KEY_USER_ID = "user_id";
const SESSION_KEY_USER_NAME = "user_name";
const SESSION_KEY_USER_SUBUNITNAME = "user_subunitName";
const SESSION_KEY_USER_UWID = "user_uwid";
const SESSION_KEY_UWID = "uwid";
const SESSION_KEY_UWNETID = "uwnetid";
const SESSION_KEY_VERIFIED_USER = "verified_user";
const SESSION_KEY_VISA_FILE = "visa_file";

/*
 * Discrete values for some session variables
 */
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
	return window.sessionStorage.getItem(SESSION_KEY_LEVEL);
    }
    static setLevel(level) {
	window.sessionStorage.setItem(SESSION_KEY_LEVEL, level);
	window.sessionStorage.setItem("user_AccessLevel", level);
    }
    static getUnitID() {
	return window.sessionStorage.getItem(SESSION_KEY_UNITID);
    }
    static setUnitID(id) {
	window.sessionStorage.setItem(SESSION_KEY_UNITID, id);
    }
    static getUnitName() {
	return window.sessionStorage.getItem(SESSION_KEY_UNITNAME);
    }
    static setUnitName(name) {
	window.sessionStorage.setItem(SESSION_KEY_UNITNAME, name);
    }
    static getSubunitID() {
	return window.sessionStorage.getItem(SESSION_KEY_SUBUNITID);
    }
    static setSubunitID(id) {
	window.sessionStorage.setItem(SESSION_KEY_SUBUNITID, id);
    }
    static getSubunitName() {
	return window.sessionStorage.getItem(SESSION_KEY_SUBUNITNAME);
    }
    static setSubunitName(name) {
	window.sessionStorage.setItem(SESSION_KEY_SUBUNITNAME, name);
    }
    static getAddress() { return window.sessionStorage.getItem(SESSION_KEY_ADDRESS); }
    static getAirfare() { return window.sessionStorage.getItem(SESSION_KEY_AIRFARE); }
    static getAirfare_file() { return window.sessionStorage.getItem(SESSION_KEY_AIRFARE_FILE); }
    static getAmount() { return window.sessionStorage.getItem(SESSION_KEY_AMOUNT); }
    static getBirthday() { return window.sessionStorage.getItem(SESSION_KEY_BIRTHDAY); }
    static getBudget1() { return window.sessionStorage.getItem(SESSION_KEY_BUDGET1); }
    static getBudget2() { return window.sessionStorage.getItem(SESSION_KEY_BUDGET2); }
    static getBudget_length() { return window.sessionStorage.getItem(SESSION_KEY_BUDGET_LENGTH); }
    static getCar() { return window.sessionStorage.getItem(SESSION_KEY_CAR); }
    static getCar_file() { return window.sessionStorage.getItem(SESSION_KEY_CAR_FILE); }
    static getCarRental() { return window.sessionStorage.getItem(SESSION_KEY_CARRENTAL); }
    static getDate() { return window.sessionStorage.getItem(SESSION_KEY_DATE); }
    static getDeparture() { return window.sessionStorage.getItem(SESSION_KEY_DEPARTURE); }
    static getDestionation() { return window.sessionStorage.getItem(SESSION_KEY_DESTIONATION); }
    static getEmail() { return window.sessionStorage.getItem(SESSION_KEY_EMAIL); }
    static getFirstname() { return window.sessionStorage.getItem(SESSION_KEY_FIRSTNAME); }
    static getFlight() { return window.sessionStorage.getItem(SESSION_KEY_FLIGHT); }
    static getFlight_amount() { return window.sessionStorage.getItem(SESSION_KEY_FLIGHT_AMOUNT); }
    static getFlight_company() { return window.sessionStorage.getItem(SESSION_KEY_FLIGHT_COMPANY); }
    static getFlight_departdate() { return window.sessionStorage.getItem(SESSION_KEY_FLIGHT_DEPARTDATE); }
    static getFlight_from() { return window.sessionStorage.getItem(SESSION_KEY_FLIGHT_FROM); }
    static getFlight_number() { return window.sessionStorage.getItem(SESSION_KEY_FLIGHT_NUMBER); }
    static getFlight_reference() { return window.sessionStorage.getItem(SESSION_KEY_FLIGHT_REFERENCE); }
    static getFlight_returndate() { return window.sessionStorage.getItem(SESSION_KEY_FLIGHT_RETURNDATE); }
    static getFlight_to() { return window.sessionStorage.getItem(SESSION_KEY_FLIGHT_TO); }
    static getForMyself() { return window.sessionStorage.getItem(SESSION_KEY_FORMYSELF); }
    static getHotel() { return window.sessionStorage.getItem(SESSION_KEY_HOTEL); }
    static getHotel_address() { return window.sessionStorage.getItem(SESSION_KEY_HOTEL_ADDRESS); }
    static getHotel_amount() { return window.sessionStorage.getItem(SESSION_KEY_HOTEL_AMOUNT); }
    static getHotelFee() { return window.sessionStorage.getItem(SESSION_KEY_HOTELFEE); }
    static getHotel_file() { return window.sessionStorage.getItem(SESSION_KEY_HOTEL_FILE); }
    static getHotel_link() { return window.sessionStorage.getItem(SESSION_KEY_HOTEL_LINK); }
    static getHotel_movein() { return window.sessionStorage.getItem(SESSION_KEY_HOTEL_MOVEIN); }
    static getHotel_moveout() { return window.sessionStorage.getItem(SESSION_KEY_HOTEL_MOVEOUT); }
    static getHotel_name() { return window.sessionStorage.getItem(SESSION_KEY_HOTEL_NAME); }
    static getHotel_note() { return window.sessionStorage.getItem(SESSION_KEY_HOTEL_NOTE); }
    static getHotel_num() { return window.sessionStorage.getItem(SESSION_KEY_HOTEL_NUM); }
    static getHotel_zip() { return window.sessionStorage.getItem(SESSION_KEY_HOTEL_ZIP); }
    static getId() { return window.sessionStorage.getItem(SESSION_KEY_ID); }
    static getInfomation() { return window.sessionStorage.getItem(SESSION_KEY_INFOMATION); }
    static getLastname() { return window.sessionStorage.getItem(SESSION_KEY_LASTNAME); }
    static getMeal() { return window.sessionStorage.getItem(SESSION_KEY_MEAL); }
    static getMeal_amount() { return window.sessionStorage.getItem(SESSION_KEY_MEAL_AMOUNT); }
    static getMealProvided() { return window.sessionStorage.getItem(SESSION_KEY_MEALPROVIDED); }
    static getName() { return window.sessionStorage.getItem(SESSION_KEY_NAME); }
    static getNote() { return window.sessionStorage.getItem(SESSION_KEY_NOTE); }
    static getOrderId() { return window.sessionStorage.getItem(SESSION_KEY_ORDERID); }
    static getPassport_file() { return window.sessionStorage.getItem(SESSION_KEY_PASSPORT_FILE); }
    static getPersonalTravel() { return window.sessionStorage.getItem(SESSION_KEY_PERSONALTRAVEL); }
    static getPersonalTravelDetails() { return window.sessionStorage.getItem(SESSION_KEY_PERSONALTRAVELDETAILS); }
    static getProfile_pic_url() { return window.sessionStorage.getItem(SESSION_KEY_PROFILE_PIC_URL); }
    static getPurpose() { return window.sessionStorage.getItem(SESSION_KEY_PURPOSE); }
    static getReason() { return window.sessionStorage.getItem(SESSION_KEY_REASON); }
    static getReferenceNumber() { return window.sessionStorage.getItem(SESSION_KEY_REFERENCENUMBER); }
    static getRegistration() { return window.sessionStorage.getItem(SESSION_KEY_REGISTRATION); }
    static getRegistration_file() { return window.sessionStorage.getItem(SESSION_KEY_REGISTRATION_FILE); }
    static getRental_file() { return window.sessionStorage.getItem(SESSION_KEY_RENTAL_FILE); }
    static getRequestID() { return window.sessionStorage.getItem(SESSION_KEY_REQUESTID); }
    static getRequestType() { return window.sessionStorage.getItem(SESSION_KEY_REQUESTTYPE); }
    static getReturndate() { return window.sessionStorage.getItem(SESSION_KEY_RETURNDATE); }
    static getSomeoneAffliation() { return window.sessionStorage.getItem(SESSION_KEY_SOMEONEAFFLIATION); }
    static getSomeoneEmail() { return window.sessionStorage.getItem(SESSION_KEY_SOMEONEEMAIL); }
    static getSomeoneName() { return window.sessionStorage.getItem(SESSION_KEY_SOMEONENAME); }
    static getSplit1() { return window.sessionStorage.getItem(SESSION_KEY_SPLIT1); }
    static getSplit2() { return window.sessionStorage.getItem(SESSION_KEY_SPLIT2); }
    static getStatus() { return window.sessionStorage.getItem(SESSION_KEY_STATUS); }
    static getSubmit_date() { return window.sessionStorage.getItem(SESSION_KEY_SUBMIT_DATE); }
    static getTrain() { return window.sessionStorage.getItem(SESSION_KEY_TRAIN); }
    static getTrain_file() { return window.sessionStorage.getItem(SESSION_KEY_TRAIN_FILE); }
    static getTravelBefore() { return window.sessionStorage.getItem(SESSION_KEY_TRAVELBEFORE); }
    static getTrue_uwnetid() { return window.sessionStorage.getItem(SESSION_KEY_TRUE_UWNETID); }
    static getType() { return window.sessionStorage.getItem(SESSION_KEY_TYPE); }
    static getUnitID() { return window.sessionStorage.getItem(SESSION_KEY_UNITID); }
    static getUS() { return window.sessionStorage.getItem(SESSION_KEY_US); }
    static getUser_AccessLevel() { return window.sessionStorage.getItem(SESSION_KEY_USER_ACCESSLEVEL); }
    static getUser_email() { return window.sessionStorage.getItem(SESSION_KEY_USER_EMAIL); }
    static getUser_id() { return window.sessionStorage.getItem(SESSION_KEY_USER_ID); }
    static getUser_name() { return window.sessionStorage.getItem(SESSION_KEY_USER_NAME); }
    static getUser_subunitName() { return window.sessionStorage.getItem(SESSION_KEY_USER_SUBUNITNAME); }
    static getUser_uwid() { return window.sessionStorage.getItem(SESSION_KEY_USER_UWID); }
    static getUwid() { return window.sessionStorage.getItem(SESSION_KEY_UWID); }
    static getUwnetid() { return window.sessionStorage.getItem(SESSION_KEY_UWNETID); }
    static getVerified_user() { return window.sessionStorage.getItem(SESSION_KEY_VERIFIED_USER); }
    static getVisa_file() { return window.sessionStorage.getItem(SESSION_KEY_VISA_FILE); }
    static setAddress(value) { return window.sessionStorage.setItem(SESSION_KEY_ADDRESS, value); }
    static setAirfare(value) { return window.sessionStorage.setItem(SESSION_KEY_AIRFARE, value); }
    static setAirfare_file(value) { return window.sessionStorage.setItem(SESSION_KEY_AIRFARE_FILE, value); }
    static setAmount(value) { return window.sessionStorage.setItem(SESSION_KEY_AMOUNT, value); }
    static setBirthday(value) { return window.sessionStorage.setItem(SESSION_KEY_BIRTHDAY, value); }
    static setBudget1(value) { return window.sessionStorage.setItem(SESSION_KEY_BUDGET1, value); }
    static setBudget2(value) { return window.sessionStorage.setItem(SESSION_KEY_BUDGET2, value); }
    static setBudget_length(value) { return window.sessionStorage.setItem(SESSION_KEY_BUDGET_LENGTH, value); }
    static setCar(value) { return window.sessionStorage.setItem(SESSION_KEY_CAR, value); }
    static setCar_file(value) { return window.sessionStorage.setItem(SESSION_KEY_CAR_FILE, value); }
    static setCarRental(value) { return window.sessionStorage.setItem(SESSION_KEY_CARRENTAL, value); }
    static setDate(value) { return window.sessionStorage.setItem(SESSION_KEY_DATE, value); }
    static setDeparture(value) { return window.sessionStorage.setItem(SESSION_KEY_DEPARTURE, value); }
    static setDestionation(value) { return window.sessionStorage.setItem(SESSION_KEY_DESTIONATION, value); }
    static setEmail(value) { return window.sessionStorage.setItem(SESSION_KEY_EMAIL, value); }
    static setFirstname(value) { return window.sessionStorage.setItem(SESSION_KEY_FIRSTNAME, value); }
    static setFlight(value) { return window.sessionStorage.setItem(SESSION_KEY_FLIGHT, value); }
    static setFlight_amount(value) { return window.sessionStorage.setItem(SESSION_KEY_FLIGHT_AMOUNT, value); }
    static setFlight_company(value) { return window.sessionStorage.setItem(SESSION_KEY_FLIGHT_COMPANY, value); }
    static setFlight_departdate(value) { return window.sessionStorage.setItem(SESSION_KEY_FLIGHT_DEPARTDATE, value); }
    static setFlight_from(value) { return window.sessionStorage.setItem(SESSION_KEY_FLIGHT_FROM, value); }
    static setFlight_number(value) { return window.sessionStorage.setItem(SESSION_KEY_FLIGHT_NUMBER, value); }
    static setFlight_reference(value) { return window.sessionStorage.setItem(SESSION_KEY_FLIGHT_REFERENCE, value); }
    static setFlight_returndate(value) { return window.sessionStorage.setItem(SESSION_KEY_FLIGHT_RETURNDATE, value); }
    static setFlight_to(value) { return window.sessionStorage.setItem(SESSION_KEY_FLIGHT_TO, value); }
    static setForMyself(value) { return window.sessionStorage.setItem(SESSION_KEY_FORMYSELF, value); }
    static setHotel(value) { return window.sessionStorage.setItem(SESSION_KEY_HOTEL, value); }
    static setHotel_address(value) { return window.sessionStorage.setItem(SESSION_KEY_HOTEL_ADDRESS, value); }
    static setHotel_amount(value) { return window.sessionStorage.setItem(SESSION_KEY_HOTEL_AMOUNT, value); }
    static setHotelFee(value) { return window.sessionStorage.setItem(SESSION_KEY_HOTELFEE, value); }
    static setHotel_file(value) { return window.sessionStorage.setItem(SESSION_KEY_HOTEL_FILE, value); }
    static setHotel_link(value) { return window.sessionStorage.setItem(SESSION_KEY_HOTEL_LINK, value); }
    static setHotel_movein(value) { return window.sessionStorage.setItem(SESSION_KEY_HOTEL_MOVEIN, value); }
    static setHotel_moveout(value) { return window.sessionStorage.setItem(SESSION_KEY_HOTEL_MOVEOUT, value); }
    static setHotel_name(value) { return window.sessionStorage.setItem(SESSION_KEY_HOTEL_NAME, value); }
    static setHotel_note(value) { return window.sessionStorage.setItem(SESSION_KEY_HOTEL_NOTE, value); }
    static setHotel_num(value) { return window.sessionStorage.setItem(SESSION_KEY_HOTEL_NUM, value); }
    static setHotel_zip(value) { return window.sessionStorage.setItem(SESSION_KEY_HOTEL_ZIP, value); }
    static setId(value) { return window.sessionStorage.setItem(SESSION_KEY_ID, value); }
    static setInfomation(value) { return window.sessionStorage.setItem(SESSION_KEY_INFOMATION, value); }
    static setLastname(value) { return window.sessionStorage.setItem(SESSION_KEY_LASTNAME, value); }
    static setMeal(value) { return window.sessionStorage.setItem(SESSION_KEY_MEAL, value); }
    static setMeal_amount(value) { return window.sessionStorage.setItem(SESSION_KEY_MEAL_AMOUNT, value); }
    static setMealProvided(value) { return window.sessionStorage.setItem(SESSION_KEY_MEALPROVIDED, value); }
    static setName(value) { return window.sessionStorage.setItem(SESSION_KEY_NAME, value); }
    static setNote(value) { return window.sessionStorage.setItem(SESSION_KEY_NOTE, value); }
    static setOrderId(value) { return window.sessionStorage.setItem(SESSION_KEY_ORDERID, value); }
    static setPassport_file(value) { return window.sessionStorage.setItem(SESSION_KEY_PASSPORT_FILE, value); }
    static setPersonalTravel(value) { return window.sessionStorage.setItem(SESSION_KEY_PERSONALTRAVEL, value); }
    static setPersonalTravelDetails(value) { return window.sessionStorage.setItem(SESSION_KEY_PERSONALTRAVELDETAILS, value); }
    static setProfile_pic_url(value) { return window.sessionStorage.setItem(SESSION_KEY_PROFILE_PIC_URL, value); }
    static setPurpose(value) { return window.sessionStorage.setItem(SESSION_KEY_PURPOSE, value); }
    static setReason(value) { return window.sessionStorage.setItem(SESSION_KEY_REASON, value); }
    static setReferenceNumber(value) { return window.sessionStorage.setItem(SESSION_KEY_REFERENCENUMBER, value); }
    static setRegistration(value) { return window.sessionStorage.setItem(SESSION_KEY_REGISTRATION, value); }
    static setRegistration_file(value) { return window.sessionStorage.setItem(SESSION_KEY_REGISTRATION_FILE, value); }
    static setRental_file(value) { return window.sessionStorage.setItem(SESSION_KEY_RENTAL_FILE, value); }
    static setRequestID(value) { return window.sessionStorage.setItem(SESSION_KEY_REQUESTID, value); }
    static setRequestType(value) { return window.sessionStorage.setItem(SESSION_KEY_REQUESTTYPE, value); }
    static setReturndate(value) { return window.sessionStorage.setItem(SESSION_KEY_RETURNDATE, value); }
    static setSomeoneAffliation(value) { return window.sessionStorage.setItem(SESSION_KEY_SOMEONEAFFLIATION, value); }
    static setSomeoneEmail(value) { return window.sessionStorage.setItem(SESSION_KEY_SOMEONEEMAIL, value); }
    static setSomeoneName(value) { return window.sessionStorage.setItem(SESSION_KEY_SOMEONENAME, value); }
    static setSplit1(value) { return window.sessionStorage.setItem(SESSION_KEY_SPLIT1, value); }
    static setSplit2(value) { return window.sessionStorage.setItem(SESSION_KEY_SPLIT2, value); }
    static setStatus(value) { return window.sessionStorage.setItem(SESSION_KEY_STATUS, value); }
    static setSubmit_date(value) { return window.sessionStorage.setItem(SESSION_KEY_SUBMIT_DATE, value); }
    static setTrain(value) { return window.sessionStorage.setItem(SESSION_KEY_TRAIN, value); }
    static setTrain_file(value) { return window.sessionStorage.setItem(SESSION_KEY_TRAIN_FILE, value); }
    static setTravelBefore(value) { return window.sessionStorage.setItem(SESSION_KEY_TRAVELBEFORE, value); }
    static setTrue_uwnetid(value) { return window.sessionStorage.setItem(SESSION_KEY_TRUE_UWNETID, value); }
    static setType(value) { return window.sessionStorage.setItem(SESSION_KEY_TYPE, value); }
    static setUnitID(value) { return window.sessionStorage.setItem(SESSION_KEY_UNITID, value); }
    static setUS(value) { return window.sessionStorage.setItem(SESSION_KEY_US, value); }
    static setUser_AccessLevel(value) { return window.sessionStorage.setItem(SESSION_KEY_USER_ACCESSLEVEL, value); }
    static setUser_email(value) { return window.sessionStorage.setItem(SESSION_KEY_USER_EMAIL, value); }
    static setUser_id(value) { return window.sessionStorage.setItem(SESSION_KEY_USER_ID, value); }
    static setUser_name(value) { return window.sessionStorage.setItem(SESSION_KEY_USER_NAME, value); }
    static setUser_subunitName(value) { return window.sessionStorage.setItem(SESSION_KEY_USER_SUBUNITNAME, value); }
    static setUser_uwid(value) { return window.sessionStorage.setItem(SESSION_KEY_USER_UWID, value); }
    static setUwid(value) { return window.sessionStorage.setItem(SESSION_KEY_UWID, value); }
    static setUwnetid(value) { return window.sessionStorage.setItem(SESSION_KEY_UWNETID, value); }
    static setVerified_user(value) { return window.sessionStorage.setItem(SESSION_KEY_VERIFIED_USER, value); }
    static setVisa_file(value) { return window.sessionStorage.setItem(SESSION_KEY_VISA_FILE, value); }

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

