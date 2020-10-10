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

/**
 * Initialize the window
 * Since we cannot get all needed information just from getAllOrders api
 * So we need to get users id from getAllOrders api, store them in users array,
 * and then get userInfo one by one,
 * then getAllOrders again and write to the requestsInfo global array
 */
window.onload = function() {
    update_Dashboard_welcomebar_navigationbar();

    // All requests table
    this.getAllRequestsInfo();
    this.updateAllRequestsTable();

    // My pending request table and card
    this.getMyPendingRequestsInfo();
    this.updatePendingCards();
    this.updateMyPendingRequestsTable();

    $("input:radio[name='my-pending-format']").on('change', function () {
        $("#my-pending-box").toggleClass("hidden");
        $("#my-pending-table").toggleClass("hidden");
    });

    // Prepare for modal
    this.prepareReassignSelector();
    
};


function updateAllRequestsTable() {
    var table = $("#DataTables_Table_1").DataTable({
        "order": [[4, "desc"]]
    });

    for (var x = 0; x < requestsInfo.length; x++) {
        table.row.add([
            requestsInfo[x].RequestID,
            requestsInfo[x].Requester,
            requestsInfo[x].Type,
            requestsInfo[x].Subunit,
            requestsInfo[x].Date,
            requestsInfo[x].Status,
            requestsInfo[x].Assigned
        ]).draw();
    }

    $('#DataTables_Table_1 tbody').on( 'click', 'tr td:not(:last-child)', function () {
        var data = table.row( $(this).parents('tr') ).data();
        console.log('row id: ' + data[0]);
        if(data[2].localeCompare("Travel Request")==0 || data[2].localeCompare("Travel Reimbursement")==0){
            directToSummary(data[0]);
        }else{
            sendRequestId(data[0]);
        }
    } );
    
    $('#DataTables_Table_1 tbody').on( 'click', "button[name='takeButton']", function () {
        var data = table.row( $(this).parents('tr') ).data();
        // console.log('take id: ' + data[0]);
        var cell = table.cell($(this).parents('td'));
        cell.data('<button type="button" class="btn mr-0 mb-0 btn-outline-danger btn-sm" name="untakeButton" data-toggle="modal" data-target="#reassignModal">Untake</button>').draw();
        var assign_id = window.sessionStorage.getItem("id");
        updateAssignedInfo(data[0], assign_id);
        sendRequestHistory(data[0], "Assigned");

        getMyPendingRequestsInfo();
        updatePendingCards();

        // update datatable
        var table_0 = $("#DataTables_Table_0").DataTable().clear().draw();
        for (var i = 0; i < myReqArr.length; i++) {
            var x = reqIdMap.get(myReqArr[i].RequestID);
            table_0.row.add([
                requestsInfo[x].RequestID,
                requestsInfo[x].Requester,
                requestsInfo[x].Type,
                requestsInfo[x].Subunit,
                requestsInfo[x].Date,
                requestsInfo[x].Status
            ]).draw();
        }
    } );

    $('#DataTables_Table_1 tbody').on( 'click', "button[name='untakeButton']", function () {
        var data = table.row( $(this).parents('tr') ).data();
        console.log('untake id: ' + data[0]);
        var cell = table.cell( $(this).parents('td') );
        $('#reassignModal').on('click', "button[name='reassign']", function() {
            var newAssign = modalReassignClicked(data[0]);
            if (newAssign) {
                cell.data(newAssign).draw();
            } else {
                cell.data('<button type="button" class="btn mr-0 mb-0 btn-outline-primary btn-sm" name="takeButton">Take</button>');
            }
            getMyPendingRequestsInfo();
            updatePendingCards();
            
            // update datatable
            var table_0 = $("#DataTables_Table_0").DataTable().clear().draw();
            for (var i = 0; i < myReqArr.length; i++) {
                var x = reqIdMap.get(myReqArr[i].RequestID);
                table_0.row.add([
                    requestsInfo[x].RequestID,
                    requestsInfo[x].Requester,
                    requestsInfo[x].Type,
                    requestsInfo[x].Subunit,
                    requestsInfo[x].Date,
                    requestsInfo[x].Status
                ]).draw();
            }
        });
        
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
        console.log(data);
        if(data[2].localeCompare("Travel Request")==0 || data[2].localeCompare("Travel Reimbursement")==0){
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
    var unit_id = window.sessionStorage.getItem("unitID");
    var myself_id = window.sessionStorage.getItem("id");
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

function modalReassignClicked(request_id) {
    var selector = document.getElementById("reassignSelect");
    var assign_id = selector.value;
    var assign_name = null;
    if (assign_id) {
        assign_name = selector.options[selector.selectedIndex].text;
        updateAssignedInfo(request_id, assign_id);
        sendRequestHistory(request_id, "Reassigned to " + assign_name);
    } else {
        untakeRequest(request_id);
        sendRequestHistory(request_id, "Untaken");
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
    document.getElementById("welcome-unitName").innerHTML = '<i class="feather icon-map-pin"></i> ' + sessionStorage.getItem("unitName");

}

/**
 * Get all users id of all requests from datebase
 * @param {array} users store all users id
 */
function getAllUsers() {
    var onSuccess = function(data) {
        if (data.status == true) {
            var data_subunits = data.data.SubUnits;
            for (var i = 0; i < data_subunits.length; i++) {
                var info = data_subunits[i].orders;
                for (var j = 0; j < info.length; j++) {
                    users.push(info[j].userID_ref);
                }
            }
        } else {
            //error message
        }
    }

    var onFailure = function() {
        // failure message
    }

    makeGetRequest("findOrdersForFiscal/" + window.sessionStorage.getItem("unitID"), onSuccess, onFailure);
}

/**
 * Get all request information from getAllOrders api
 */
function getAllRequestsInfo() {
    var onSuccess = function(data) {
        if (data.status == true) {
            var data_subunits = data.data.SubUnits;
            for (var i = 0; i < data_subunits.length; i++) {
                var info = data_subunits[i].orders;
                for (var j = 0; j < info.length; j++) {
                    var id = info[j]._id;
                    var requesterID = info[j].userID_ref;
                    if (!userInfoMap.has(requesterID)) {
                        var userData = getUserInfo(requesterID);
                        userInfoMap.set(requesterID, {
                            name: userData.userInfo.Name,
                            subunit: userData.SubUnitName
                        });
                    }
                    var requester = userInfoMap.get(requesterID).name;
                    var type = info[j].OrderType;
                    var subunitName = userInfoMap.get(requesterID).subunit;
                    var date = info[j].submittedOn.substr(0, 10);
                    var status = info[j].OrderStatus;
                    var assigned = info[j].assignedTo;
                    if (status == "Approved" && assigned == null) { // take button cell
                        assignedValue = '<button type="button" class="btn mr-0 mb-0 btn-outline-primary btn-sm" name="takeButton">Take</button>';
                    } else if (assigned == window.sessionStorage.getItem("id")) { // check cell
                        assignedValue = '<button type="button" class="btn mr-0 mb-0 btn-outline-danger btn-sm" name="untakeButton" data-toggle="modal" data-target="#reassignModal">Untake</button>';
                    } else if (assigned != null) { // taken by others cell
                        assignedValue = getUserInfo(assigned).userInfo.Name;
                    } else {
                        assignedValue = "Routing";
                    }
                    var temp = JSON.parse(info[j].OrderInfo);
                    var userId = info[j].userID_ref;
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
                    reqIdMap.set(id, j);
                }
            }            
        } else {
            //error message
        }
    }

    var onFailure = function() {
        // failure message
    }

    makeGetRequest("findOrdersForFiscal/" + window.sessionStorage.getItem("unitID"), onSuccess, onFailure);
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

function sendRequestHistory(request_id, actionstr) {
    var history = {
        userName: window.sessionStorage.getItem("id"),
        action: actionstr
    };

    var onSuccess = function(data) {
        if (data.status == true) {
            console.log("update success");
        } else {
            //error message
        }
    }

    var onFailure = function() {
        // failure message
    }
    makePostRequest("updateOrderHistory/" + request_id, history, onSuccess, onFailure);
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

    makeGetRequest("getAssignedOrders/" + window.sessionStorage.getItem("id"), onSuccess, onFailure);
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
    console.log(type);
    if(type.localeCompare("Travel Request")==0 || type.localeCompare("Travel Reimbursement")==0){
        edit_btn.setAttribute('onclick',`directToSummary('${request_id}');`);
    }else{
        edit_btn.setAttribute('onclick',`sendRequestId('${request_id}');`);
    }
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
    window.sessionStorage.setItem('RequestID', request_id);
    window.location.href = "../../../html/ltr/buyers/buyer-request-detail.html";
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
    var temp = requestsInfo[index].OrderInfo;
    getUserInfo(requestsInfo[index].UserId);
    if(requestsInfo[x].Type.localeCompare("Travel Request")==0){
        if(temp.LineItems[0].Budgets.length==1){
            window.sessionStorage.setItem('orderId',orderId);
            window.sessionStorage.setItem('user_id',requestsInfo[index].UserId);
            window.sessionStorage.setItem('user_name',user_name);
            window.sessionStorage.setItem('user_uwid',user_uwid);
            window.sessionStorage.setItem('user_email',user_email);
            window.sessionStorage.setItem('user_subunitName',user_subunitName);
            window.sessionStorage.setItem('user_AccessLevel',user_accessLevel);
            window.sessionStorage.setItem('type',requestsInfo[index].Type);
            window.sessionStorage.setItem('submit_date',requestsInfo[index].Date);
            window.sessionStorage.setItem('status',requestsInfo[index].Status);
            window.sessionStorage.setItem('amount',requestsInfo[index].Amount);
            window.sessionStorage.setItem('firstname',temp.FirstName);
            window.sessionStorage.setItem('lastname',temp.LastName);
            window.sessionStorage.setItem('departure',temp.Departure);
            window.sessionStorage.setItem('destionation',temp.Destination);
            window.sessionStorage.setItem('date',temp.Date);
            window.sessionStorage.setItem('returndate',temp.ReturnDate);
            window.sessionStorage.setItem('reason',temp.Reason);
            window.sessionStorage.setItem('flight',temp.Flight);
            window.sessionStorage.setItem('flight_company',temp.FlightCompany);
            window.sessionStorage.setItem('flight_number',temp.FlightNumber);
            window.sessionStorage.setItem('flight_from',temp.FlightFrom);
            window.sessionStorage.setItem('flight_to',temp.FlightTo);
            window.sessionStorage.setItem('flight_departdate',temp.FlightDepartingDate);
            window.sessionStorage.setItem('flight_returndate',temp.FlightReturningDate);
            window.sessionStorage.setItem('flight_amount',temp.FlightAmount);
            window.sessionStorage.setItem('hotel',temp.Hotel);
            window.sessionStorage.setItem('hotel_name',temp.HotelName);
            window.sessionStorage.setItem('hotel_address',temp.HotelAddress);
            window.sessionStorage.setItem('hotel_num',temp.HotelNum);
            window.sessionStorage.setItem('hotel_zip',temp.HotelZip);
            window.sessionStorage.setItem('hotel_amount',temp.HotelAmount);
            window.sessionStorage.setItem('hotel_link',temp.HotelLink);
            window.sessionStorage.setItem('flight_reference',temp.FlightReference);
            window.sessionStorage.setItem('hotel_note',temp.HotelNote);
            window.sessionStorage.setItem('birthday',temp.Birthday);
            window.sessionStorage.setItem('note',temp.NoteFromApprover);
            window.sessionStorage.setItem('budget1',temp.LineItems[0].Budgets[0].Number);
            window.sessionStorage.setItem('split1',temp.LineItems[0].Budgets[0].Split);
            window.sessionStorage.setItem('budget_length',temp.LineItems[0].Budgets.length);
            window.sessionStorage.setItem('budget2',null);
            window.sessionStorage.setItem('split2',null);
            window.sessionStorage.setItem('hotel_movein',temp.HotelMovein);
            window.sessionStorage.setItem('hotel_moveout',temp.HotelMoveout);
            window.location.href = "summary.html";
        }else{
            window.sessionStorage.setItem('orderId',orderId);
            window.sessionStorage.setItem('user_id',requestsInfo[index].UserId);
            window.sessionStorage.setItem('user_name',user_name);
            window.sessionStorage.setItem('user_uwid',user_uwid);
            window.sessionStorage.setItem('user_email',user_email);
            window.sessionStorage.setItem('user_subunitName',user_subunitName);
            window.sessionStorage.setItem('user_AccessLevel',user_accessLevel);
            window.sessionStorage.setItem('type',requestsInfo[index].Type);
            window.sessionStorage.setItem('submit_date',requestsInfo[index].Date);
            window.sessionStorage.setItem('status',requestsInfo[index].Status);
            window.sessionStorage.setItem('amount',requestsInfo[index].Amount);
            window.sessionStorage.setItem('firstname',temp.FirstName);
            window.sessionStorage.setItem('lastname',temp.LastName);
            window.sessionStorage.setItem('departure',temp.Departure);
            window.sessionStorage.setItem('destionation',temp.Destination);
            window.sessionStorage.setItem('date',temp.Date);
            window.sessionStorage.setItem('returndate',temp.ReturnDate);
            window.sessionStorage.setItem('reason',temp.Reason);
            window.sessionStorage.setItem('flight',temp.Flight);
            window.sessionStorage.setItem('flight_company',temp.FlightCompany);
            window.sessionStorage.setItem('flight_number',temp.FlightNumber);
            window.sessionStorage.setItem('flight_from',temp.FlightFrom);
            window.sessionStorage.setItem('flight_to',temp.FlightTo);
            window.sessionStorage.setItem('flight_departdate',temp.FlightDepartingDate);
            window.sessionStorage.setItem('flight_returndate',temp.FlightReturningDate);
            window.sessionStorage.setItem('flight_amount',temp.FlightAmount);
            window.sessionStorage.setItem('hotel',temp.Hotel);
            window.sessionStorage.setItem('hotel_name',temp.HotelName);
            window.sessionStorage.setItem('hotel_address',temp.HotelAddress);
            window.sessionStorage.setItem('hotel_num',temp.HotelNum);
            window.sessionStorage.setItem('hotel_zip',temp.HotelZip);
            window.sessionStorage.setItem('hotel_amount',temp.HotelAmount);
            window.sessionStorage.setItem('hotel_link',temp.HotelLink);
            window.sessionStorage.setItem('flight_reference',temp.FlightReference);
            window.sessionStorage.setItem('hotel_note',temp.HotelNote);
            window.sessionStorage.setItem('birthday',temp.Birthday);
            window.sessionStorage.setItem('note',temp.NoteFromApprover);
            window.sessionStorage.setItem('budget1',temp.LineItems[0].Budgets[0].Number);
            window.sessionStorage.setItem('split1',temp.LineItems[0].Budgets[0].Split);
            window.sessionStorage.setItem('budget_length',temp.LineItems[0].Budgets.length);
            window.sessionStorage.setItem('budget2',temp.LineItems[0].Budgets[1].Number);
            window.sessionStorage.setItem('split2',temp.LineItems[0].Budgets[1].Split);
            window.sessionStorage.setItem('hotel_movein',temp.HotelMovein);
            window.sessionStorage.setItem('hotel_moveout',temp.HotelMoveout);
            window.location.href = "summary.html";
        }
    }else if(requestsInfo[x].Type.localeCompare("Travel Reimbursement")==0){
        if(temp.LineItems[0].Budgets.length==1){
            window.sessionStorage.setItem('orderId',orderId);
            window.sessionStorage.setItem('user_id',requestsInfo[index].UserId);
            window.sessionStorage.setItem('user_name',user_name);
            window.sessionStorage.setItem('user_uwid',user_uwid);
            window.sessionStorage.setItem('user_email',user_email);
            window.sessionStorage.setItem('user_subunitName',user_subunitName);
            window.sessionStorage.setItem('user_AccessLevel',user_accessLevel);
            window.sessionStorage.setItem('type',requestsInfo[index].Type);
            window.sessionStorage.setItem('submit_date',requestsInfo[index].Date);
            window.sessionStorage.setItem('status',requestsInfo[index].Status);
            window.sessionStorage.setItem('note',temp.NoteFromApprover);
            window.sessionStorage.setItem('budget1',temp.LineItems[0].Budgets[0].Number);
            window.sessionStorage.setItem('split1',temp.LineItems[0].Budgets[0].Split);
            window.sessionStorage.setItem('budget_length',temp.LineItems[0].Budgets.length);
            window.sessionStorage.setItem('budget2',null);
            window.sessionStorage.setItem('split2',null);
            window.sessionStorage.setItem('TravelBefore',temp.TravelBefore);
            window.sessionStorage.setItem('ReferenceNumber',temp.ReferenceNumber);
            window.sessionStorage.setItem('ForMyself',temp.ForMyself);
            window.sessionStorage.setItem('SomeoneName',temp.SomeoneName);
            window.sessionStorage.setItem('SomeoneAffliation',temp.SomeoneAffliation);
            window.sessionStorage.setItem('SomeoneEmail',temp.SomeoneEmail);
            window.sessionStorage.setItem('US',temp.UScitizen);
            window.sessionStorage.setItem('purpose',temp.Purpose);
            window.sessionStorage.setItem('personalTravel',temp.PersonalTravel);
            window.sessionStorage.setItem('personalTravelDetails',temp.PersonalTravelDetail);
            window.sessionStorage.setItem('registration',temp.Registration);
            window.sessionStorage.setItem('airfare',temp.AirFare);
            window.sessionStorage.setItem('car',temp.Car);
            window.sessionStorage.setItem('train',temp.Train);
            window.sessionStorage.setItem('carRental',temp.CarRental);
            window.sessionStorage.setItem('hotelFee',temp.HotelFee);
            window.sessionStorage.setItem('visa_file',temp.Visa_file);
            window.sessionStorage.setItem('passport_file',temp.Passport_file);
            window.sessionStorage.setItem('airfare_file',temp.Airfare_file);
            window.sessionStorage.setItem('train_file',temp.Train_file);
            window.sessionStorage.setItem('rental_file',temp.Rental_file);
            window.sessionStorage.setItem('hotel_file',temp.Hotel_file);
            window.sessionStorage.setItem('meal',temp.Meal);
            window.sessionStorage.setItem('meal_amount',temp.Meal_amount);
            window.sessionStorage.setItem('mealProvided',temp.MealProvided);
            window.sessionStorage.setItem('registration_file',temp.Registration_file);
            window.sessionStorage.setItem('car_file',temp.Car_file);
            window.sessionStorage.setItem('amount',temp.amount);
            window.location.href = "summary-travelReimbursement.html";
        }else{
            window.sessionStorage.setItem('orderId',orderId);
            window.sessionStorage.setItem('user_id',requestsInfo[index].UserId);
            window.sessionStorage.setItem('user_name',user_name);
            window.sessionStorage.setItem('user_uwid',user_uwid);
            window.sessionStorage.setItem('user_email',user_email);
            window.sessionStorage.setItem('user_subunitName',user_subunitName);
            window.sessionStorage.setItem('user_AccessLevel',user_accessLevel);
            window.sessionStorage.setItem('type',requestsInfo[index].Type);
            window.sessionStorage.setItem('submit_date',requestsInfo[index].Date);
            window.sessionStorage.setItem('status',requestsInfo[index].Status);
            window.sessionStorage.setItem('note',temp.NoteFromApprover);
            window.sessionStorage.setItem('budget1',temp.LineItems[0].Budgets[0].Number);
            window.sessionStorage.setItem('split1',temp.LineItems[0].Budgets[0].Split);
            window.sessionStorage.setItem('budget_length',temp.LineItems[0].Budgets.length);
            window.sessionStorage.setItem('budget2',temp.LineItems[0].Budgets[1].Number);
            window.sessionStorage.setItem('split2',temp.LineItems[0].Budgets[1].Split);
            window.sessionStorage.setItem('TravelBefore',temp.TravelBefore);
            window.sessionStorage.setItem('ReferenceNumber',temp.ReferenceNumber);
            window.sessionStorage.setItem('ForMyself',temp.ForMyself);
            window.sessionStorage.setItem('SomeoneName',temp.SomeoneName);
            window.sessionStorage.setItem('SomeoneAffliation',temp.SomeoneAffliation);
            window.sessionStorage.setItem('SomeoneEmail',temp.SomeoneEmail);
            window.sessionStorage.setItem('US',temp.UScitizen);
            window.sessionStorage.setItem('purpose',temp.Purpose);
            window.sessionStorage.setItem('personalTravel',temp.PersonalTravel);
            window.sessionStorage.setItem('personalTravelDetails',temp.PersonalTravelDetail);
            window.sessionStorage.setItem('registration',temp.Registration);
            window.sessionStorage.setItem('airfare',temp.AirFare);
            window.sessionStorage.setItem('car',temp.Car);
            window.sessionStorage.setItem('train',temp.Train);
            window.sessionStorage.setItem('carRental',temp.CarRental);
            window.sessionStorage.setItem('hotelFee',temp.HotelFee);
            window.sessionStorage.setItem('visa_file',temp.Visa_file);
            window.sessionStorage.setItem('passport_file',temp.Passport_file);
            window.sessionStorage.setItem('airfare_file',temp.Airfare_file);
            window.sessionStorage.setItem('train_file',temp.Train_file);
            window.sessionStorage.setItem('rental_file',temp.Rental_file);
            window.sessionStorage.setItem('hotel_file',temp.Hotel_file);
            window.sessionStorage.setItem('meal',temp.Meal);
            window.sessionStorage.setItem('meal_amount',temp.Meal_amount);
            window.sessionStorage.setItem('mealProvided',temp.MealProvided);
            window.sessionStorage.setItem('registration_file',temp.Registration_file);
            window.sessionStorage.setItem('car_file',temp.Car_file);
            window.sessionStorage.setItem('amount',temp.amount);
            window.location.href = "summary-travelReimbursement.html";
        }
    }
}