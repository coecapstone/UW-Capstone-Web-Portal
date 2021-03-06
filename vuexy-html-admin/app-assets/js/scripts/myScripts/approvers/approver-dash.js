var requestsInfo = [];
var requesters = [];
var subUnits = [];
var users = [];
var myReqArr = [];
var unitStaff = [];
let userInfoMap = new Map();
let reqIdMap = new Map(); // <K, V> -> <request id, request index in requestsInfo>
var user_name="";
var user_uwid="";
var user_email="";
var user_subunitName="";
var user_accessLevel="";

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

    // Prepare for modal
    this.prepareReassignSelector();
    
});


function updateAllRequestsTable() {
    var table = $("#DataTables_Table_1").DataTable({
        "order": [[4, "desc"]]
    });

    for (var x = 0; x < requestsInfo.length; x++) {
        table.row.add([
            requestsInfo[x].RequestID,
            requestsInfo[x].Requester,
            requestsInfo[x].Type,
            (requestsInfo[x].Subunit ? requestsInfo[x].Subunit : "(unknown)"),
            requestsInfo[x].Date,
            requestsInfo[x].Status
        ]).draw();
    }

    $('#DataTables_Table_1 tbody').on( 'click', 'tr', function () {
        var data = table.row( $(this) ).data();
        console.log('row id: ' + data[0]);
        if(data[2].localeCompare(EngineUI.ORDER_TYPE_TRAVEL_REQUEST)==0 || data[2].localeCompare(EngineUI.ORDER_TYPE_TRAVEL_REIMBURSEMENT)==0){
            directToSummary(data[0]);
        }else{
            sendRequestId(data[0]);
        }
    } );
}


function updateMyPendingRequestsTable() {

    var table = $("#DataTables_Table_0").DataTable({
        "order": [[0, "asc"]]
    });

    for (var i = 0; i < myReqArr.length; i++) {
        var x = reqIdMap.get(myReqArr[i].RequestID);
        table.row.add([
            requestsInfo[x].RequestID,
            requestsInfo[x].Requester,
            requestsInfo[x].Type,
            requestsInfo[x].Subunit,
            requestsInfo[x].Date,
            requestsInfo[x].Status
        ]).draw();
    }

    $('#DataTables_Table_0 tbody').on( 'click', 'tr', function () {
        var data = table.row( $(this) ).data();
        console.log('row id: ' + data[0]);
        if(data[2].localeCompare(EngineUI.ORDER_TYPE_TRAVEL_REQUEST)==0 || data[2].localeCompare(EngineUI.ORDER_TYPE_TRAVEL_REIMBURSEMENT)==0){
            directToSummary(data[0]);
        }else{
            sendRequestId(data[0]);
        }
    } );
}


function prepareReassignSelector() {
    getUnitFiscalStaff();
    var selector = document.getElementById("reassignSelect");
    for (var x = 0; x < unitStaff.length; x++) {
        var op = document.createElement('option');
        op.setAttribute('value', unitStaff[x].id);
        op.innerHTML = unitStaff[x].Name;
        selector.appendChild(op);
    }
}

function getUnitFiscalStaff() {
    var unit_id = EngineUI.getUnitID();
    var myself_id = EngineUI.getId();
    var onSuccess = function(data) {
        if (data.status == true) {
            var info = data.data;
            for (var i = 0; i < info.length; i++) {
                if (info[i]._id == myself_id) continue;
                unitStaff.push({
                    Name: info[i].Name,
                    id: info[i]._id
                });
            }
        } else {
            //error message
        }
    }

    var onFailure = function() {
        // failure message
    }

    makeGetRequest("units/getUserInfomation/" + unit_id, onSuccess, onFailure);
}

