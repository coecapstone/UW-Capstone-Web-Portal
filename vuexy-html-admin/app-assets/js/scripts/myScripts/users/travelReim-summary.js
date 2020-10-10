var reqApproverArr = [];
var reqBuyer = {};
let approverResponseMap = new Map(); // key: approverid, value: {name, response}

var feedbackBlock = document.getElementById("feedback-block");
var feedback = document.getElementById("feedback_input");

var request_id = null;
const baseURL = "https://uwcoe-api.azurewebsites.net/api/";
var user_id = "5e8e45eea148b9004420651f";
var userID = null;

// Template POst request Ajax call
var makePostRequest = function(url, data, onSuccess, onFailure) {
    $.ajax({
        async:false,
        type: 'POST',
        url: baseURL + url,
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: "json",
        success: onSuccess,
        error: onFailure
    });
};

// Template PUT request Ajax call
var makePutRequest = function(url, data, onSuccess, onFailure) {
    $.ajax({
        async:false,
        type: 'PUT',
        url: baseURL + url,
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: "json",
        success: onSuccess,
        error: onFailure
    });
};


// Template Delete request Ajax call
var makeDeleteRequest = function(url, onSuccess, onFailure) {
    $.ajax({
        async:false,
        type: 'DELETE',
        url: baseURL + url,
        dataType: "json",
        success: onSuccess,
        error: onFailure
    });
};

// Template GET request Ajax call
var makeGetRequest = function(url, onSuccess, onFailure) {
    $.ajax({
        async:false,
        type: 'GET',
        url: baseURL + url,
        dataType: "json",
        success: onSuccess,
        error: onFailure
    });
};

