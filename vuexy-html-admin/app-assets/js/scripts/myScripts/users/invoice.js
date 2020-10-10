var itemNum = 1;
var fileNum = 1;
// Store all line items in an array
var lineItems = [];
// Track if this id is deleted
var idFlags = [];
// _id = 0, no such id
idFlags.push(false);
// _id = 1, the initial one
idFlags.push(true);

var budgetIds = [];
budgetIds.push(2);

// <K, V> => <line item id, {total, dollar, percent}>
let budgetMap = new Map();

var defaultMode = false;

var formData = new FormData();
var type = "";
var unit_id = "";
var budgets_database = [];
var user_id = "5e8e45eea148b9004420651f";

/******************************************************* BEGIN: Wizard step control ************************************************/

/*=========================================================================================
    File Name: my-wizard-steps.js
    Description: wizard steps page specific js based on original js file
    ----------------------------------ORIGINAL INFO---------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: PIXINVENT
    Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/



// Wizard tabs with numbers setup
$(".number-tab-steps").steps({
    headerTag: "h6",
    bodyTag: "fieldset",
    transitionEffect: "fade",
    titleTemplate: '<span class="step">#index#</span> #title#',
    labels: {
        finish: 'Submit'
    },
    onFinished: function (event, currentIndex) {
        alert("Form submitted.");
    }
});

// Wizard tabs with icons setup
$(".icons-tab-steps").steps({
    headerTag: "h6",
    bodyTag: "fieldset",
    transitionEffect: "fade",
    titleTemplate: '<span class="step">#index#</span> #title#',
    labels: {
        finish: 'Submit'
    },
    onFinished: function (event, currentIndex) {
        alert("Form submitted.");
    }
});


// Validate steps wizard

// Show form
var form = $(".steps-validation").show();

$(".steps-validation").steps({
    headerTag: "h6",
    bodyTag: "fieldset",
    transitionEffect: "fade",
    titleTemplate: '<span class="step">#index#</span> #title#',
    labels: {
        finish: 'Submit'
    },
    onStepChanging: function (event, currentIndex, newIndex) {
        // Allways allow previous action even if the current form is not valid!
        if (currentIndex > newIndex) {
            return true;
        }

        // Needed in some cases if the user went back (clean up)
        if (currentIndex < newIndex) {
            // To remove error styles
            form.find(".body:eq(" + newIndex + ") label.error").remove();
            form.find(".body:eq(" + newIndex + ") .error").removeClass("error");
        }
        form.validate().settings.ignore = ":disabled,:hidden";
        return form.valid();
    },
    onFinishing: function (event, currentIndex) {
        // form.validate().settings.ignore = ":disabled";
        return form.valid();
    },
    onFinished: function (event, currentIndex) {
        alert("Submitted!");
        alert('send data to database');

        if (window.sessionStorage.getItem("RequestID")) {
            updateRequest(window.sessionStorage.getItem("RequestID"));
        } else {
            uploadRequest();
        }
    }
});

// Initialize validation
$(".steps-validation").validate({
    ignore: 'input[type=hidden]', // ignore hidden fields
    errorClass: 'danger',
    successClass: 'success',
    highlight: function (element, errorClass) {
        $(element).removeClass(errorClass);
    },
    unhighlight: function (element, errorClass) {
        $(element).removeClass(errorClass);
    },
    errorPlacement: function (error, element) {
        console.log(error);
        if (element.hasClass('custom-control-input') || element.parent().hasClass('input-group')) {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }
    },
    rules: {
        name: {
            required: true
        },
        "ship-address": {
            required: true
        },
        "ship-city": {
            required: true
        },
        "ship-state": {
            required: true
        },
        "ship-zip": {
            required: true
        },
        country: {
            required: true
        },
        "vendor-name": {
            required: true
        },
        amount: {
            required: true,
            number: true
        },
        budget_num_1: {
            required: true
        }
    },
    messages: {
        budget_num_1: {
            required: "Please choose a budget number"
        }
    }
});


/************************************************ END: Wizard step control *******************************************************/




/**************************************************** BEGIN: Form Control ********************************************************/


/**
 * Get user information and budget information when the page loading
 * Set global variables
 */