function modalReassignClicked(reqeust_id) {
    var selector = document.getElementById("reassignSelect");
    var assign_id = selector.value;
    var assign_name = null;
    if (assign_id) {
        assign_name = selector.options[selector.selectedIndex].text;
        updateAssignedInfo(reqeust_id, assign_id);
    } else {
        untakeRequest(reqeust_id);
    }
    $('#reassignModal').modal('hide');
    return assign_name;
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
                var requesterID = info.userID_ref;
                if (!userInfoMap.has(requesterID)) {
                    var userData = getUserInfo(requesterID);
                    userInfoMap.set(requesterID, {
                        name: userData.userInfo.Name,
                        subunit: userData.SubUnitName
                    });
                }
                var requester = userInfoMap.get(requesterID).name;
                var type = info.OrderType;
                var subunitName = userInfoMap.get(requesterID).subunit;
                var date = info.submittedOn.substr(0, 10);
                var status = info.OrderStatus;
                var assigned = info.assignedTo;
                if (status == "Approved" && assigned == null) { // take button cell
                    assignedValue = '<button type="button" class="btn mr-0 mb-0 btn-outline-primary btn-sm" name="takeButton">Take</button>';
                } else if (assigned == EngineUI.getId()) { // check cell
                    assignedValue = '<button type="button" class="btn mr-0 mb-0 btn-outline-danger btn-sm" name="untakeButton" data-toggle="modal" data-target="#reassignModal">Untake</button>';
                } else if (assigned != null) { // taken by others cell
                    assignedValue = getUserInfo(assigned).userInfo.Name;
                } else {
                    assignedValue = "Routing";
                }
                var temp = JSON.parse(info.OrderInfo);
                var userId = info.userID_ref;
                requestsInfo.push({
                    RequestID: id,
                    Requester: requester,
                    Type: type,
                    Subunit: subunitName,
                    Date: date,
                    Status: status,
                    Assigned: assignedValue,
                    OrderInfo: temp,
                    UserId: userId,
                });
                reqIdMap.set(id, i);
            }
        } else {
            //error message
        }
    }

    var onFailure = function() {
        // failure message
    }
    makeGetRequest("findApproverOrders/" + EngineUI.getId() + '/' + EngineUI.getSubunitID(), onSuccess, onFailure);
}

/**
 * Get all users information from getuserInformation api
 * @param {int} user_id extract from users global array
 */
function getUserInfo(user_id) {
    var info = null;
    var onSuccess = function(data) {
        if (data.status == true) {
            info = data.data;
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
            info = null;
        }
    }

    var onFailure = function() {
        // failure message
        info = null;
    }

    makeGetRequest("getuserInformation/" + user_id, onSuccess, onFailure);
    return info;
}

/**
 * Update the assigned information of this request when clicking take button
 * @param {int} request_id request id
 */
function updateAssignedInfo(request_id, assign_id) {
    var onSuccess = function(data) {
        if (data.status == true) {
           console.log("assigned success!");
        } else {
            //error message
        }
    }

    var onFailure = function() {
        // failure message
    }

    makePostRequest("assignOrder/" + request_id + "/" + assign_id, onSuccess, onFailure);
}

/**
 * Untake the taken request without reassigning to others
 * @param {int} request_id request id
 */
function untakeRequest(request_id) {
    var onSuccess = function(data) {
        if (data.status == true) {
           console.log("untake success!");
        } else {
            //error message
        }
    }

    var onFailure = function() {
        // failure message
    }

    makeGetRequest("untakeOrder/" + request_id, onSuccess, onFailure);
}

/**
 * Get assigned Requests from database
 */
function getMyPendingRequestsInfo() {
    myReqArr = [];
    var onSuccess = function(data) {
        if (data.status == true) {
            // console.log("my pending requests information is here");
            // console.log(data.data);
            var info = data.data;
            for (var i = 0; i < info.length; i++) {
                var requesterID = info[i].userID_ref;
                if (!userInfoMap.has(requesterID)) {
                    var userData = getUserInfo(requesterID);
                    userInfoMap.set(requesterID, {
                        name: userData.userInfo.Name,
                        subunit: userData.SubUnitName
                    });
                }
                var requester = userInfoMap.get(requesterID).name;
                myReqArr.push({
                    RequestID: info[i]._id,
                    Requester: requester,
                    Type: info[i].OrderType,
                    Date: info[i].submittedOn.substr(0,10)
                });
            }
        } else {
            //error message
        }
    }

    var onFailure = function() {
        // failure message
    }

    makeGetRequest("getAssignedOrders/" + EngineUI.getId(), onSuccess, onFailure);
}


/**
 * Generate the pending request card component
 * @param {int} request_id 
 * @param {string} requester 
 * @param {string} type 
 * @param {string} date 
 */