/*
    update the page content
*/
window.onload = function() {
    userID = window.sessionStorage.getItem("id");
    document.getElementById('requestID').innerHTML = window.sessionStorage.getItem("orderId");
    document.getElementById('request-type').innerHTML = window.sessionStorage.getItem("type")+"&nbsp;";
    document.getElementById('requester').innerHTML = window.sessionStorage.getItem("user_name");
    document.getElementById('subunit').innerHTML = window.sessionStorage.getItem("user_subunitName");
    document.getElementById('userEmail').innerHTML = window.sessionStorage.getItem("user_email");
    document.getElementById('userUWID').innerHTML = window.sessionStorage.getItem("user_uwid");
    document.getElementById('accessLevel').innerHTML = window.sessionStorage.getItem("user_AccessLevel");
    document.getElementById('status').innerHTML ="<i class=\"fa fa-circle font-small-3 text-warning mr-50\"></i>" + window.sessionStorage.getItem("status");
    document.getElementById('submitDate').innerHTML = window.sessionStorage.getItem("submit_date");
    //check how many budgets
    if(window.sessionStorage.getItem("budget_length").localeCompare("1")==0){
        document.getElementById('budget').innerHTML = window.sessionStorage.getItem("budget1") +" "+window.sessionStorage.getItem("split1");
    }else{
        document.getElementById('budget').innerHTML = window.sessionStorage.getItem("budget1") +" "+window.sessionStorage.getItem("split1")
                                                +"<br>"+window.sessionStorage.getItem("budget2") +" "+window.sessionStorage.getItem("split2");
    }
    //-----------------------
    document.getElementById('travelBefore').innerHTML = window.sessionStorage.getItem("TravelBefore");
    if(window.sessionStorage.getItem("SomeoneName").length==0){
        document.getElementById('requestFor').innerHTML = window.sessionStorage.getItem("user_name");
    }else{
        document.getElementById('requestFor').innerHTML = window.sessionStorage.getItem("SomeoneName");
    }
    document.getElementById('us').innerHTML = window.sessionStorage.getItem("US");
    document.getElementById('purpose').innerHTML = window.sessionStorage.getItem("purpose");
    document.getElementById('referenceNumber').innerHTML = window.sessionStorage.getItem("ReferenceNumber")+"&nbsp;";
    if(window.sessionStorage.getItem("SomeoneName").length==0){
        document.getElementById('email').innerHTML = window.sessionStorage.getItem("user_email");
    }else{
        document.getElementById('email').innerHTML = window.sessionStorage.getItem("SomeoneEmail");
    }
    //check the attached file
    if(window.sessionStorage.getItem("passport_file").localeCompare("undefined")!=0){
        document.getElementById('passportFile').innerHTML = "<a href=\"https://coe-api.azurewebsites.net/api/downloadAttachment/" 
                                                        + window.sessionStorage.getItem("orderId") + "/" 
                                                        + window.sessionStorage.getItem("passport_file")
                                                        + "\" style=\"cursor:pointer;color:blue;text-decoration:underline;\">Download</a>";
    }
    if(window.sessionStorage.getItem("visa_file").localeCompare("undefined")!=0){
        document.getElementById('visaFile').innerHTML = "<a href=\"https://coe-api.azurewebsites.net/api/downloadAttachment/" 
                                                        + window.sessionStorage.getItem("orderId") + "/" 
                                                        + window.sessionStorage.getItem("visa_file")
                                                        + "\" style=\"cursor:pointer;color:blue;text-decoration:underline;\">Download</a>";
    }
    if(window.sessionStorage.getItem("registration_file").localeCompare("undefined")!=0){
        document.getElementById('registrationFile').innerHTML = "<a href=\"https://coe-api.azurewebsites.net/api/downloadAttachment/" 
                                                        + window.sessionStorage.getItem("orderId") + "/" 
                                                        + window.sessionStorage.getItem("registration_file")
                                                        + "\" style=\"cursor:pointer;color:blue;text-decoration:underline;\">Download</a>";
    }
    if(window.sessionStorage.getItem("car_file").localeCompare("undefined")!=0){
        document.getElementById('carFile').innerHTML = "<a href=\"https://coe-api.azurewebsites.net/api/downloadAttachment/" 
                                                        + window.sessionStorage.getItem("orderId") + "/" 
                                                        + window.sessionStorage.getItem("car_file")
                                                        + "\" style=\"cursor:pointer;color:blue;text-decoration:underline;\">Download</a>";
    }
    if(window.sessionStorage.getItem("rental_file").localeCompare("undefined")!=0){
        document.getElementById('carRentalFile').innerHTML = "<a href=\"https://coe-api.azurewebsites.net/api/downloadAttachment/" 
                                                        + window.sessionStorage.getItem("orderId") + "/" 
                                                        + window.sessionStorage.getItem("rental_file")
                                                        + "\" style=\"cursor:pointer;color:blue;text-decoration:underline;\">Download</a>";
    }
    if(window.sessionStorage.getItem("airfare_file").localeCompare("undefined")!=0){
        document.getElementById('airfareFile').innerHTML = "<a href=\"https://coe-api.azurewebsites.net/api/downloadAttachment/" 
                                                        + window.sessionStorage.getItem("orderId") + "/" 
                                                        + window.sessionStorage.getItem("airfare_file")
                                                        + "\" style=\"cursor:pointer;color:blue;text-decoration:underline;\">Download</a>";
    }
    if(window.sessionStorage.getItem("train_file").localeCompare("undefined")!=0){
        document.getElementById('trainFile').innerHTML = "<a href=\"https://coe-api.azurewebsites.net/api/downloadAttachment/" 
                                                        + window.sessionStorage.getItem("orderId") + "/" 
                                                        + window.sessionStorage.getItem("train_file")
                                                        + "\" style=\"cursor:pointer;color:blue;text-decoration:underline;\">Download</a>";
    }
    if(window.sessionStorage.getItem("hotel_file").localeCompare("undefined")!=0){
        document.getElementById('hotelFile').innerHTML = "<a href=\"https://coe-api.azurewebsites.net/api/downloadAttachment/" 
                                                        + window.sessionStorage.getItem("orderId") + "/" 
                                                        + window.sessionStorage.getItem("hotel_file")
                                                        + "\" style=\"cursor:pointer;color:blue;text-decoration:underline;\">Download</a>";
    }
    //----------------------------------------------------------------------------------------------------------------------------------------
    document.getElementById('personalTravel').innerHTML = window.sessionStorage.getItem("personalTravel");
    document.getElementById('affliation').innerHTML = window.sessionStorage.getItem("SomeoneAffliation")+"&nbsp;";
    document.getElementById('travelDetail').innerHTML = window.sessionStorage.getItem("personalTravelDetails");
    document.getElementById('registration').innerHTML = "$"+window.sessionStorage.getItem("registration")+"&nbsp;";
    document.getElementById('carFee').innerHTML = "$"+window.sessionStorage.getItem("car")+"&nbsp;";
    document.getElementById('carRental').innerHTML = "$"+window.sessionStorage.getItem("carRental")+"&nbsp;";
    document.getElementById('airfare').innerHTML = "$"+window.sessionStorage.getItem("airfare")+"&nbsp;";
    document.getElementById('train').innerHTML = "$"+window.sessionStorage.getItem("train")+"&nbsp;";
    document.getElementById('hotel').innerHTML = "$"+window.sessionStorage.getItem("hotelFee")+"&nbsp;";
    if(window.sessionStorage.getItem("meal").localeCompare("meal1")==0){
        document.getElementById('meal').innerHTML = "Yes, maximum allowable perdiem";
    }else if(window.sessionStorage.getItem("meal").localeCompare("meal2")==0){
        document.getElementById('meal').innerHTML = "Yes, specifc days and meals";
    }else if(window.sessionStorage.getItem("meal").localeCompare("meal3")==0){
        document.getElementById('meal').innerHTML = "Yes, specific amount";
    }else if(window.sessionStorage.getItem("meal").localeCompare("meal4")==0){
        document.getElementById('meal').innerHTML = "No";
    }
    document.getElementById('mealAmount').innerHTML = "$"+window.sessionStorage.getItem("meal_amount")+"&nbsp;";
    document.getElementById('mealProvid').innerHTML = window.sessionStorage.getItem("mealProvided")+"&nbsp;";
    
    var onSuccess = function(data){
        var col1=1;
        var orderinfo = JSON.parse(data.data.OrderInfo);
        var table = document.getElementById("meal_table1");

        var i;
        var col=2;
        //update the meal per dim table
        for(i=0;i<orderinfo.Meal_table1.length;i++){
            var row = table.insertRow(col+i);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);//space
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            cell1.innerHTML=orderinfo.Meal_table1[i].Date;
            if(orderinfo.Meal_table1[i].Breakfast==true){
                cell2.innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*";
            }
            if(orderinfo.Meal_table1[i].Lunch==true){
                cell3.innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*";
            }
            if(orderinfo.Meal_table1[i].Dinner==true){
                cell4.innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*";
            }
        }

        var col2=2;
        var table2 = document.getElementById("meal_table2");
        for(i=0;i<orderinfo.Meal_table2.length;i++){
            var row = table2.insertRow(col+i);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);//space
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            cell1.innerHTML=orderinfo.Meal_table2[i].Date;
            if(orderinfo.Meal_table2[i].Breakfast==true){
                cell2.innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*";
            }
            if(orderinfo.Meal_table2[i].Lunch==true){
                cell3.innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*";
            }
            if(orderinfo.Meal_table2[i].Dinner==true){
                cell4.innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*";
            }
        }
        request_id = window.sessionStorage.getItem('orderId');
        requestInfo = getRequestInfo(request_id);
    }
    var onFaliure = function(){
        alert("fail");
    }
    makeGetRequest("getOrderInformation/"+window.sessionStorage.getItem('orderId'),onSuccess,onFaliure);
}