window.onload = function() {
    if (window.localStorage.getItem('defaultAddr')) {
        defaultMode = true;
    }
    if (defaultMode) {
        var addrObj = JSON.parse(window.localStorage.getItem('defaultAddr'));
        var addrContent = document.getElementById('addr-content');
        addrContent.appendChild(genAddrLine(addrObj.FullName));
        addrContent.appendChild(genAddrLine(addrObj.AddrLine1));
        addrContent.appendChild(genAddrLine(addrObj.AddrLine2));
        var city = addrObj.AddrCity + ', ' + addrObj.AddrState + ' ' + addrObj.AddrZip;
        addrContent.appendChild(genAddrLine(city));
        addrContent.appendChild(genAddrCountry(addrObj.AddrCountry));
    } else {
        var default_block = document.getElementById('default-block');
        default_block.setAttribute('class', 'hidden');
        var addrInput = document.getElementById('mail-addr');
        addrInput.setAttribute('class', 'visible');
    }
    this.getUserInfo();
    this.getBudgetsInfo();
    // Initialize the budget select box
    var budget_select = this.document.getElementById('budget_num_1_1');
    for (var i = 0; i < this.budgets_database.length; i++) {
        var num = budgets_database[i];
        budget_select.appendChild(addBudgetData(num));
    }

    if (window.sessionStorage.getItem('RequestID')) {
        var request_id = window.sessionStorage.getItem('RequestID');
        var request_type = window.sessionStorage.getItem('RequestType');
        var request_info = getRequestInfo(request_id);
        prepareRequest(request_info, request_type);
        prepareDocs(request_id);
    }

    this.lineItemInit("Pay an Invoice");
};


function genAddrLine(content) {
    var p = document.createElement('p');
    p.setAttribute('style', 'margin: 0');
    p.innerHTML = content.toUpperCase();
    return p;
}

function genAddrCountry(content) {
    var p = document.createElement('p');
    p.innerHTML = content;
    return p;
}

/**
 * Get the user information from database
 * @param {string} type global variable, track the type (unit or subunit) which will be used in upload route
 * @param {string} unitID global variable, track the unit or subunit id, also need in upload route
 */
function getUserInfo() {
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
            
        } else {
            //error message
        }
    }

    var onFailure = function() {
        // failure message
    }

    makeGetRequest("getuserInformation/" + user_id, onSuccess, onFailure);
}



/************ BEGIIN:  Step1 & Step2 *****************/

$(document).on('click', '#use-new-addr', function() {
    var newAddr = document.getElementById('use-new-addr');
    var addrInput = document.getElementById('mail-addr');
    if (newAddr.checked) {
        addrInput.setAttribute('class', 'visible');
    } else {
        addrInput.setAttribute('class', 'hidden');
    }
});


/************ END:  Step1 & Step2 *****************/


/***************** BEGIN: Step3 *******************/

function uploadRequest() {
    /** Confirm each line item */
    for (var x = 1; x <= idFlags.length; x++) {
        if (idFlags[x]) {
            confirmItem(x);
        }
    }

    // getUserInfo();
    var formData = new FormData();

    //this is the JSON Object we are sending to the server
    var JSON_toServer = {
        "userID_ref": null, 
        "OrderType": null, 
        "OrderInfo": null,  //this is where we are going to put JSON_OrderInfo_inForm JSON object, but we will convert JSON_OrderInfo_inForm JSON object to string to send to server
        "OrderStatus": null, 
        "ChatInfo": null,
        "assignedTo": null
    };

    var addrInfo = null;
    
    if (defaultMode) {
        var useNewAddr = document.getElementById('use-new-addr');
        if (useNewAddr.checked) {
            addrInfo = {
                FullName: document.getElementById('full_name').value,
                AddrLine1: document.getElementById('street_addr_1').value,
                AddrLine2: document.getElementById('street_addr_2').value,
                AddrCity: document.getElementById('addr_city').value,
                AddrState: document.getElementById('addr_state').value,
                AddrZip: document.getElementById('addr_zip').value,
                AddrCountry: document.getElementById('addr_country').value
            };
            var saveAddr = document.getElementById('save-default-addr');
            if (saveAddr.checked) {
                window.localStorage.setItem('defaultAddr', JSON.stringify(addrInfo));
            }
        } else {
            addrInfo = JSON.parse(window.localStorage.getItem('defaultAddr'));
        }
    } else {
        addrInfo = {
            FullName: document.getElementById('full_name').value,
            AddrLine1: document.getElementById('street_addr_1').value,
            AddrLine2: document.getElementById('street_addr_2').value,
            AddrCity: document.getElementById('addr_city').value,
            AddrState: document.getElementById('addr_state').value,
            AddrZip: document.getElementById('addr_zip').value,
            AddrCountry: document.getElementById('addr_country').value
        };
        var saveAddr = document.getElementById('save-default-addr');
        if (saveAddr.checked) {
            window.localStorage.setItem('defaultAddr', JSON.stringify(addrInfo));
        }
    }

    

    var vendor_info = {
        Name: $("input[name='vendor-name']").val(),
        Email: $("input[name='vendor-email']").val(),
        Phone: $("input[name='vendor-phone']").val(),
        Website: $("input[name='vendor-website']").val()
    };

    var requestInfo = {
        VendorInfo: vendor_info,
        Addr: addrInfo,
        LineItems: lineItems
        // ItemsCost: itemsCost
    };

    //now lets set up the JSON_toServer JSON Object
    JSON_toServer.userID_ref = user_id;  // 5e63127145f8e019d1f26ddc
    JSON_toServer.OrderType = "Pay an Invoice";
    JSON_toServer.OrderInfo = JSON.stringify(requestInfo);
    // console.log(typeof(requestInfo));
    JSON_toServer.OrderStatus = "Submitted"; //leave this as Submitted, this represent current status of the Order. Example Order Status: Submitted, approved, etc:
    JSON_toServer.ChatInfo = "TEST CHAT INFO"; //leaving this empty since there's no chat when user upload a order first
    JSON_toServer.assignedTo = null; //leaving this as null since there's no one assigned when a user upload/submit a order.

    for (var i = 1; i <= fileNum; i++) {
        var fileSelect = document.getElementById("file_" + i);
        if (fileSelect) {
            for(var x = 0; x < fileSelect.files.length; x++) {
                formData.append(fileSelect.files[x].name, fileSelect.files[x]);
            }
            // "files" should stay as it is, 
            // becuase this is how server can identify files from the JSON information, 
            // when it get this HTTP request
            formData.append("files", fileSelect.files[x]);
        }
    }

    //here we just pass in the JSON object we need to pass to the server. "JSON_body" should stay as it is, becuase this is how server can identify files from the JSON information, when it get this HTTP request
    formData.set("JSON_body", JSON.stringify(JSON_toServer));
    // Http Request  
    var request = new XMLHttpRequest();
    //this function will get the response from the server after we upload the order
    request.onreadystatechange = function() {
        console.log("Request info is here:");
        if (request.readyState == 4) {
            // show it in the console
            const response_obj = JSON.parse(request.response);
            const data_obj = response_obj.data;
            console.log(data_obj);
            //convert order info to JSON
            const requestInfo_obj = JSON.parse(data_obj.OrderInfo);
            console.log(requestInfo_obj);
            sendRequestHistory(data_obj._id, "Submitted");
            window.sessionStorage.setItem('RequestID', data_obj._id);
            window.location.href = "../../../html/ltr/users/user-request-detailpage.html";
        }
    };
    request.open('POST', baseURL + "uploadOrder/" + type + "/" + unit_id);
    request.send(formData);
}


