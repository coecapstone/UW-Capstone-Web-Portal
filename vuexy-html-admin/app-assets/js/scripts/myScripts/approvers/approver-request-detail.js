var reqApproverArr = [];
var reqBuyer = {};
let approverResponseMap = new Map(); // key: approverid, value: {name, response}

// var feedbackBlock = document.getElementById("feedback-block");
var feedback = document.getElementById("feedback_input");
var actionTable = document.getElementById("action_table");

var request_id = null;
var requestInfo = null;
var userID = null;

var actionArr = [];
var action_card = document.getElementById('action_card');
var note_add_card = document.getElementById('note_add_card');

window.onload = function() {
    request_id = window.sessionStorage.getItem('RequestID');
    userID = window.sessionStorage.getItem("id");
    this.console.log(request_id);

    // Request Example: Reimbursement
    // request_id = "5f1b2a648813560044fa2c52";
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
    adjustActionHeight();

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
    // collect awaiting approval information
    var ar = data.ApprovalResponses;
    for (var i = 0; i < ar.length; i++) {
        var ari = ar[i].approverResponses;
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
    // console.log(actionArr);

    // generate action table
    if (actionArr.length > 0) {
        document.getElementById('no-data').classList.add('hidden');
    }
    for (var i = 0; i < actionArr.length; i++) {
        actionTable.appendChild(genApprovalCell(actionArr[i].budgetnum, actionArr[i].lineitemid, actionArr[i].response));
    }
}


function genApprovalCell(budgetnum, lineitemid, response) {
    var tr = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    td1.innerHTML = budgetnum;
    td2.innerHTML = lineitemid;

    if (response) {
        var i = document.createElement('i');
        i.setAttribute('class', 'mr-2 fa fa-check success');
        var s = document.createElement('span');
        s.setAttribute('class', 'success');
        s.innerHTML = "Approved";
        td3.appendChild(i);
        td3.appendChild(s);
    } else {
        var btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('class', 'btn mr-1 mb-0 btn-outline-success btn-sm');
        var i1 = document.createElement('i');
        i1.setAttribute('class', 'mr-1 fa fa-check');
        btn.appendChild(i1);
        btn.innerHTML = "Approve";
        btn.addEventListener('click', function() {
            var row = this.parentNode.parentNode;
            approveClicked(row.cells[0].innerHTML, parseInt(row.cells[1].innerHTML));
        });
        td3.appendChild(btn);
    
        var btn2 = document.createElement('button');
        btn2.setAttribute('type', 'button');
        btn2.setAttribute('class', 'btn mr-1 mb-0 btn-outline-danger btn-sm');
        var i2 = document.createElement('i');
        i2.setAttribute('class', 'mr-1 fa fa-times');
        btn2.appendChild(i2);
        btn2.innerHTML = "Send Back";
        btn2.addEventListener('click', function() {
            var row = this.parentNode.parentNode;
            sendBackClicked(row.cells[0].innerHTML, parseInt(row.cells[1].innerHTML));
        });
        td3.appendChild(btn2);
    }

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    return tr;
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

function sendBackClicked(budgetnum, lineitemid) {

    var data = {
        orderID: request_id,
        approverID: userID,
        budgetNumber: budgetnum,
        LineItemNumber: lineitemid,
        response: false
    };

    var history = {
        userName: window.sessionStorage.getItem("id"),
        action: "Budget Number " + budgetnum + " Sent Back"
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
    makePutRequest("ApproverResponse", data, onSuccess, onFailure);
    makePostRequest("updateOrderHistory/" + request_id, history, onSuccess, onFailure);
    location.reload();
}

function approveClicked(budgetnum, lineitemid) {

    var data = {
        orderID: request_id,
        approverID: userID,
        budgetNumber: budgetnum,
        LineItemNumber: lineitemid,
        response: true
    };

    var history = {
        userName: window.sessionStorage.getItem("id"),
        action: "Budget Number " + budgetnum + " Approved"
    };

    var onSuccess = function(data) {
        if (data.status == true) {
            if (data.data.AwaitingResponses.length == 0) {
                var status = {
                    OrderStatus: "Approved"
                };
                var onSuccess = function(data) {
                    if (data.status == true) console.log('order status updated');
                    else console.log('there is something wrong');
                }
                var onFailure = function() {}
                makePostRequest("updateOrderStatus/" + request_id, status, onSuccess, onFailure);
            }
        } else {
            //error message
        }
    }

    var onFailure = function() {
        // failure message
    }
    makePutRequest("ApproverResponse", data, onSuccess, onFailure);
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






// --------------- DEPRECATED ------------------------

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