function updateActionField(data) {
    var request_status = data.OrderStatus;
    var originalAssigndeTo = data.assignedTo;
    var self_id = sessionStorage.getItem('id');
    if (request_status == "Approved" && self_id == originalAssigndeTo) {
        var acceptBtn = document.getElementById('accept-btn');
        acceptBtn.disabled = false;
        var sendBackBtn = document.getElementById('send-back-btn');
        sendBackBtn.disabled = false;
    }
    if (request_status == "Accepted") {
        var completeBtn = document.getElementById('complete-btn');
        completeBtn.disabled = false;
    }
}

function takeNoteClicked() {
    // send data
    var data = {
        userName: window.sessionStorage.getItem("id"),
        comment: feedback.value
    };
    var onSuccess = function(data) {
        if (data.status == true) {
            console.log("update success");
        } else {
            //error message
            info = null;
        }
    }

    var onFailure = function() {
        // failure message
        info = null;
    }
    makePostRequest("updateChatInfo/" + request_id, data, onSuccess, onFailure);
    location.reload();
}


/**
 * Get the request information with the global variable request_id
 * @param {int} request_id 
 */
function getRequestInfo(request_id) {
    var info = null;
    var onSuccess = function(data) {
        if (data.status == true) {
            console.log("request information is here");
            console.log(data.data);
            info = data.data;
            
        } else {
            //error message
            info = null;
        }
    }

    var onFailure = function() {
        // failure message
        info = null;
    }

    makeGetRequest("getOrderInformation/" + request_id, onSuccess, onFailure);
    return info;
}


