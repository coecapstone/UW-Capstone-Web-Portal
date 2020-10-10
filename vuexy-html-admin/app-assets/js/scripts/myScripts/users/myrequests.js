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
var user_id = "5e8e45eea148b9004420651f";
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

    this.getUserInfo();
    
};


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
    window.sessionStorage.setItem('RequestID', request_id);
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
    document.getElementById("welcome-unitName").innerHTML = '<i class="feather icon-map-pin"></i> ' + sessionStorage.getItem("subunitName");

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
                    Subunit: window.sessionStorage.getItem('subunitName'),
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

    makeGetRequest("getOrders/" + window.sessionStorage.getItem('id'), onSuccess, onFailure);
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
            window.sessionStorage.setItem('orderId',orderId);
            window.sessionStorage.setItem('user_id',user_id);
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
            window.sessionStorage.setItem('user_id',user_id);
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
            window.sessionStorage.setItem('user_id',user_id);
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
            window.sessionStorage.setItem('user_id',user_id);
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
//Haotian Yuan
//------------------------------------------------------------------------------------




