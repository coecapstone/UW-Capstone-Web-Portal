var reqApproverArr = [];
var reqBuyer = {};
let approverResponseMap = new Map(); // key: approverid, value: {name, response}

var feedbackBlock = document.getElementById("feedback-block");
var feedback = document.getElementById("feedback_input");

var request_id = null;
var user_id = EngineUI.getId();
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
addLoadEvent(function() {
    userID = EngineUI.getId();
    document.getElementById('requestID').innerHTML = EngineUI.getOrderId();
    document.getElementById('request-type').innerHTML = EngineUI.getType()+"&nbsp;";
    document.getElementById('requester').innerHTML = EngineUI.getUser_name();
    document.getElementById('subunit').innerHTML = EngineUI.getUser_subunitName();
    document.getElementById('userEmail').innerHTML = EngineUI.getUser_email();
    document.getElementById('userUWID').innerHTML = EngineUI.getUser_uwid();
    document.getElementById('accessLevel').innerHTML = EngineUI.getUser_AccessLevel();
    document.getElementById('status').innerHTML ="<i class=\"fa fa-circle font-small-3 text-warning mr-50\"></i>" + EngineUI.getStatus();
    document.getElementById('submitDate').innerHTML = EngineUI.getSubmit_date();
    //check how many budgets
    if(EngineUI.getBudget_length().localeCompare("1")==0){
        document.getElementById('budget').innerHTML = EngineUI.getBudget1() +" "+EngineUI.getSplit1();
    }else{
        document.getElementById('budget').innerHTML = EngineUI.getBudget1() +" "+EngineUI.getSplit1()
                                                +"<br>"+EngineUI.getBudget2() +" "+EngineUI.getSplit2();
    }
    //-----------------------
    document.getElementById('travelBefore').innerHTML = EngineUI.getTravelBefore();
    if(EngineUI.getSomeoneName().length==0){
        document.getElementById('requestFor').innerHTML = EngineUI.getUser_name();
    }else{
        document.getElementById('requestFor').innerHTML = EngineUI.getSomeoneName();
    }
    document.getElementById('us').innerHTML = EngineUI.getUS();
    document.getElementById('purpose').innerHTML = EngineUI.getPurpose();
    document.getElementById('referenceNumber').innerHTML = EngineUI.getReferenceNumber()+"&nbsp;";
    if(EngineUI.getSomeoneName().length==0){
        document.getElementById('email').innerHTML = EngineUI.getUser_email();
    }else{
        document.getElementById('email').innerHTML = EngineUI.getSomeoneEmail();
    }
    //check the attached file
    if(EngineUI.getPassport_file().localeCompare("undefined")!=0){
        document.getElementById('passportFile').innerHTML = "<a href=\"" + baseURL + "downloadAttachment/" 
                                                        + EngineUI.getOrderId() + "/" 
                                                        + EngineUI.getPassport_file()
                                                        + "\" style=\"cursor:pointer;color:blue;text-decoration:underline;\">Download</a>";
    }
    if(EngineUI.getVisa_file().localeCompare("undefined")!=0){
        document.getElementById('visaFile').innerHTML = "<a href=\"" + baseURL + "downloadAttachment/" 
                                                        + EngineUI.getOrderId() + "/" 
                                                        + EngineUI.getVisa_file()
                                                        + "\" style=\"cursor:pointer;color:blue;text-decoration:underline;\">Download</a>";
    }
    if(EngineUI.getRegistration(file").localeCompare("undefined")!=0){
        document.getElementById('registrationFile').innerHTML = "<a href=\"" + baseURL + "downloadAttachment/" 
                                                        + EngineUI.getOrderId() + "/" 
                                                        + EngineUI.getRegistration(file")
                                                        + "\" style=\"cursor:pointer;color:blue;text-decoration:underline;\">Download</a>";
    }
    if(EngineUI.getCar(file").localeCompare("undefined")!=0){
        document.getElementById('carFile').innerHTML = "<a href=\"" + baseURL + "downloadAttachment/" 
                                                        + EngineUI.getOrderId() + "/" 
                                                        + EngineUI.getCar(file")
                                                        + "\" style=\"cursor:pointer;color:blue;text-decoration:underline;\">Download</a>";
    }
    if(EngineUI.getRental_file().localeCompare("undefined")!=0){
        document.getElementById('carRentalFile').innerHTML = "<a href=\"" + baseURL + "downloadAttachment/" 
                                                        + EngineUI.getOrderId() + "/" 
                                                        + EngineUI.getRental_file()
                                                        + "\" style=\"cursor:pointer;color:blue;text-decoration:underline;\">Download</a>";
    }
    if(EngineUI.getAirfare(file").localeCompare("undefined")!=0){
        document.getElementById('airfareFile').innerHTML = "<a href=\"" + baseURL + "downloadAttachment/" 
                                                        + EngineUI.getOrderId() + "/" 
                                                        + EngineUI.getAirfare(file")
                                                        + "\" style=\"cursor:pointer;color:blue;text-decoration:underline;\">Download</a>";
    }
    if(EngineUI.getTrain(file").localeCompare("undefined")!=0){
        document.getElementById('trainFile').innerHTML = "<a href=\"" + baseURL + "downloadAttachment/" 
                                                        + EngineUI.getOrderId() + "/" 
                                                        + EngineUI.getTrain(file")
                                                        + "\" style=\"cursor:pointer;color:blue;text-decoration:underline;\">Download</a>";
    }
    if(EngineUI.getHotel(file").localeCompare("undefined")!=0){
        document.getElementById('hotelFile').innerHTML = "<a href=\"" + baseURL + "downloadAttachment/" 
                                                        + EngineUI.getOrderId() + "/" 
                                                        + EngineUI.getHotel(file")
                                                        + "\" style=\"cursor:pointer;color:blue;text-decoration:underline;\">Download</a>";
    }
    //----------------------------------------------------------------------------------------------------------------------------------------
    document.getElementById('personalTravel').innerHTML = EngineUI.getPersonalTravel();
    document.getElementById('affliation').innerHTML = EngineUI.getSomeoneAffliation()+"&nbsp;";
    document.getElementById('travelDetail').innerHTML = EngineUI.getPersonalTravel(etails");
    document.getElementById('registration').innerHTML = "$"+EngineUI.getRegistration()+"&nbsp;";
    document.getElementById('carFee').innerHTML = "$"+EngineUI.getCar()+"&nbsp;";
    document.getElementById('carRental').innerHTML = "$"+EngineUI.getCar(ental")+"&nbsp;";
    document.getElementById('airfare').innerHTML = "$"+EngineUI.getAirfare()+"&nbsp;";
    document.getElementById('train').innerHTML = "$"+EngineUI.getTrain()+"&nbsp;";
    document.getElementById('hotel').innerHTML = "$"+EngineUI.getHotel(ee")+"&nbsp;";
    if(EngineUI.getMeal().localeCompare("meal1")==0){
        document.getElementById('meal').innerHTML = "Yes, maximum allowable perdiem";
    }else if(EngineUI.getMeal().localeCompare("meal2")==0){
        document.getElementById('meal').innerHTML = "Yes, specifc days and meals";
    }else if(EngineUI.getMeal().localeCompare("meal3")==0){
        document.getElementById('meal').innerHTML = "Yes, specific amount";
    }else if(EngineUI.getMeal().localeCompare("meal4")==0){
        document.getElementById('meal').innerHTML = "No";
    }
    document.getElementById('mealAmount').innerHTML = "$"+EngineUI.getMeal(amount")+"&nbsp;";
    document.getElementById('mealProvid').innerHTML = EngineUI.getMeal(rovided")+"&nbsp;";
    
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
        request_id = EngineUI.getOrderId();
        requestInfo = getRequestInfo(request_id);
    }
    var onFaliure = function(){
        alert("fail");
    }
    makeGetRequest("getOrderInformation/"+EngineUI.getOrderId(),onSuccess,onFaliure);
});

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
        userName: EngineUI.getId(),
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