function genPendingRequestCard(request_id, requester, type, date) {
    var box = document.createElement('div');
    box.setAttribute('class', 'col-xl-4 col-md-6 col-sm-12');
    var card = document.createElement('div');
    card.setAttribute('class', 'card');
    var content = document.createElement('div');
    content.setAttribute('class', 'card-content');
    
    var body_block = document.createElement('div');
    body_block.setAttribute('class', 'card-body');

    var request_id_block = document.createElement('h5');
    request_id_block.setAttribute('class', 'mt-1');
    request_id_block.innerHTML = "#" + request_id;

    var requester_block = document.createElement('p');
    requester_block.setAttribute('class', 'card-text');
    requester_block.innerHTML = "By " + requester;

    var hr = document.createElement('hr');
    hr.setAttribute('class', 'my-1');

    var down_block = document.createElement('div');
    down_block.setAttribute('class', 'd-flex justify-content-between mt-2');

    var left_block = document.createElement('div');
    left_block.setAttribute('class', 'float-left');
    var type_block = document.createElement('p');
    type_block.setAttribute('class', 'font-medium-2 mb-0');
    type_block.innerHTML = type;
    var type_label = document.createElement('p');
    type_label.innerHTML = "Type";
    left_block.appendChild(type_block);
    left_block.appendChild(type_label);

    var right_block = document.createElement('div');
    right_block.setAttribute('class', 'float-right');
    var date_block = document.createElement('p');
    date_block.setAttribute('class', 'font-medium-2 mb-0');
    date_block.innerHTML = date;
    var date_label = document.createElement('p');
    date_label.innerHTML = "Submitted Date";
    right_block.appendChild(date_block);
    right_block.appendChild(date_label);

    down_block.appendChild(left_block);
    down_block.appendChild(right_block);
    
    var edit_btn = document.createElement('button');
    edit_btn.setAttribute('type', 'button');
    edit_btn.setAttribute('class', 'btn gradient-light-primary btn-block mt-2');
    edit_btn.setAttribute('id', "edit_" + request_id);
    edit_btn.setAttribute('onclick',`sendRequestId('${request_id}');`);
    edit_btn.innerHTML = "Edit";

    body_block.appendChild(request_id_block);
    body_block.appendChild(requester_block);
    body_block.appendChild(hr);
    body_block.appendChild(down_block);
    body_block.appendChild(edit_btn);

    content.appendChild(body_block);
    card.appendChild(content);
    box.appendChild(card);
    return box;
}

function sendRequestId(request_id) {
    EngineUI.setRequestID( request_id);
    window.location.href = "../../../html/ltr/approvers/approver-request-detail.html";
}

/**
 * Update my pending request cards
 */
function updatePendingCards() {
    var card_block = document.getElementById('card_block');
    card_block.innerHTML = '';
    // console.log(myReqArr);
    for (var i = 0; i < myReqArr.length; i++) {
        card_block.appendChild(genPendingRequestCard(myReqArr[i].RequestID, 
            myReqArr[i].Requester, myReqArr[i].Type, myReqArr[i].Date));
    }
}//------------------------------------------------------------------------------------
//Haotian Yuan
function directToSummary(orderId){
    var index=0;
    for (var x = 0; x < requestsInfo.length; x++) {
        if(requestsInfo[x].RequestID.localeCompare(orderId)==0){
            index=x;
            break;
        }
    }
    var temp = requestsInfo[index].OrderInfo;
    getUserInfo(requestsInfo[index].UserId);
    if(requestsInfo[x].Type.localeCompare(EngineUI.ORDER_TYPE_TRAVEL_REQUEST)==0){
        if(temp.LineItems[0].Budgets.length==1){
            EngineUI.setOrderId(orderId);
            EngineUI.setUser_id(requestsInfo[index].UserId);
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
            EngineUI.setUser_id(requestsInfo[index].UserId);
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
    }else if(requestsInfo[x].Type.localeCompare(EngineUI.ORDER_TYPE_TRAVEL_REIMBURSEMENT)==0){
        if(temp.LineItems[0].Budgets.length==1){
            EngineUI.setOrderId(orderId);
            EngineUI.setUser_id(requestsInfo[index].UserId);
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
            EngineUI.setUser_id(requestsInfo[index].UserId);
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
