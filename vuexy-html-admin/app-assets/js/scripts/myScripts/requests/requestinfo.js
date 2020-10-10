var requestType = document.getElementById("request-type");
var requester = document.getElementById("requester");
var payee = document.getElementById("payee");
var payeeLabel = document.getElementById("payee-label");
var subunit = document.getElementById("subunit");

var requestStatus = document.getElementById("status");
var requestDate = document.getElementById("request-date");
var requestID = document.getElementById("requestID");
var assignedTo = document.getElementById("assignedTo");

var requestInfoHead = document.getElementById('request-info-head');
var requestInfoBody = document.getElementById('request-info-body');

var lineItemTableHead = document.getElementById('line-item-table-head');
var lineItemTableBody = document.getElementById('line-item-table-body');

var itemAmount = 0;
var additionalTax = 0;

var request_id = null;
var userID = null;
var requestInfo = null;

window.addEventListener('load', function() {
    request_id = window.sessionStorage.getItem('RequestID');
    userID = window.sessionStorage.getItem("id");

    requestInfo = getRequestInfo(request_id);
    updateRequestInfo(requestInfo);
});


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


/**
 * Update request information for the whole page
 * @param {JSON Object} request_data contains all the information of this request
 */
function updateRequestInfo(request_data) {
    const basicInfo = request_data;

    // Part 1: Basic information
    var request_type = basicInfo.OrderType;
    requestType.innerHTML = request_type;
    requestDate.innerHTML = basicInfo.submittedOn.substr(0, 10);
    requestStatus.innerHTML = basicInfo.OrderStatus;
    
    requestID.innerHTML = basicInfo._id;
    requester.innerHTML = basicInfo.userName;
    subunit.innerHTML = basicInfo.Unit_SubUnit_Name;
    var originalAssigndeTo = basicInfo.assignedTo;
    if (originalAssigndeTo == null) {
        assignedTo.innerHTML = "Not Assigned Yet";
    } else {
        assignedTo.innerHTML = basicInfo.assignedTo_name;
    }

    const requestContent = JSON.parse(basicInfo.OrderInfo);
    // console.log(requestContent);
    if (request_type == "Reimbursement") {
        payee.setAttribute('class', 'visible');
        payeeLabel.setAttribute('class', 'mt-2');

        var reimburseFor = requestContent.ReimburseFor;
        if (reimburseFor == "onbehalf") {
            var payee_input = requestContent.OnbehalfName + 
                                " (" + requestContent.OnbehalfEmail + ", " + 
                                requestContent.OnbehalfAffiliation + ")";
            payee.innerHTML = payee_input;
        } else {
            payee.innerHTML = basicInfo.userName;
        }
    }
    
    // Part 3: Line item table
    lineItemTableHead.appendChild(genLineItemTableHead(request_type));
    const lineItems = requestContent.LineItems;
    var n = lineItems.length;
    for (var i = 0; i < n; i++) {
        lineItemTableBody.appendChild(genLineItemTableRow(i + 1, request_type, lineItems[i], n));
    }

    // Part 2: Brief summary
    requestInfoHead.appendChild(genRequestInfoHead(request_type));
    requestInfoBody.appendChild(genRequestInfoBody(request_type, requestContent));
}

/**
 * Generate the table head of part 2 (request basic info)
 * @param {string} request_type 
 */
function genRequestInfoHead(request_type) {
    var head = document.createElement('tr');
    var th_1 = document.createElement('th');
    var th_2 = document.createElement('th');
    var th_3 = document.createElement('th');
    if (request_type == "Reimbursement") {
        th_1.innerHTML = "SHIPPING ADDRESS";
        th_2.innerHTML = "DELIVERY METHODS";
        th_3.setAttribute('colspan', '2');
        th_3.innerHTML = "REQUEST SUMMARY";
    } else if (request_type == "Purchase Request" || request_type == "Pay an Invoice") {
        th_1.innerHTML = "SHIPPING ADDRESS";
        th_2.innerHTML = "VENDOR CONTACTS";
        th_3.setAttribute('colspan', '2');
        th_3.innerHTML = "REQUEST SUMMARY";
    } else if (request_type == "Procard Receipt") {
        th_1.innerHTML = "CARDHOLDER";
        th_2.innerHTML = "VENDOR CONTACTS";
        th_3.setAttribute('colspan', '2');
        th_3.innerHTML = "REQUEST SUMMARY";
    }
    head.appendChild(th_1);
    head.appendChild(th_2);
    head.appendChild(th_3);
    return head;
}


