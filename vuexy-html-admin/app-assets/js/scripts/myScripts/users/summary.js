var reqApproverArr = [];
var reqBuyer = {};
let approverResponseMap = new Map(); // key: approverid, value: {name, response}

var feedbackBlock = document.getElementById("feedback-block");
var feedback = document.getElementById("feedback_input");

var request_id = null;
var user_id = EngineUI.getId();
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
addLoadEvent(function() {
    userID = EngineUI.getId();
    document.getElementById('requestID').innerHTML = EngineUI.getOrderId();
    document.getElementById('requester').innerHTML = EngineUI.getUser_name();
    document.getElementById('subunit').innerHTML = EngineUI.getUser_subunitName();
    document.getElementById('userEmail').innerHTML = EngineUI.getUser_email();
    document.getElementById('userUWID').innerHTML = EngineUI.getUser_uwid();
    document.getElementById('accessLevel').innerHTML = EngineUI.getUser_AccessLevel();
    document.getElementById('status').innerHTML ="<i class=\"fa fa-circle font-small-3 text-warning mr-50\"></i>" + EngineUI.getStatus();
    document.getElementById('submitDate').innerHTML = EngineUI.getSubmit_date();
    if(EngineUI.getBudget_length().localeCompare("1")==0){
        document.getElementById('budget').innerHTML = EngineUI.getBudget1() +" "+EngineUI.getSplit1();
    }else{
        document.getElementById('budget').innerHTML = EngineUI.getBudget1() +" "+EngineUI.getSplit1()
                                             +"<br>"+EngineUI.getBudget2() +" "+EngineUI.getSplit2();
    }
    document.getElementById('reason').innerHTML = EngineUI.getReason();
    document.getElementById('firstName').innerHTML = EngineUI.getFirstname();
    document.getElementById('departDate').innerHTML = EngineUI.getDate();
    document.getElementById('lastName').innerHTML = EngineUI.getLastname();
    document.getElementById('returnDate').innerHTML = EngineUI.getReturndate();
    document.getElementById('departure').innerHTML = EngineUI.getDeparture();
    document.getElementById('birthday').innerHTML = EngineUI.getBirthday()+"&nbsp;";
    document.getElementById('destination').innerHTML = EngineUI.getDestionation();
    document.getElementById('flight').innerHTML = EngineUI.getFlight()+"&nbsp;";
    document.getElementById('flightFrom').innerHTML = EngineUI.getFlight_from()+"&nbsp;";
    document.getElementById('flightReference').innerHTML = EngineUI.getFlight_reference()+"&nbsp;";
    document.getElementById('airline').innerHTML = EngineUI.getFlight_company()+"&nbsp;";
    document.getElementById('flightTo').innerHTML = EngineUI.getFlight_to()+"&nbsp;";
    document.getElementById('flightNumber').innerHTML = EngineUI.getFlight_number()+"&nbsp;";
    document.getElementById('flightDepartDate').innerHTML = EngineUI.getFlight_departdate()+"&nbsp;";
    document.getElementById('flightAmount').innerHTML = "$"+EngineUI.getFlight_amount()+"&nbsp;";
    document.getElementById('flightReturnDate').innerHTML = EngineUI.getFlight_returndate()+"&nbsp;";
    document.getElementById('hotel').innerHTML = EngineUI.getHotel()+"&nbsp;";
    document.getElementById('hotelNum').innerHTML = EngineUI.getHotel_num()+"&nbsp;";
    document.getElementById('hotelLink').innerHTML = EngineUI.getHotel_link()+"&nbsp;";
    document.getElementById('hotelName').innerHTML = EngineUI.getHotel_name()+"&nbsp;";
    document.getElementById('hotelCheckIn').innerHTML = EngineUI.getHotel_movein()+"&nbsp;";
    document.getElementById('hotelNote').innerHTML = EngineUI.getHotel_note()+"&nbsp;";
    document.getElementById('hotelAddress').innerHTML = EngineUI.getHotel_address()+"&nbsp;";
    document.getElementById('hotelCheckout').innerHTML = EngineUI.getHotel_moveout()+"&nbsp;";
    document.getElementById('hotelZip').innerHTML = EngineUI.getHotel_zip()+"&nbsp;";
    document.getElementById('hotelAmount').innerHTML = "$"+EngineUI.getHotel_amount()+"&nbsp;";
    document.getElementById('request-type').innerHTML = EngineUI.getRequestType()+"&nbsp;";
    request_id = EngineUI.getOrderId();
    this.console.log(request_id);
    requestInfo = getRequestInfo(request_id);
});

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


