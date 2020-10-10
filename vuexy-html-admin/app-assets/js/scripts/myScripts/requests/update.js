/**
 * Sould be included by forms
 * Define functions for pre-set form content
 */


function prepareRequest(request_info, request_type) {
    if (request_type == "Reimbursement") {
        setRadioValueByName("myself_onbehalf_radio", request_info.ReimburseFor);
        if (request_info.ReimburseFor == "onbehalf") {
            document.getElementById("onBehalf_Yes").setAttribute('class', 'visible');
            setTextValueById("onbehalf-affiliation", request_info.OnbehalfAffiliation);
            setTextValueById("onbehalf-name", request_info.OnbehalfName);
            setTextValueById("onbehalf-email", request_info.OnbehalfEmail);
        }
    
        var individual_val = request_info.Individual;
        if (individual_val == "employee") {
            setRadioValueByName("individual_reimbursed", request_info.Individual);
            setRadioValueByName("paymentRadio", request_info.Payment);
            document.getElementById("emplyee_payment").setAttribute('class', 'col-12');
        } else {
            setRadioValueByName("individual_reimbursed", request_info.Individual);
            setRadioValueByName("paymentRadio2", request_info.Payment);
            document.getElementById("nonemplyee_payment").setAttribute('class', 'col-12');
    
            if (request_info.Payment == "Mail the check") {
                var addrBlock = document.getElementById("mail-addr");
                addrBlock.setAttribute('class', 'visible');
                setAddress(request_info.Addr);
            }
        }
    } else if (request_type == "Purchase Request" || request_type == "Pay an Invoice") {
        var vendorObj = request_info.VendorInfo;
        setTextValueById("vendor-name", vendorObj.Name);
        setTextValueById("vendor-email", vendorObj.Email);
        setTextValueById("vendor-website", vendorObj.Website);
        setTextValueById("vendor-phone", vendorObj.Phone);
    } else if (request_type == "Procard Receipt") {
        setTextValueById("name-on-card", request_info.Cardholder);
        var vendorObj = request_info.VendorInfo;
        setTextValueById("vendor-name", vendorObj.Name);
        setTextValueById("vendor-email", vendorObj.Email);
        setTextValueById("vendor-website", vendorObj.Website);
        setTextValueById("vendor-phone", vendorObj.Phone);
    }

    prepareLineItem(request_info.LineItems, request_type);
}


function prepareLineItem(itemObj, type) {
    for (var x = 1; x <= itemObj.length; x++) {
        if (x >= idFlags.length) {
            addNewLineItem(idFlags.length);
        }
        var data = itemObj[x - 1];
        setTextValueById(`expense_${x}`, data.Expense);
        setTextValueById(`purpose_${x}`, data.Purpose);
        setTextValueById(`category_${x}`, data.Category);

        if (type == "Purchase Request") {
            setTextValueById(`quantity_${x}`, data.Quantity);
            setTextValueById(`unit_price_${x}`, data.UnitPrice);
        } else {
            setTextValueById(`amount_${x}`, data.Amount);
        }

        if (type == "Reimbursement" || type == "Procard Receipt") {
            setRadioValueByName(`taxRadio${x}`, data.TaxPaid);
        }
        setBudgetsValueById(x, data.Budgets);
    }
}