/**
 * Generate the basic information body
 * @param {string} request_type 
 * @param {JSON Object} request_info 
 */
function genRequestInfoBody(request_type, request_info) {
    var body = document.createElement('tr');
    var td_1 = document.createElement('td');
    var td_2 = document.createElement('td');
    var td_3 = document.createElement('td');
    var td_4 = document.createElement('td');
    td_1.setAttribute('style', 'vertical-align: top;');
    td_2.setAttribute('style', 'vertical-align: top;');
    td_3.setAttribute('style', 'vertical-align: top;');
    td_4.setAttribute('style', 'vertical-align: top;');

    // Part 1: Addr / Cardholder
    if (request_type == "Reimbursement") {
        var p1 = document.createElement('p');
        var p2 = document.createElement('p');
        var p3 = document.createElement('p');
        var p4 = document.createElement('p');
        if (request_info.Payment == "Check mail") {
            var addr = request_info.Addr;
            p1.innerHTML = addr.FullName;
            p2.innerHTML = addr.AddrLine1;
            p3.innerHTML = addr.AddrLine2;
            p4.innerHTML = addr.AddrCity + ", " + addr.AddrState + " " + addr.AddrZip;
        } else {
            p1.innerHTML = "Department of Electrical & Computer Engineering";
            p2.innerHTML = "185 Stevens Way";
            p3.innerHTML = "Paul Allen Center – Room AE100R";
            p4.innerHTML = "Seattle, WA 98195-2500";
        }
        td_1.appendChild(p1);
        td_1.appendChild(p2);
        td_1.appendChild(p3);
        td_1.appendChild(p4);
    } else if (request_type == "Purchase Request" || request_type == "Pay an Invoice") {
        var p1 = document.createElement('p');
        var p2 = document.createElement('p');
        var p3 = document.createElement('p');
        var p4 = document.createElement('p');
        var addr = request_info.Addr;
        p1.innerHTML = addr.FullName;
        p2.innerHTML = addr.AddrLine1;
        p3.innerHTML = addr.AddrLine2;
        p4.innerHTML = addr.AddrCity + ", " + addr.AddrState + " " + addr.AddrZip;
        td_1.appendChild(p1);
        td_1.appendChild(p2);
        td_1.appendChild(p3);
        td_1.appendChild(p4);
    } else if (request_type == "Procard Receipt") {
        var p = document.createElement('p');
        p.innerHTML = request_info.Cardholder;
        td_1.appendChild(p);
    }


    // Part 2: delivery method / vendor contacts
    if (request_type == "Reimbursement") {
        td_2.innerHTML = request_info.Payment;
    } else if (request_type == "Purchase Request" || 
                    request_type == "Procard Receipt" || 
                    request_type == "Pay an Invoice") {
        var name = document.createElement('p');
        var email = document.createElement('p');
        var phone = document.createElement('p');
        var website = document.createElement('p');
        var vendor = request_info.VendorInfo;
        name.innerHTML = vendor.Name;
        email.innerHTML = vendor.Email;
        phone.innerHTML = vendor.Phone;
        website.innerHTML = vendor.Website;
        td_2.appendChild(name);
        td_2.appendChild(email);
        td_2.appendChild(phone);
        td_2.appendChild(website);
    }

    // Part 3: Cost summary
    if (request_type == "Reimbursement" || request_type == "Procard Receipt") {
        var summary_p1 = document.createElement('p');
        var summary_p2 = document.createElement('p');
        var summary_p3 = document.createElement('p');
        summary_p1.innerHTML = "Items:";
        summary_p2.innerHTML = "Additional tax:";
        summary_p3.innerHTML = "<strong>Grand total:</strong>";
        td_3.appendChild(summary_p1);
        td_3.appendChild(summary_p2);
        td_3.appendChild(summary_p3);
        var item_cost = document.createElement('p');
        item_cost.innerHTML = "$ " + itemAmount;
        var estimated_tax = document.createElement('p');
        estimated_tax.innerHTML = "$ " + additionalTax;
        var grand_total = document.createElement('p');
        var grand = itemAmount + additionalTax;
        var grand_input = "$ " + grand;
        grand_total.innerHTML = grand_input;
        td_4.appendChild(item_cost);
        td_4.appendChild(estimated_tax);
        td_4.appendChild(grand_total);
    } else if (request_type == "Purchase Request" || request_type == "Pay an Invoice") {
        var summary_p1 = document.createElement('p');
        var summary_p2 = document.createElement('p');
        var summary_p3 = document.createElement('p');
        summary_p1.innerHTML = "Items:";
        summary_p2.innerHTML = "Approximate tax:";
        summary_p3.innerHTML = "<strong>Grand total:</strong>";
        td_3.appendChild(summary_p1);
        td_3.appendChild(summary_p2);
        td_3.appendChild(summary_p3);
        var item_cost = document.createElement('p');
        item_cost.innerHTML = "$ " + itemAmount;
        var estimated_tax = document.createElement('p');
        additionalTax = itemAmount * 0.101;
        estimated_tax.innerHTML = "$ " + Math.round(additionalTax * 1000) / 1000;
        var grand_total = document.createElement('p');
        var grand = itemAmount + additionalTax;
        var grand_input = "$ " + grand;
        grand_total.innerHTML = grand_input;
        td_4.appendChild(item_cost);
        td_4.appendChild(estimated_tax);
        td_4.appendChild(grand_total);
    }
    
    body.appendChild(td_1);
    body.appendChild(td_2);
    body.appendChild(td_3);
    body.appendChild(td_4);
    return body;
}