function updateRequest(request_id) {
    /** Confirm each line item */
    for (var x = 1; x <= idFlags.length; x++) {
        if (idFlags[x]) {
            confirmItem(x);
        }
    }

    var addrInfo = null;

    if (defaultMode) {
        var useNewAddr = document.getElementById('use-new-addr');
        if (useNewAddr.checked) {
            addrInfo = {
                FullName: document.getElementById('full_name').value,
                AddrLine1: document.getElementById('street_addr_1').value,
                AddrLine2: document.getElementById('street_addr_2').value,
                AddrCity: document.getElementById('addr_city').value,
                AddrState: document.getElementById('addr_state').value,
                AddrZip: document.getElementById('addr_zip').value,
                AddrCountry: document.getElementById('addr_country').value
            };
            var saveAddr = document.getElementById('save-default-addr');
            if (saveAddr.checked) {
                window.localStorage.setItem('defaultAddr', JSON.stringify(addrInfo));
            }
        } else {
            addrInfo = JSON.parse(window.localStorage.getItem('defaultAddr'));
        }
    } else {
        addrInfo = {
            FullName: document.getElementById('full_name').value,
            AddrLine1: document.getElementById('street_addr_1').value,
            AddrLine2: document.getElementById('street_addr_2').value,
            AddrCity: document.getElementById('addr_city').value,
            AddrState: document.getElementById('addr_state').value,
            AddrZip: document.getElementById('addr_zip').value,
            AddrCountry: document.getElementById('addr_country').value
        };
        var saveAddr = document.getElementById('save-default-addr');
        if (saveAddr.checked) {
            window.localStorage.setItem('defaultAddr', JSON.stringify(addrInfo));
        }
    }


    var vendor_info = {
        Name: $("input[name='vendor-name']").val(),
        Email: $("input[name='vendor-email']").val(),
        Phone: $("input[name='vendor-phone']").val(),
        Website: $("input[name='vendor-website']").val()
    };

    var requestInfo = {
        VendorInfo: vendor_info,
        Addr: addrInfo,
        LineItems: lineItems
        // ItemsCost: itemsCost
    };

    var updateInfo = {
        OrderInfo: JSON.stringify(requestInfo)
    };

    var history = {
        userName: window.sessionStorage.getItem("id"),
        action: "Updated"
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
    makePostRequest("updateOrder/" + request_id + "/" + type, updateInfo, onSuccess, onFailure);
    makePostRequest("updateOrderHistory/" + request_id, history, onSuccess, onFailure);
    
    window.location.href = "../../../html/ltr/users/user-request-detailpage.html";

}



/***************************************************** END: Form Control **********************************************************/