function collectHistoryInfo(data) {
    var responses = data.ApprovalResponses;
    for (var i = 0; i < responses.length; i++) {
        var responseData = responses[i].approverResponses;
        for (var x = 0; x < responseData.length; x++) {
            var approver_id = responseData[x].approverID_ref;
            if (!approverResponseMap.has(approver_id)) {
                approverResponseMap.set(approver_id, {
                    name: getUserInfo(approver_id).userInfo.Name,
                    response: responseData[x].response
                });
            }
        }
    }

    var buyerName = null;
    if (data.assignedTo) {
        buyerName = getUserInfo(data.assignedTo).userInfo.Name;
    }
    reqBuyer = {
        Status: data.OrderStatus,
        AssignedTo: buyerName
    };

    requestHistory.appendChild(genFormStamp("Submitted", data.submittedOn));
    if (approverResponseMap.size == 0) {
        requestHistory.appendChild(genApprovalStamp(null, null));
    } else {
        for (const [key, value] of approverResponseMap.entries()) {
            var appr = value.name;
            var resp = value.response;
            requestHistory.appendChild(genApprovalStamp(appr, resp));
        }
    }
    // add status and timestamp
    requestHistory.appendChild(genFiscalStaffStamp(reqBuyer.Status, reqBuyer.AssignedTo, data.lastModified));
    requestHistory.appendChild(genClaimStamp(reqBuyer.Status, data.lastModified));
    requestHistory.appendChild(genFinishStamp(reqBuyer.Status, data.lastModified));
}

/**
 * Generate the history stamp of approval chain
 * @param {string} approver 
 * @param {array} responses
 */
function genApprovalStamp(approver, response) {
     
    var stamp = document.createElement('li');
    var signal = document.createElement('div');
    var info = document.createElement('div');

    // var done = isDone(responses);
    var done = response;

    var i = document.createElement('i');
    i.setAttribute('class', 'feather icon-alert-circle font-medium-2');
    if (done) {
        signal.setAttribute('class', 'timeline-icon bg-warning');
    } else {
        signal.setAttribute('class', 'timeline-icon bg-warning bg-lighten-5');
    }
    signal.appendChild(i);

    var p = document.createElement('p');
    p.setAttribute('class', 'font-weight-bold');
    if (done) {
        p.innerHTML = "Request Budget Approved";
    } else {
        p.innerHTML = "Awaiting Budget Approval";
    }
    
    info.appendChild(p);
    var span = document.createElement('span');
    if (approver == null) {
        span.innerHTML = "Not got approvers yet";
    } else {
        span.innerHTML = "By approver " + approver;
    }
    info.appendChild(span);
    stamp.appendChild(signal);
    stamp.appendChild(info);
    return stamp;
}

/**
 * Check if this approver approved all budgets belongs to him
 * @param {array} responses array of responses of this approver
 */
// function isDone(responses) {
//     if (responses.length == 0) return false;
//     for (var i = 0; i < responses.length; i++) {
//         if (!responses[i]) return false;
//     }
//     return true;
// }