/**
 * Generate the line item table head based on different request type
 * @param {string} request_type 
 */
function genLineItemTableHead(request_type) {
    var head = document.createElement('tr');
    var th_1 = document.createElement('th');
    var th_2 = document.createElement('th');
    var th_3 = document.createElement('th');
    var th_4 = document.createElement('th');
    var th_5 = document.createElement('th');
    var th_6 = document.createElement('th');
    var th_7 = document.createElement('th');
    th_1.innerHTML = "No.";

    var th_2_p1 = document.createElement('p');
    var th_2_p2 = document.createElement('p');
    th_2_p1.setAttribute('style', 'margin-bottom: 0;');
    th_2_p2.setAttribute('style', 'margin-bottom: 0;');
    th_2_p1.innerHTML = "Expense Description";
    th_2_p2.innerHTML = "Business Purpose";
    th_2.appendChild(th_2_p1);
    th_2.appendChild(th_2_p2);

    th_3.innerHTML = "Category";
    th_4.innerHTML = "Budget(s)";

    head.appendChild(th_1);
    head.appendChild(th_2);
    head.appendChild(th_3);
    head.appendChild(th_4);

    if (request_type == "Reimbursement" || request_type == "Procard Receipt") {
        th_5.innerHTML = "Amount";
        th_6.innerHTML = "Tax";
        th_7.innerHTML = "Documentation";
        head.appendChild(th_5);
        head.appendChild(th_6);
        head.appendChild(th_7);
    } else if (request_type == "Purchase Request") {
        th_5.innerHTML = "Quantity";
        th_6.innerHTML = "Unit Price";
        th_7.innerHTML = "Documentation";
        head.appendChild(th_5);
        head.appendChild(th_6);
        head.appendChild(th_7);
    } else if (request_type == "Pay an Invoice") {
        th_5.innerHTML = "Amount";
        th_5.innerHTML = "Documentation";
        head.appendChild(th_5);
        head.appendChild(th_6);
    }
    
    
    return head;
}


/**
 * Use to generate a line item table row
 * @param {int} seq the sequence of this line item (since the id not always continuous)
 * @param {string} request_type 
 * @param {JSON Object} line_item_info 
 * @param {int} line_item_len use to determine the row-span of docs column
 */
