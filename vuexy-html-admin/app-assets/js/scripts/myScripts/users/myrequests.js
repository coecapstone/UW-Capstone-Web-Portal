var requestsInfo = [];
var requesters = [];
var subUnits = [];
var users = [];
var myReqArr = [];
var unitStaff = [];
let userInfoMap = new Map();
let reqIdMap = new Map(); // <K, V> -> <request id, request index in requestsInfo>
// contacts.set('Jessie', {phone: "213-555-1234", address: "123 N 1st Ave"})
// contacts.has('Jessie') // true
// contacts.get('Hilary') // undefined
// contacts.set('Hilary', {phone: "617-555-4321", address: "321 S 2nd St"})
// contacts.get('Jessie') // {phone: "213-555-1234", address: "123 N 1st Ave"}
// contacts.delete('Raymond') // false
// contacts.delete('Jessie') // true
// console.log(contacts.size) // 1
var user_name="";
var user_uwid="";
var user_email="";
var user_subunitName="";
var user_accessLevel="";
var user_id = EngineUI.getId();
/**
 * Initialize the window
 * Since we cannot get all needed information just from getAllOrders api
 * So we need to get users id from getAllOrders api, store them in users array,
 * and then get userInfo one by one,
 * then getAllOrders again and write to the requestsInfo global array
 */
addLoadEvent(function() {
    update_Dashboard_welcomebar_navigationbar();

    // All requests table
    this.getAllRequestsInfo();
    this.updateAllRequestsTable();

    this.getUserInfo();
    
});


function updateAllRequestsTable() {
    var table = $("#DataTables_Table_1").DataTable({
        "order": [[3, "desc"]]
    });

    for (var x = 0; x < requestsInfo.length; x++) {
        table.row.add([
            requestsInfo[x].RequestID,
            requestsInfo[x].Type,
            requestsInfo[x].Subunit,
            requestsInfo[x].Date,
            requestsInfo[x].Status,
            requestsInfo[x].Assigned
        ]).draw();
    }

    $('#DataTables_Table_1 tbody').on( 'click', 'tr', function () {
        var data = table.row( $(this) ).data();
        console.log('row id: ' + data[0]);
        if(data[1].localeCompare("Travel Request")==0 || data[1].localeCompare("Travel Reimbursement")==0){
            directToSummary(data[0]);
        }else{
            sendRequestId(data[0]);
        }
    } );
}


function sendRequestId(request_id) {
    EngineUI.setRequestID( request_id);
    window.location.href = "../../../html/ltr/users/user-request-detailpage.html";
}

/**
 * Welcome messages
 */
function update_Dashboard_welcomebar_navigationbar() {
    
    //Now welcome mesaage
    const welcome_message = welcomeMessage() + " " + sessionStorage.getItem("name").split(" ")[0] + " !";
    document.getElementById("welcome_userName").innerHTML = "<b>"+welcome_message+"</b>";
    //adding unit name
    document.getElementById("welcome-unitName").innerHTML = '<i class="feather icon-map-pin"></i> ' + EngineUI.getSubunitName();

}

/**
 * Get all request information from getAllOrders api
 */
function getAllRequestsInfo() {
    var onSuccess = function(data) {
        if (data.status == true) {
            var n = data.data.length;
            for (var i = 0; i < n; i++) {
                var info = data.data[i];
                var id = info._id;
                var type = info.OrderType;
                var date = info.submittedOn.substr(0, 10);
                var status = info.OrderStatus;
                var assigned = info.assignedTo;
                var temp = JSON.parse(data.data[i].OrderInfo);
                if (assigned) { // take button cell
                    assignedValue = info.assignedTo_name;
                } else {
                    assignedValue = "Not assigned yet";
                }
                requestsInfo.push({
                    RequestID: id,
                    Type: type,
                    Subunit: EngineUI.getSubunitName(),
                    Date: date,
                    Status: status,
                    Assigned: assignedValue,
                    OrderInfo: temp,
                });
                reqIdMap.set(id, i);
            }
        } else {
            //error message
            console.log('error');
        }
    }

    var onFailure = function() {
        // failure message
    }

    makeGetRequest("getOrders/" + EngineUI.getId(), onSuccess, onFailure);
}

