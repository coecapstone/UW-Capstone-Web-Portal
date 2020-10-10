var reqApproverArr = [];
var reqBuyer = {};
let approverResponseMap = new Map(); // key: approverid, value: {name, response}

var feedbackBlock = document.getElementById("feedback-block");
var feedback = document.getElementById("feedback_input");

var request_id = null;

window.onload = function() {
    request_id = window.sessionStorage.getItem('RequestID');
    this.console.log(request_id);

    // Request Example: Reimbursement
    // request_id = "5f330189f2dc670044ab53f5";
    // Request Example: Purchase Request
    // request_id = "5f1c92448813560044fa2c53";
    // Request Example: Procard Receipt
    // request_id = "5f1b14228cc64b1bd881ba65";
    // Request Example: Pay an Invoice
    // request_id = "5f0e530b7f2ae5004492a161";

    requestInfo = getRequestInfo(request_id);
    updateRequestInfo(requestInfo);
    updateHistory(requestInfo);
    prepareNotesArr(requestInfo);
    updateNotes();

    updateActionField(requestInfo);
    // changeOrderStatus();
}

// just for debug
function changeOrderStatus() {
    var data = {
        OrderStatus: "Updated"
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
    makePostRequest("updateOrderStatus/" + request_id, data, onSuccess, onFailure);
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


function finishClicked() {
    console.log('clicked');
    const timeStamp = new Date(Date.now()).toISOString();
    // console.log(timeStamp);
    // console.log(moment(timeStamp).fromNow());
    // const str = "Accepted,timestamp";
    // var idx = str.indexOf(',');
    // console.log(str.substring(idx + 1));

    var data = {
        OrderStatus: "Completed"
    };

    var history = {
        userName: window.sessionStorage.getItem("id"),
        action: "Completed"
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
    makePostRequest("updateOrderStatus/" + request_id, data, onSuccess, onFailure);
    makePostRequest("updateOrderHistory/" + request_id, history, onSuccess, onFailure);
    location.reload();
}


function sendBackClicked() {
    var orderData = {
        OrderStatus: "Awaiting Approval"
    };

    var history = {
        userName: window.sessionStorage.getItem("id"),
        action: "Sent Back"
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
    // makePostRequest("updateChatInfo/" + request_id, chatData, onSuccess, onFailure);
    makePostRequest("updateOrderStatus/" + request_id, orderData, onSuccess, onFailure);
    makePostRequest("updateOrderHistory/" + request_id, history, onSuccess, onFailure);
    location.reload();
}

function approveClicked() {
    var data = {
        OrderStatus: "Accepted"
    };

    var history = {
        userName: window.sessionStorage.getItem("id"),
        action: "Accepted"
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
    makePostRequest("updateOrderStatus/" + request_id, data, onSuccess, onFailure);
    makePostRequest("updateOrderHistory/" + request_id, history, onSuccess, onFailure);
    location.reload();
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
 * Find the index of the given approver's name in reqApproverArr array
 * @param {string} name the approver's name
 * Return the index in reqApproverArr array
 */
// function findApprover(name) {
//     var result = -1;
//     for (var i = 0; i < reqApproverArr.length; i++) {
//         if (reqApproverArr[i].Approver) {
//             if (reqApproverArr[i].Approver == name) {
//                 result = i;
//             }
//         }
        
//     }
//     return result;
// }

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