function genLineItemTableRow(item_seq, request_type, line_item_info, line_item_len) {

    var tr = document.createElement('tr');
    var _id_td = document.createElement('td');
    _id_td.innerHTML = item_seq;

    var expense_purpose_td = document.createElement('td');
    var exp = document.createElement('p');
    exp.setAttribute('style', 'margin-bottom: 0;');
    exp.innerHTML = line_item_info.Expense;
    var pur = document.createElement('p');
    pur.setAttribute('style', 'margin-bottom: 0;');
    pur.innerHTML = line_item_info.Purpose;
    expense_purpose_td.appendChild(exp);
    expense_purpose_td.appendChild(pur);

    var category_td = document.createElement('td');
    category_td.innerHTML = line_item_info.Category;

    var budgets_td = genBudgetsCell(line_item_info.Budgets);
    
    
    tr.appendChild(_id_td);
    tr.appendChild(expense_purpose_td);
    tr.appendChild(category_td);
    tr.appendChild(budgets_td);

    if (request_type == "Reimbursement" || request_type == "Procard Receipt") {
        var amount_td = document.createElement('td');
        amount_td.innerHTML = line_item_info.Amount;
        itemAmount += parseFloat(line_item_info.Amount);
        tr.appendChild(amount_td);

        // Append tax td
        var tax_td = document.createElement('td');
        var taxInfo = line_item_info.TaxPaid;
        if (taxInfo == "yes") {
            tax_td.innerHTML = "Included";
        } else if (taxInfo == "no") {
            var item_amount = line_item_info.Amount;
            var tax_estimate = item_amount * 0.101;
            var tax_estimate_input = Math.round(tax_estimate * 1000) / 1000;
            tax_td.innerHTML = tax_estimate_input;
            additionalTax += parseFloat(tax_estimate_input);
        } else if (taxInfo == "nontaxable") {
            tax_td.innerHTML = "Not Taxable";
        }
        tr.appendChild(tax_td);
    } else if (request_type == "Purchase Request") {
        var quantity_td = document.createElement('td');
        var unit_id = document.createElement('td');
        quantity_td.innerHTML = line_item_info.Quantity;
        unit_id.innerHTML = line_item_info.UnitPrice;
        quantityNum = parseFloat(line_item_info.Quantity);
        unitPriceNum = parseFloat(line_item_info.UnitPrice);
        itemAmount += quantityNum * unitPriceNum;
        tr.appendChild(quantity_td);
        tr.appendChild(unit_id);
    } else if (request_type == "Pay an Invoice") {
        var amount_td = document.createElement('td');
        amount_td.innerHTML = line_item_info.Amount;
        itemAmount += parseFloat(line_item_info.Amount);
        tr.appendChild(amount_td);
    }

    // Append docs td
    if (item_seq == 1) {
        var doc_td = document.createElement('td');
        doc_td.setAttribute('rowspan', `${line_item_len}`);
        tr.appendChild(doc_td);
        docsName = getDocsName(request_id);
        // console.log(docsName);
        if (docsName) {
            for (var x = 0; x < docsName.length; x++) {
                var a = document.createElement('a');
                var name = docsName[x];
                a.setAttribute('href', 
                `https://coe-api.azurewebsites.net/api/downloadAttachment/${request_id}/${name}`);
                a.setAttribute('style', 'margin-right: 1rem;');
                a.innerHTML = name;
                doc_td.appendChild(a);
            }
        }
        
    }

    return tr;
}


/**
 * Get names of all attached files
 * Return the JSON Object
 * @param {string} request_id 
 */
function getDocsName(request_id) {
    var info = null;
    var onSuccess = function(data) {
        if (data.status == true) {
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

    makeGetRequest("getfilesAttached/" + request_id, onSuccess, onFailure);
    return info;
}


/**
 * Generate a cell to display split budget 
 * @param {array (JSON Object)} arr budgets array from the line item information
 */
function genBudgetsCell(arr) {
    var td = document.createElement('td');
    var n = arr.length;

    for (var i = 0; i < n; i++) {
        var border = false;
        var p = document.createElement('p');
        if (n == 1) {
            p.innerHTML = arr[i].Number;
        } else {
            p.innerHTML = arr[i].Split + ' on ' + arr[i].Number;
        }
        td.appendChild(p);

        // Append optional info
        if (arr[i].Task) {
            if (border == false) {
                td.appendChild(genBudgetInfo(arr[i].Task, true));
                border = true;
            } else {
                td.appendChild(genBudgetInfo(arr[i].Task, false));
            }
        }
        if (arr[i].Option) {
            if (border == false) {
                td.appendChild(genBudgetInfo(arr[i].Option, true));
                border = true;
            } else {
                td.appendChild(genBudgetInfo(arr[i].Option, false));
            }
        }
        if (arr[i].Project) {
            if (border == false) {
                td.appendChild(genBudgetInfo(arr[i].Project, true));
                border = true;
            } else {
                td.appendChild(genBudgetInfo(arr[i].Project, false));
            }
        }
        if (border == false) {
            p.setAttribute('style', 'border-bottom: 1px dashed #d9d9d9;');
        }
    }

    return td;
}

/**
 * Generate the additional info for the budget number
 * @param {int} text contents of the info
 * @param {boolean} border true or false, determine whether append border
 */
function genBudgetInfo(text, border) {
    var info = document.createElement('p');
    if (border) {
        info.setAttribute('style', 'border-bottom: 1px dashed #d9d9d9;');
    }
    var info_input = "(" + text.toUpperCase() + ")";
    info.innerHTML = info_input;
    return info;
}