/**
 * Get all users information from getuserInformation api
 * @param {int} user_id extract from users global array
 */
function getUserInfo() {
    //alert("getUserInfo");
    var onSuccess = function(data) {
        if (data.status == true) {
            console.log("user information is here");
            console.log(data.data);
            var level = data.data.AccessLevel;
            if (level == "Submitter" || level == "Approver") {
                type = "subunit";
                unit_id = data.data.SubUnitID;
            } else if (level == "Fiscal Staff" || level == "Fiscal Administrator") {
                type = "unit";
                unit_id = data.data.UnitID;
            }
            user_name = data.data.userInfo.Name;
            user_uwid=data.data.userInfo.UWID;
            user_email=data.data.userInfo.email;
            user_subunitName=data.data.SubUnitName;
            user_accessLevel=data.data.AccessLevel;
        } else {
            //error message
        }
    }
    var onFailure = function() {
        // failure message
    }

    makeGetRequest("getuserInformation/" + user_id, onSuccess, onFailure);
}

//------------------------------------------------------------------------------------
//Haotian Yuan
function directToSummary(orderId){
    var index=0;
    for (var x = 0; x < requestsInfo.length; x++) {
        if(requestsInfo[x].RequestID.localeCompare(orderId)==0){
            index=x;
            break;
        }
    }
    var temp = requestsInfo[x].OrderInfo;
    if(requestsInfo[x].Type.localeCompare("Travel Request")==0){
        if(temp.LineItems[0].Budgets.length==1){
            EngineUI.setOrderId(orderId);
            EngineUI.setUser_id(user_id);
            EngineUI.setUser_name(user_name);
            EngineUI.setUser_uwid(user_uwid);
            EngineUI.setUser_email(user_email);
            EngineUI.setUser_subunitName(user_subunitName);
            EngineUI.setUser_AccessLevel(user_accessLevel);
            EngineUI.setRequestType(requestsInfo[index].Type);
            EngineUI.setSubmit_date(requestsInfo[index].Date);
            EngineUI.setStatus(requestsInfo[index].Status);
            EngineUI.setAmount(requestsInfo[index].Amount);
            EngineUI.setFirstname(temp.FirstName);
            EngineUI.setLastname(temp.LastName);
            EngineUI.setDeparture(temp.Departure);
            EngineUI.setDestionation(temp.Destination);
            EngineUI.setDate(temp.Date);
            EngineUI.setReturndate(temp.ReturnDate);
            EngineUI.setReason(temp.Reason);
            EngineUI.setFlight(temp.Flight);
            EngineUI.setFlight_company(temp.FlightCompany);
            EngineUI.setFlight_number(temp.FlightNumber);
            EngineUI.setFlight_from(temp.FlightFrom);
            EngineUI.setFlight_to(temp.FlightTo);
            EngineUI.setFlight_departdate(temp.FlightDepartingDate);
            EngineUI.setFlight_returndate(temp.FlightReturningDate);
            EngineUI.setFlight_amount(temp.FlightAmount);
            EngineUI.setHotel(temp.Hotel);
            EngineUI.setHotel_name(temp.HotelName);
            EngineUI.setHotel_address(temp.HotelAddress);
            EngineUI.setHotel_num(temp.HotelNum);
            EngineUI.setHotel_zip(temp.HotelZip);
            EngineUI.setHotel_amount(temp.HotelAmount);
            EngineUI.setHotel_link(temp.HotelLink);
            EngineUI.setFlight_reference(temp.FlightReference);
            EngineUI.setHotel_note(temp.HotelNote);
            EngineUI.setBirthday(temp.Birthday);
            EngineUI.setNote(temp.NoteFromApprover);
            EngineUI.setBudget1(temp.LineItems[0].Budgets[0].Number);
            EngineUI.setSplit1(temp.LineItems[0].Budgets[0].Split);
            EngineUI.setBudget_length(temp.LineItems[0].Budgets.length);
            EngineUI.setBudget2(null);
            EngineUI.setSplit2(null);
            EngineUI.setHotel_movein(temp.HotelMovein);
            EngineUI.setHotel_moveout(temp.HotelMoveout);
            window.location.href = "summary.html";
        }else{
            EngineUI.setOrderId(orderId);
            EngineUI.setUser_id(user_id);
            EngineUI.setUser_name(user_name);
            EngineUI.setUser_uwid(user_uwid);
            EngineUI.setUser_email(user_email);
            EngineUI.setUser_subunitName(user_subunitName);
            EngineUI.setUser_AccessLevel(user_accessLevel);
            EngineUI.setRequestType(requestsInfo[index].Type);
            EngineUI.setSubmit_date(requestsInfo[index].Date);
            EngineUI.setStatus(requestsInfo[index].Status);
            EngineUI.setAmount(requestsInfo[index].Amount);
            EngineUI.setFirstname(temp.FirstName);
            EngineUI.setLastname(temp.LastName);
            EngineUI.setDeparture(temp.Departure);
            EngineUI.setDestionation(temp.Destination);
            EngineUI.setDate(temp.Date);
            EngineUI.setReturndate(temp.ReturnDate);
            EngineUI.setReason(temp.Reason);
            EngineUI.setFlight(temp.Flight);
            EngineUI.setFlight_company(temp.FlightCompany);
            EngineUI.setFlight_number(temp.FlightNumber);
            EngineUI.setFlight_from(temp.FlightFrom);
            EngineUI.setFlight_to(temp.FlightTo);
            EngineUI.setFlight_departdate(temp.FlightDepartingDate);
            EngineUI.setFlight_returndate(temp.FlightReturningDate);
            EngineUI.setFlight_amount(temp.FlightAmount);
            EngineUI.setHotel(temp.Hotel);
            EngineUI.setHotel_name(temp.HotelName);
            EngineUI.setHotel_address(temp.HotelAddress);
            EngineUI.setHotel_num(temp.HotelNum);
            EngineUI.setHotel_zip(temp.HotelZip);
            EngineUI.setHotel_amount(temp.HotelAmount);
            EngineUI.setHotel_link(temp.HotelLink);
            EngineUI.setFlight_reference(temp.FlightReference);
            EngineUI.setHotel_note(temp.HotelNote);
            EngineUI.setBirthday(temp.Birthday);
            EngineUI.setNote(temp.NoteFromApprover);
            EngineUI.setBudget1(temp.LineItems[0].Budgets[0].Number);
            EngineUI.setSplit1(temp.LineItems[0].Budgets[0].Split);
            EngineUI.setBudget_length(temp.LineItems[0].Budgets.length);
            EngineUI.setBudget2(temp.LineItems[0].Budgets[1].Number);
            EngineUI.setSplit2(temp.LineItems[0].Budgets[1].Split);
            EngineUI.setHotel_movein(temp.HotelMovein);
            EngineUI.setHotel_moveout(temp.HotelMoveout);
            window.location.href = "summary.html";
        }
    }else if(requestsInfo[x].Type.localeCompare("Travel Reimbursement")==0){
        if(temp.LineItems[0].Budgets.length==1){
            EngineUI.setOrderId(orderId);
            EngineUI.setUser_id(user_id);
            EngineUI.setUser_name(user_name);
            EngineUI.setUser_uwid(user_uwid);
            EngineUI.setUser_email(user_email);
            EngineUI.setUser_subunitName(user_subunitName);
            EngineUI.setUser_AccessLevel(user_accessLevel);
            EngineUI.setRequestType(requestsInfo[index].Type);
            EngineUI.setSubmit_date(requestsInfo[index].Date);
            EngineUI.setStatus(requestsInfo[index].Status);
            EngineUI.setNote(temp.NoteFromApprover);
            EngineUI.setBudget1(temp.LineItems[0].Budgets[0].Number);
            EngineUI.setSplit1(temp.LineItems[0].Budgets[0].Split);
            EngineUI.setBudget_length(temp.LineItems[0].Budgets.length);
            EngineUI.setBudget2(null);
            EngineUI.setSplit2(null);
            EngineUI.setTravelBefore(temp.TravelBefore);
            EngineUI.setReferenceNumber(temp.ReferenceNumber);
            EngineUI.setForMyself(temp.ForMyself);
            EngineUI.setSomeoneName(temp.SomeoneName);
            EngineUI.setSomeoneAffliation(temp.SomeoneAffliation);
            EngineUI.setSomeoneEmail(temp.SomeoneEmail);
            EngineUI.setUS(temp.UScitizen);
            EngineUI.setPurpose(temp.Purpose);
            EngineUI.setPersonalTravel(temp.PersonalTravel);
            EngineUI.setPersonalTravelDetails(temp.PersonalTravelDetail);
            EngineUI.setRegistration(temp.Registration);
            EngineUI.setAirfare(temp.AirFare);
            EngineUI.setCar(temp.Car);
            EngineUI.setTrain(temp.Train);
            EngineUI.setCarRental(temp.CarRental);
            EngineUI.setHotelFee(temp.HotelFee);
            EngineUI.setVisa_file(temp.Visa_file);
            EngineUI.setPassport_file(temp.Passport_file);
            EngineUI.setAirfare_file(temp.Airfare_file);
            EngineUI.setTrain_file(temp.Train_file);
            EngineUI.setRental_file(temp.Rental_file);
            EngineUI.setHotel_file(temp.Hotel_file);
            EngineUI.setMeal(temp.Meal);
            EngineUI.setMeal_amount(temp.Meal_amount);
            EngineUI.setMealProvided(temp.MealProvided);
            EngineUI.setRegistration_file(temp.Registration_file);
            EngineUI.setCar_file(temp.Car_file);
            EngineUI.setAmount(temp.amount);
            window.location.href = "summary-travelReimbursement.html";
        }else{
            EngineUI.setOrderId(orderId);
            EngineUI.setUser_id(user_id);
            EngineUI.setUser_name(user_name);
            EngineUI.setUser_uwid(user_uwid);
            EngineUI.setUser_email(user_email);
            EngineUI.setUser_subunitName(user_subunitName);
            EngineUI.setUser_AccessLevel(user_accessLevel);
            EngineUI.setRequestType(requestsInfo[index].Type);
            EngineUI.setSubmit_date(requestsInfo[index].Date);
            EngineUI.setStatus(requestsInfo[index].Status);
            EngineUI.setNote(temp.NoteFromApprover);
            EngineUI.setBudget1(temp.LineItems[0].Budgets[0].Number);
            EngineUI.setSplit1(temp.LineItems[0].Budgets[0].Split);
            EngineUI.setBudget_length(temp.LineItems[0].Budgets.length);
            EngineUI.setBudget2(temp.LineItems[0].Budgets[1].Number);
            EngineUI.setSplit2(temp.LineItems[0].Budgets[1].Split);
            EngineUI.setTravelBefore(temp.TravelBefore);
            EngineUI.setReferenceNumber(temp.ReferenceNumber);
            EngineUI.setForMyself(temp.ForMyself);
            EngineUI.setSomeoneName(temp.SomeoneName);
            EngineUI.setSomeoneAffliation(temp.SomeoneAffliation);
            EngineUI.setSomeoneEmail(temp.SomeoneEmail);
            EngineUI.setUS(temp.UScitizen);
            EngineUI.setPurpose(temp.Purpose);
            EngineUI.setPersonalTravel(temp.PersonalTravel);
            EngineUI.setPersonalTravelDetails(temp.PersonalTravelDetail);
            EngineUI.setRegistration(temp.Registration);
            EngineUI.setAirfare(temp.AirFare);
            EngineUI.setCar(temp.Car);
            EngineUI.setTrain(temp.Train);
            EngineUI.setCarRental(temp.CarRental);
            EngineUI.setHotelFee(temp.HotelFee);
            EngineUI.setVisa_file(temp.Visa_file);
            EngineUI.setPassport_file(temp.Passport_file);
            EngineUI.setAirfare_file(temp.Airfare_file);
            EngineUI.setTrain_file(temp.Train_file);
            EngineUI.setRental_file(temp.Rental_file);
            EngineUI.setHotel_file(temp.Hotel_file);
            EngineUI.setMeal(temp.Meal);
            EngineUI.setMeal_amount(temp.Meal_amount);
            EngineUI.setMealProvided(temp.MealProvided);
            EngineUI.setRegistration_file(temp.Registration_file);
            EngineUI.setCar_file(temp.Car_file);
            EngineUI.setAmount(temp.amount);
            window.location.href = "summary-travelReimbursement.html";
        }
    }
}
//Haotian Yuan
//------------------------------------------------------------------------------------




