var reqApproverArr = [];
var reqBuyer = {};
let approverResponseMap = new Map(); // key: approverid, value: {name, response}

var feedbackBlock = document.getElementById("feedback-block");
var feedback = document.getElementById("feedback_input");

var request_id = null;
const baseURL = "https://uwcoe-api.azurewebsites.net/api/";
var user_id = "5e8e45eea148b9004420651f";
var userID = null;
var actionTable = document.getElementById("action_table");

var actionArr = [];
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

/*
    update the page content
*/
window.onload = function() {
    userID = window.sessionStorage.getItem("id");
    document.getElementById('requestID').innerHTML = window.sessionStorage.getItem("orderId");
    document.getElementById('requester').innerHTML = window.sessionStorage.getItem("user_name");
    document.getElementById('subunit').innerHTML = window.sessionStorage.getItem("user_subunitName");
    document.getElementById('userEmail').innerHTML = window.sessionStorage.getItem("user_email");
    document.getElementById('userUWID').innerHTML = window.sessionStorage.getItem("user_uwid");
    document.getElementById('accessLevel').innerHTML = window.sessionStorage.getItem("user_AccessLevel");
    document.getElementById('status').innerHTML ="<i class=\"fa fa-circle font-small-3 text-warning mr-50\"></i>" + window.sessionStorage.getItem("status");
    document.getElementById('submitDate').innerHTML = window.sessionStorage.getItem("submit_date");
    if(window.sessionStorage.getItem("budget_length").localeCompare("1")==0){
        document.getElementById('budget').innerHTML = window.sessionStorage.getItem("budget1") +" "+window.sessionStorage.getItem("split1");
    }else{
        document.getElementById('budget').innerHTML = window.sessionStorage.getItem("budget1") +" "+window.sessionStorage.getItem("split1")
                                             +"<br>"+window.sessionStorage.getItem("budget2") +" "+window.sessionStorage.getItem("split2");
    }
    document.getElementById('reason').innerHTML = window.sessionStorage.getItem("reason");
    document.getElementById('firstName').innerHTML = window.sessionStorage.getItem("firstname");
    document.getElementById('departDate').innerHTML = window.sessionStorage.getItem("date");
    document.getElementById('lastName').innerHTML = window.sessionStorage.getItem("lastname");
    document.getElementById('returnDate').innerHTML = window.sessionStorage.getItem("returndate");
    document.getElementById('departure').innerHTML = window.sessionStorage.getItem("departure");
    document.getElementById('birthday').innerHTML = window.sessionStorage.getItem("birthday")+"&nbsp;";
    document.getElementById('destination').innerHTML = window.sessionStorage.getItem("destionation");
    document.getElementById('flight').innerHTML = window.sessionStorage.getItem("flight")+"&nbsp;";
    document.getElementById('flightFrom').innerHTML = window.sessionStorage.getItem("flight_from")+"&nbsp;";
    document.getElementById('flightReference').innerHTML = window.sessionStorage.getItem("flight_reference")+"&nbsp;";
    document.getElementById('airline').innerHTML = window.sessionStorage.getItem("flight_company")+"&nbsp;";
    document.getElementById('flightTo').innerHTML = window.sessionStorage.getItem("flight_to")+"&nbsp;";
    document.getElementById('flightNumber').innerHTML = window.sessionStorage.getItem("flight_number")+"&nbsp;";
    document.getElementById('flightDepartDate').innerHTML = window.sessionStorage.getItem("flight_departdate")+"&nbsp;";
    document.getElementById('flightAmount').innerHTML = "$"+window.sessionStorage.getItem("flight_amount")+"&nbsp;";
    document.getElementById('flightReturnDate').innerHTML = window.sessionStorage.getItem("flight_returndate")+"&nbsp;";
    document.getElementById('hotel').innerHTML = window.sessionStorage.getItem("hotel")+"&nbsp;";
    document.getElementById('hotelNum').innerHTML = window.sessionStorage.getItem("hotel_num")+"&nbsp;";
    document.getElementById('hotelLink').innerHTML = window.sessionStorage.getItem("hotel_link")+"&nbsp;";
    document.getElementById('hotelName').innerHTML = window.sessionStorage.getItem("hotel_name")+"&nbsp;";
    document.getElementById('hotelCheckIn').innerHTML = window.sessionStorage.getItem("hotel_movein")+"&nbsp;";
    document.getElementById('hotelNote').innerHTML = window.sessionStorage.getItem("hotel_note")+"&nbsp;";
    document.getElementById('hotelAddress').innerHTML = window.sessionStorage.getItem("hotel_address")+"&nbsp;";
    document.getElementById('hotelCheckout').innerHTML = window.sessionStorage.getItem("hotel_moveout")+"&nbsp;";
    document.getElementById('hotelZip').innerHTML = window.sessionStorage.getItem("hotel_zip")+"&nbsp;";
    document.getElementById('hotelAmount').innerHTML = "$"+window.sessionStorage.getItem("hotel_amount")+"&nbsp;";
    document.getElementById('request-type').innerHTML = window.sessionStorage.getItem("type")+"&nbsp;";
    request_id = window.sessionStorage.getItem('orderId');
    this.console.log(request_id);
    requestInfo = getRequestInfo(request_id);
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

function updateActionField(data) {
    // collect awaiting approval information
    var ar = data.ApprovalResponses;
    for (var i = 0; i < ar.length; i++) {
        var ari = ar[i].approverResponses;
        console.log(ari);
        for (var j = 0; j < ari.length; j++) {
            if (ari[j].approverID_ref === userID) {
                if (ari[j].response) {
                    actionArr.push({
                        budgetnum : ar[i].BudgetNumber,
                        lineitemid : ar[i].lineItemID,
                        response: true
                    });
                } else {
                    actionArr.push({
                        budgetnum : ar[i].BudgetNumber,
                        lineitemid : ar[i].lineItemID,
                        response: false
                    });
                }
                
            }
        }
    }
}


function adjustActionHeight() {
    var ha = action_card.clientHeight;
    var hn = note_add_card.clientHeight;
    if (ha < hn) {
        action_card.style.height = `${hn}px`;
    } else if (ha > hn) {
        var h = ha - hn + 86;
        feedback.style.height = `${h}px`;
    }
}


