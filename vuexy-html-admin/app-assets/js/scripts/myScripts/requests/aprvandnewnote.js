var feedback = document.getElementById("feedback_input");
var actionTable = document.getElementById("action_table");

var approvalArr = [];
var action_card = document.getElementById('action_card');
var note_add_card = document.getElementById('note_add_card');

var accessLevel = null;
let approverMap = new Map();

window.addEventListener('load', function() {
    accessLevel = window.sessionStorage.getItem('level');

    updateApprovalBoard(requestInfo);
    updateActionField(requestInfo);
    adjustActionHeight();
});


function updateApprovalBoard(data) {
    // collect awaiting approval information
    var ar = data.ApprovalResponses;
    // console.log(ar);
    for (var i = 0; i < ar.length; i++) {
        var ari = ar[i].approverResponses;
        for (var j = 0; j < ari.length; j++) {
            if (!approverMap.get(ari[j].approverID_ref)) {
                var name = getUserInfo(ari[j].approverID_ref).Name;
                approverMap.set(ari[j].approverID_ref, name);
            }
            approvalArr.push({
                budgetnum : ar[i].BudgetNumber,
                approver: ari[j].approverID_ref,
                lineitemid : ar[i].lineItemID,
                response: ari[j].response
            });
        }
    }
    // console.log(approvalArr);

    // generate action table
    if (approvalArr.length > 0) {
        document.getElementById('no-data').classList.add('hidden');
    }
    for (var i = 0; i < approvalArr.length; i++) {
        actionTable.appendChild(genApprovalCell(approvalArr[i].budgetnum, approvalArr[i].approver, approvalArr[i].lineitemid, approvalArr[i].response));
    }
}

function updateActionField(data) {
    if (accessLevel == "Submitter") {
        var request_status = data.OrderStatus;
        if (request_status == "Awaiting Update") {
            var updateBtn = document.getElementById('update-btn');
            updateBtn.disabled = false;
        }
    } else if (accessLevel == "FiscalStaff") {
        var request_status = data.OrderStatus;
        var originalAssigndeTo = data.assignedTo;
        var self_id = sessionStorage.getItem('id');
        if (request_status == "Approved" && self_id == originalAssigndeTo) {
            var acceptBtn = document.getElementById('accept-btn');
            acceptBtn.disabled = false;
            var sendBackBtn = document.getElementById('send-back-btn');
            sendBackBtn.disabled = false;
        }
        if (request_status == "Accepted" && self_id == originalAssigndeTo) {
            var completeBtn = document.getElementById('complete-btn');
            completeBtn.disabled = false;
        }
    }
}


function genApprovalCell(budgetnum, approver, lineitemid, response) {
    var tr = document.createElement('tr');

    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    td1.innerHTML = budgetnum;
    td2.innerHTML = approverMap.get(approver);
    td3.innerHTML = lineitemid;

    if (response == true) {
        var s = document.createElement('span');
        s.setAttribute('class', 'badge badge-success');
        s.innerHTML = "Approved";
        td4.appendChild(s);
    } else if (response == false) {
        var s = document.createElement('span');
        s.setAttribute('class', 'badge badge-danger');
        s.innerHTML = "Sent Back";
        td4.appendChild(s);
    } else {
        if (accessLevel == "Approver" && approver == userID && requestInfo.OrderStatus == "Awaiting Approval") {
            var btn = document.createElement('button');
            btn.setAttribute('type', 'button');
            btn.setAttribute('class', 'btn mr-1 mb-0 btn-outline-success btn-sm');
            var i1 = document.createElement('i');
            i1.setAttribute('class', 'mr-1 fa fa-check');
            btn.appendChild(i1);
            btn.innerHTML = "Approve";
            btn.addEventListener('click', function() {
                var row = this.parentNode.parentNode;
                approveClicked(row.cells[0].innerHTML, parseInt(row.cells[2].innerHTML));
            });
            td4.appendChild(btn);
        
            var btn2 = document.createElement('button');
            btn2.setAttribute('type', 'button');
            btn2.setAttribute('class', 'btn mr-1 mb-0 btn-outline-danger btn-sm');
            var i2 = document.createElement('i');
            i2.setAttribute('class', 'mr-1 fa fa-times');
            btn2.appendChild(i2);
            btn2.innerHTML = "Send Back";
            btn2.addEventListener('click', function() {
                var row = this.parentNode.parentNode;
                sendBackClickedByApprover(row.cells[0].innerHTML, parseInt(row.cells[2].innerHTML));
            });
            td4.appendChild(btn2);
        } else {
            var s = document.createElement('span');
            s.setAttribute('class', 'badge badge-warning');
            s.innerHTML = "Pending";
            td4.appendChild(s);
        }
    }

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
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


function updateClicked() {
    if (requestInfo.OrderType == "Reimbursement") {
        window.sessionStorage.setItem('RequestType', "Reimbursement");
        window.location.href = "../../../html/ltr/users/user-reimbursement-3.html";
    } else if (requestInfo.OrderType == "Purchase Request") {
        window.sessionStorage.setItem('RequestType', "Purchase Request");
        window.location.href = "../../../html/ltr/users/user-purchase.html";
    } else if (requestInfo.OrderType == "Procard Receipt") {
        window.sessionStorage.setItem('RequestType', "Procard Receipt");
        window.location.href = "../../../html/ltr/users/user-procard.html";
    } else if (requestInfo.OrderType == "Pay an Invoice") {
        window.sessionStorage.setItem('RequestType', "Pay an Invoice");
        window.location.href = "../../../html/ltr/users/user-invoice.html";
    }
}

function sendBackClickedByApprover(budgetnum, lineitemid) {

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

    var controller = {
        data: true
    };

    var status = {
        OrderStatus: "Awaiting Update"
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
    makePutRequest("ApproverResponse", data, onSuccess, onFailure);
    makePostRequest("updateApprovalChainController/" + request_id, controller, onSuccess, onFailure);
    makePostRequest("updateOrderStatus/" + request_id, status, onSuccess, onFailure);
    makePostRequest("updateOrderHistory/" + request_id, history, onSuccess, onFailure);
    location.reload();
}


function sendBackClickedByStaff() {
    $('#sendbackModal').modal('hide');

    var status = {
        OrderStatus: "Awaiting Update"
    };

    var history = null;

    var controller = null;

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

    var option = document.getElementsByName("sendbackRadio");
    var optionVal = null;
    for (var i = 0; i < option.length; i++) {
        if (option[i].checked) {
            // console.log(option[i].value);
            optionVal = option[i].value;
        }
    }

    if (optionVal == "back_pass") {
        history = {
            userName: window.sessionStorage.getItem("id"),
            action: "Sent Back and Back Pass Approvers"
        };

        controller = {
            data: false
        };
    } else if (optionVal == "require_approval") {
        history = {
            userName: window.sessionStorage.getItem("id"),
            action: "Sent Back and Require Approvers Approval"
        };

        controller = {
            data: true
        };
    }
    
    makePostRequest("updateApprovalChainController/" + request_id, controller, onSuccess, onFailure);
    makePostRequest("updateOrderStatus/" + request_id, status, onSuccess, onFailure);
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


function getUserInfo(user_id) {
    var info = null;
    var onSuccess = function(data) {
        if (data.status == true) {
            info = data.data.userInfo;
        } else {
            //error message
            info = null;
        }
    }

    var onFailure = function() {
        // failure message
        info = null;
    }
    makeGetRequest("getUserInformation/" + user_id, onSuccess, onFailure);
    return info;
}