function genFiscalStaffStamp(request_status, assignedTo, timeStamp) {
    var stamp = document.createElement('li');
    var signal = document.createElement('div');
    var info = document.createElement('div');
    var time = document.createElement('small');

    var done = false;
    if (request_status.indexOf("Accepted") >= 0) {
        done = true;
    }

    var i = document.createElement('i');
    i.setAttribute('class', 'feather icon-alert-circle font-medium-2');
    if (done) {
        signal.setAttribute('class', 'timeline-icon bg-warning');
    } else {
        signal.setAttribute('class', 'timeline-icon bg-warning bg-lighten-5');
    }
    signal.appendChild(i);

    var p = document.createElement('p');
    p.setAttribute('class', 'font-weight-bold');
    if (done) {
        p.innerHTML = "Request Accepted";
    } else {
        p.innerHTML = "Awaiting Request Acception";
    }
    info.appendChild(p);
    var span = document.createElement('span');
    if (assignedTo) {
        span.innerHTML = "By fiscal staff " + assignedTo;
    } else {
        span.innerHTML = "Not assigned yet";
    }

    if (done) {
        time.innerHTML = moment(timeStamp).fromNow();
    }

    info.appendChild(span);
    stamp.appendChild(signal);
    stamp.appendChild(info);
    stamp.appendChild(time);
    return stamp;
}

/**
 * Generate the stamp related to form
 * @param {string} action e.g. "Submitted"
 */
function genFormStamp(action, timeStamp) {
    var stamp = document.createElement('li');
    var signal = document.createElement('div');
    var info = document.createElement('div');
    var time = document.createElement('small');

    var i = document.createElement('i');
    i.setAttribute('class', 'feather icon-plus font-medium-2');
    signal.setAttribute('class', 'timeline-icon bg-primary');
    signal.appendChild(i);

    var p = document.createElement('p');
    p.setAttribute('class', 'font-weight-bold');
    p.innerHTML = "Request " + action;
    var span = document.createElement('span');
    span.innerHTML = "Good job!";
    info.appendChild(p);
    info.appendChild(span);

    time.innerHTML = moment(timeStamp).fromNow();

    stamp.appendChild(signal);
    stamp.appendChild(info);
    stamp.appendChild(time);
    return stamp;
}

function genClaimStamp(request_status, timeStamp) {
    var stamp = document.createElement('li');
    var signal = document.createElement('div');
    var info = document.createElement('div');
    var time = document.createElement('small');

    var done = false;
    if (request_status.indexOf("Accepted") >= 0) {
        done = true;
    }

    var i = document.createElement('i');
    i.setAttribute('class', 'feather icon-check font-medium-2');
    if (done) {
        signal.setAttribute('class', 'timeline-icon bg-success');
    } else {
        signal.setAttribute('class', 'timeline-icon bg-success bg-lighten-5');
    }
    signal.appendChild(i);

    var p = document.createElement('p');
    p.setAttribute('class', 'font-weight-bold');
    p.innerHTML = "Request Claimed";
    var span = document.createElement('span');
    span.innerHTML = "Good job!";
    info.appendChild(p);
    info.appendChild(span);

    if (done) {
        time.innerHTML = moment(timeStamp).fromNow();
    }

    stamp.appendChild(signal);
    stamp.appendChild(info);
    stamp.appendChild(time);
    return stamp;
}

function genFinishStamp(request_status, timeStamp) {
    var stamp = document.createElement('li');
    var signal = document.createElement('div');
    var info = document.createElement('div');
    var time = document.createElement('small');

    var done = false;
    if (request_status.indexOf("Completed") >= 0) {
        done = true;
    }

    var i = document.createElement('i');
    i.setAttribute('class', 'feather icon-check font-medium-2');
    if (done) {
        signal.setAttribute('class', 'timeline-icon bg-success');
    } else {
        signal.setAttribute('class', 'timeline-icon bg-success bg-lighten-5');
    }
    signal.appendChild(i);

    var p = document.createElement('p');
    p.setAttribute('class', 'font-weight-bold');
    p.innerHTML = "Request Completed";
    var span = document.createElement('span');
    span.innerHTML = "Good job!";
    info.appendChild(p);
    info.appendChild(span);

    if (done) {
        time.innerHTML = moment(timeStamp).fromNow();
    }

    stamp.appendChild(signal);
    stamp.appendChild(info);
    stamp.appendChild(time);
    return stamp;
}