function setBudgetsValueById(itemId, budgetObj) {
    for (var x = 1; x <= budgetObj.length; x++) {
        if (x >= budgetIds[itemId - 1]) {
            document.getElementById(`budget_${itemId}_${budgetIds[itemId - 1] - 1}`).after(addBudget(itemId, budgetIds[itemId - 1]++, false));
        }
        var data = budgetObj[x - 1];
        // set budget number
        setTextValueById(`budget_num_${itemId}_${x}`, data.Number);
        // set split with select box and corresponding value
        var splitVal = data.Split;
        if (splitVal.substr(0, 1) == "$") {
            setTextValueById(`split_with_${itemId}_${x}`, "amount");
            setTextValueById(`split_dollar_input_value_${itemId}_${x}`, splitVal.substr(1));
        } else {
            setTextValueById(`split_with_${itemId}_${x}`, "percentage");
            setTextValueById(`split_percent_input_value_${itemId}_${x}`, splitVal.substr(0, splitVal.length - 1));
            splitWithChanged(itemId, x);
        }
        // set additional info
        if (data.Task) {
            setCheckboxById(`budget-info-${itemId}-${x}-1`);
            setTextValueById(`budget-info-value-${itemId}-${x}-1`, data.Task);
            toggleInputBox(itemId, x, 1);
        }
        if (data.Option) {
            setCheckboxById(`budget-info-${itemId}-${x}-2`);
            setTextValueById(`budget-info-value-${itemId}-${x}-2`, data.Option);
            toggleInputBox(itemId, x, 2);
        }
        if (data.Project) {
            setCheckboxById(`budget-info-${itemId}-${x}-3`);
            setTextValueById(`budget-info-value-${itemId}-${x}-3`, data.Project);
            toggleInputBox(itemId, x, 3);
        }
    }
}

function setAddress(addressObj) {
    setTextValueById("full_name", addressObj.FullName);
    setTextValueById("street_addr_1", addressObj.AddrLine1);
    setTextValueById("street_addr_2", addressObj.AddrLine2);
    setTextValueById("addr_city", addressObj.AddrCity);
    setTextValueById("addr_state", addressObj.AddrState);
    setTextValueById("addr_zip", addressObj.AddrZip);
    setTextValueById("addr_country", addressObj.AddrCountry);
}


function setTextValueById(textId, val) {
    var el = document.getElementById(textId);
    el.value = val;
}

function setRadioValueByName(radioName, val) {
    var el = document.getElementsByName(radioName);
    for (var x = 0; x < el.length; x++) {
        if (el[x].value == val) {
            el[x].checked = true;
            break;
        }
    }
}

function setCheckboxById(checkboxId) {
    var el = document.getElementById(checkboxId);
    el.checked = true;
}


function prepareDocs(request_id) {
    var filesName = getDocsName(request_id);
    for (var x = 0; x < filesName.length; x++) {
        setDocs(filesName[x], fileNum);
        fileNum ++;
    }
}


function setDocs(name, file_id) {
    var request_id = window.sessionStorage.getItem('RequestID');
    var row = document.createElement('div');
    row.setAttribute('class', 'form-group row');
    row.setAttribute('id', 'file_row_' + file_id);

    var first = document.createElement('div');
    first.setAttribute('class', 'col-md-4');
    first.innerHTML = "Attachments";
    document.getElementById("docsLabel").setAttribute('class', 'hidden');

    var second = document.createElement('div');
    second.setAttribute('class', 'col-md-3');
    var a = document.createElement('a');
    a.setAttribute('href', 
    `https://coe-api.azurewebsites.net/api/downloadAttachment/${request_id}/${name}`);
    // a.setAttribute('class', 'mt-2');
    a.innerHTML = name;
    second.appendChild(a);

    var third = document.createElement('div');
    third.setAttribute('class', 'col-md-1');
    var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('class', 'btn btn-icon rounded-circle btn-flat-danger');
    btn.setAttribute('id', 'file_btn_' + file_id);

    var icon = document.createElement('i');
    icon.setAttribute('class', 'feather icon-x-circle');
    btn.appendChild(icon);
    btn.onclick = function() {
        document.getElementById('file_row_' + file_id).remove();
    };
    third.appendChild(btn);

    row.appendChild(first);
    row.appendChild(second);
    row.appendChild(third);
    document.getElementById("file_block").prepend(row);
}


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

function getRequestInfo(request_id) {
    var info = null;
    var onSuccess = function(data) {
        if (data.status == true) {
            console.log("request information is here");
            
            info = JSON.parse(data.data.OrderInfo);
            console.log(info);
            
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