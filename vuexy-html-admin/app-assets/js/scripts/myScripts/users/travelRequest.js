var itemNum = 1;
var lineItems = [];
var formData = new FormData();
var type = "";
var unitID = "";
const baseURL = "https://uwcoe-api.azurewebsites.net/api/";
var user_id = "5e8e45eea148b9004420651f";

var user_name="";
var user_uwid="";
var user_email="";
var user_subunitName="";
var user_accessLevel="";
var budgets_database = [];
/******************************************************* BEGIN: Wizard step control ************************************************/

/*=========================================================================================
    File Name: my-wizard-steps.js
    Description: wizard steps page specific js based on original js file
    ----------------------------------ORIGINAL INFO---------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: PIXINVENT
    Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


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

window.onload = function() {
    this.getUserInfo();//get user info 
    this.getBudgetsInfo();//get budget info

    //handle budget field
    var budget_select = this.document.getElementById('budget_num_1');
    var budget_select2 = this.document.getElementById('budget_num_2');
    for (var i = 0; i < this.budgets_database.length; i++) {
        var num = budgets_database[i];
        budget_select.appendChild(addBudgetData(num));
        budget_select2.appendChild(addBudgetData(num));
    }
};

/*
    click the submit button
*/
$(document).on('click', '#confirm_item', function uploadFiles_without_HTML_FORMS() {
    //***********************  input validation check ******************************************/
        if(document.getElementById("firstName").value==""){
            alert("Please fill out the First Name field.");
            document.getElementById("warning").innerHTML="Please fill out all * field.";
            return false;
        }
        if(document.getElementById("lastName").value==""){
            alert("Please fill out the Last Name field.");
            document.getElementById("warning").innerHTML="Please fill out all * field.";
            return false;
        }
        if(document.getElementById("departure").value==""){
            alert("Please fill out the Departure field.");
            document.getElementById("warning").innerHTML="Please fill out all * field.";
            return false;
        }
        if(document.getElementById("destination").value==""){
            alert("Please fill out the Destionation field.");
            document.getElementById("warning").innerHTML="Please fill out all * field.";
            return false;
        }
        if(document.getElementById("date").value==""){
            alert("Please fill out the Departing Date field.");
            document.getElementById("warning").innerHTML="Please fill out all * field.";
            return false;
        }
        if(document.getElementById("returnDate").value==""){
            alert("Please fill out the Returning Date field.");
            document.getElementById("warning").innerHTML="Please fill out all * field.";
            return false;
        }
        if(document.getElementById("reason").value==""){
            alert("Please fill out the Reason field.");
            document.getElementById("warning").innerHTML="Please fill out all * field.";
            return false;
        }
        
        if(document.getElementById("reason").value.length>1500){
            alert("No more than 1500 characters.");
            document.getElementById("warning").innerHTML="Please fill out all * field.";
            return false;
        }
       
        if($("input[name='flight']:checked").val()!="yes" && $("input[name='flight']:checked").val()!="no"){
            alert("Please fill out the Flight option.");
            document.getElementById("warning").innerHTML="Please fill out all * field.";
            return false;
        }
        if($("input[name='hotel']:checked").val()!="yes" && $("input[name='hotel']:checked").val()!="no"){
            alert("Please fill out the Hotel option.");
            document.getElementById("warning").innerHTML="Please fill out all * field.";
            return false;
        }
        if($("input[name='flight']:checked").val()=="yes"){
            if(document.getElementById("birthday").value==""){
                alert("Please fill out the Birthday field.");
                document.getElementById("warning").innerHTML="Please fill out all * field.";
                return false;
            }
        }
        //***********************  input validation check end******************************************/

        //------------- budget validation -------------------------------------------------------------------------------------------- 
        if(document.getElementById("budget_num_1").value==""){
            alert("Please fill out the Budget Number field.");
            document.getElementById("warning").innerHTML="Please fill out all * field.";
            return false;
        }
        if(document.getElementById("split_dollar_input_value_1_1").value=="" && document.getElementById("split_percent_input_value_1_1").value==""){
            alert("Please fill out the Budget field.");
            document.getElementById("warning").innerHTML="Please fill out all * field.";
            return false;
        }
        if(document.getElementById("budget_num_1").value==document.getElementById("budget_num_2").value){
            alert("Don't include the same budget number twice.");
            document.getElementById("warning").innerHTML="Don't include the same budget number twice.";
            return false;
        }
        if(document.getElementById("split_with_1_1").value=="percentage"){
            if(document.getElementById("split_percent_input_value_2_2").value==""){
                if(parseInt(document.getElementById("split_percent_input_value_1_1").value) !=100){
                    alert("Please make sure the sum of budget precentage is 100%.");
                    document.getElementById("warning").innerHTML="Please make sure the sum of budget precentage is 100%.";
                    return false;
                }
            }else{
                if(parseInt(document.getElementById("split_percent_input_value_1_1").value) + parseInt(document.getElementById("split_percent_input_value_2_2").value) !=100){
                    alert("Please make sure the sum of budget precentage is 100%.");
                    document.getElementById("warning").innerHTML="Please make sure the sum of budget precentage is 100%.";
                    return false;
                }
            }
        }
        //-------------- budget validation end ------------------------------------------------------------------------------------------

        alert("Submitted!");
        alert('send data to database');
        var formData = new FormData();

        //this is the JSON Object we are sending to the server
        var JSON_toServer = {
            "userID_ref": null, 
            "OrderType": null, 
            "OrderInfo": null,  //this is where we are going to put JSON_OrderInfo_inForm JSON object, but we will convert JSON_OrderInfo_inForm JSON object to string to send to server
            "OrderStatus": null, 
            "ChatInfo": null,
            "assignedTo": null
        }
        var budgetsArr = [];
        var budget1;
        var split1;
        var budget2;
        var split2;
        //---------------First Budget---------------------------------------------------
        var amount_percent=document.getElementById("split_with_1_1").value;
        if(amount_percent=="amount"){
            budgetsArr.push({
                Number: document.getElementById("budget_num_1").value,
                Split: "$"+document.getElementById("split_dollar_input_value_1_1").value
            });
            budget1=document.getElementById("budget_num_1").value;
            split1="$"+document.getElementById("split_dollar_input_value_1_1").value;
        }else if(amount_percent=="percentage"){
            budgetsArr.push({
                Number: document.getElementById("budget_num_1").value,
                Split: document.getElementById("split_percent_input_value_1_1").value+"%"
            });
            budget1=document.getElementById("budget_num_1").value;
            split1=document.getElementById("split_dollar_input_value_1_1").value+"%";
        } 
        //----------------Second Budget -------------------------------------------------
        if(document.getElementById("budget_num_2").value!="select"){
            var amount_percent2=document.getElementById("split_with_2_2").value;
            if(amount_percent2=="amount"){
                budgetsArr.push({
                    Number: document.getElementById("budget_num_2").value,
                    Split: "$"+document.getElementById("split_dollar_input_value_2_2").value
                });
                budget2=document.getElementById("budget_num_2").value;
                split2="$"+document.getElementById("split_dollar_input_value_2_2").value;
            }else if(amount_percent2=="percentage"){
                budgetsArr.push({
                    Number: document.getElementById("budget_num_2").value,
                    Split: document.getElementById("split_percent_input_value_2_2").value+"%"
                });
                budget2=document.getElementById("budget_num_2").value;
                split2=document.getElementById("split_dollar_input_value_2_2").value+"%";
            } 
        }
        //---------------------------------------------------------------------------------
        lineItems.push({
            id: 1,
            Budgets: budgetsArr,
            Amount: "0"
        });

        var requestInfo = {
            FirstName: $("input[name='firstName']").val(),
            LastName: $("input[name='lastName']").val(),
            Departure: $("input[name='departure']").val(),
            Destination: $("input[name='destination']").val(),
            Date: $("input[name='date']").val(),
            ReturnDate: $("input[name='returnDate']").val(),
            Reason: $("input[name='reason']").val(),
            Birthday: $("input[name='birthday']").val(),
            //Flight:
            Flight: $("input[name='flight']:checked").val(),
            FlightCompany: $("input[name='flight_company']").val(),
            FlightNumber: $("input[name='flight_number']").val(),
            FlightFrom: $("input[name='flight_from']").val(),
            FlightTo: $("input[name='flight_to']").val(),
            FlightDepartingDate: $("input[name='flight_departingDate']").val(),
            FlightReturningDate: $("input[name='flight_returningDate']").val(),
            FlightAmount: $("input[name='flight_amount']").val(),
            FlightReference: $("input[name='flight_reference']").val(),
            //hotel:
            Hotel: $("input[name='hotel']:checked").val(),
            HotelName: $("input[name='hotel_name']").val(),
            HotelAddress: $("input[name='hotel_address']").val(),
            HotelNum: $("input[name='hotel_num']").val(),
            HotelAddress: $("input[name='hotel_address']").val(),
            HotelZip: $("input[name='hotel_zip']").val(),
            HotelMovein:  $("input[name='hotel_movenin']").val(),
            HotelMoveout: $("input[name='hotel_movenout']").val(),
            HotelAmount: $("input[name='hotel_amount']").val(),
            HotelLink: $("input[name='hotel_link']").val(),
            HotelNote: $("input[name='hotel_note']").val(),
            NoteFromApprover: "",
            LineItems: lineItems
        }

        var date;
        n =  new Date();
        y = n.getFullYear();
        m = n.getMonth() + 1;
        d = n.getDate();
        if(m==1)    m="January";
        else if(m==2)    m="February";
        else if(m==3)    m="March";
        else if(m==4)    m="April";
        else if(m==5)    m="May";
        else if(m==6)    m="June";
        else if(m==7)    m="July";
        else if(m==8)    m="August";
        else if(m==9)    m="September";
        else if(m==10)    m="October";
        else if(m==11)    m="November";
        else if(m==12)    m="December";
        date= d + " " + m + ", " + y;

        //now lets set up the JSON_toServer JSON Object
        JSON_toServer.userID_ref = user_id;  // 5e63127145f8e019d1f26ddc
        JSON_toServer.OrderType = "Travel Request";
        JSON_toServer.OrderInfo = JSON.stringify(requestInfo);
        // console.log(typeof(requestInfo));
        JSON_toServer.OrderStatus = "Awaiting Approval"; //leave this as Submitted, this represent current status of the Order. Example Order Status: Submitted, approved, etc:
        JSON_toServer.assignedTo = null; //leaving this as null since there's no one assigned when a user upload/submit a order.

        //here we just pass in the JSON object we need to pass to the server. "JSON_body" should stay as it is, becuase this is how server can identify files from the JSON information, when it get this HTTP request
        formData.set("JSON_body", JSON.stringify(JSON_toServer));
        // Http Request  
        var request = new XMLHttpRequest();
        //this function will get the response from the server after we upload the order
        request.onreadystatechange = function() {
            console.log("Request info is here:");
            if (request.readyState == 4) {
                console.log(request.response);
                // show it in the console
                const response_obj = JSON.parse(request.response);
                const data_obj = response_obj.data;
                //convert order info to JSON
                const requestInfo_obj = JSON.parse(data_obj.OrderInfo);
                console.log(requestInfo_obj);
                sendRequestHistory(data_obj._id, "Submitted");
                // transfer data and direct to summary.html 
                window.sessionStorage.setItem('orderId',data_obj._id);
                window.sessionStorage.setItem('user_id',user_id);
                window.sessionStorage.setItem('user_name',user_name);
                window.sessionStorage.setItem('user_uwid',user_uwid);
                window.sessionStorage.setItem('user_email',user_email);
                window.sessionStorage.setItem('user_subunitName',user_subunitName);
                window.sessionStorage.setItem('user_AccessLevel',user_accessLevel);
                window.sessionStorage.setItem('type',"Travel Request");
                window.sessionStorage.setItem('submit_date',date);
                window.sessionStorage.setItem('status',"Awaiting Approval");
                window.sessionStorage.setItem('amount',"N/A");
                window.sessionStorage.setItem('firstname',$("input[name='firstName']").val());
                window.sessionStorage.setItem('lastname',$("input[name='lastName']").val());
                window.sessionStorage.setItem('departure',$("input[name='departure']").val());
                window.sessionStorage.setItem('destionation',$("input[name='destination']").val());
                window.sessionStorage.setItem('date',$("input[name='date']").val());
                window.sessionStorage.setItem('returndate',$("input[name='returnDate']").val());
                window.sessionStorage.setItem('reason',$("input[name='reason']").val());
                window.sessionStorage.setItem('flight',$("input[name='flight']:checked").val());
                window.sessionStorage.setItem('flight_company',$("input[name='flight_company']").val());
                window.sessionStorage.setItem('flight_number',$("input[name='flight_number']").val());
                window.sessionStorage.setItem('flight_from',$("input[name='flight_from']").val());
                window.sessionStorage.setItem('flight_to',$("input[name='flight_to']").val());
                window.sessionStorage.setItem('flight_departdate',$("input[name='flight_departingDate']").val());
                window.sessionStorage.setItem('flight_returndate',$("input[name='flight_returningDate']").val());
                window.sessionStorage.setItem('flight_amount',$("input[name='flight_amount']").val());
                window.sessionStorage.setItem('hotel',$("input[name='hotel']:checked").val());
                window.sessionStorage.setItem('hotel_name',$("input[name='hotel_name']").val());
                window.sessionStorage.setItem('hotel_address',$("input[name='hotel_address']").val());
                window.sessionStorage.setItem('hotel_num',$("input[name='hotel_num']").val());
                window.sessionStorage.setItem('hotel_zip',$("input[name='hotel_zip']").val());
                window.sessionStorage.setItem('hotel_amount',$("input[name='hotel_amount']").val());
                window.sessionStorage.setItem('hotel_link',$("input[name='hotel_link']").val());
                window.sessionStorage.setItem('flight_reference',$("input[name='flight_reference']").val());
                window.sessionStorage.setItem('hotel_note',$("input[name='hotel_note']").val());
                window.sessionStorage.setItem('birthday',$("input[name='birthday']").val());
                window.sessionStorage.setItem('note',"");
                window.sessionStorage.setItem('budget1',budget1);
                window.sessionStorage.setItem('split1',split1);
                window.sessionStorage.setItem('budget_length',budgetsArr.length);
                window.sessionStorage.setItem('budget2',budget2);
                window.sessionStorage.setItem('split2',split2);
                window.sessionStorage.setItem('hotel_movein',$("input[name='hotel_movenin']").val());
                window.sessionStorage.setItem('hotel_moveout',$("input[name='hotel_movenout']").val());
                window.location.href = "summary.html";
            }
        }
        request.open('POST', baseURL + "uploadOrder/" + type + "/" + unitID);
        request.send(formData);
        return true;
});

/*
    clear all order history of a user
*/
function deleteOrder(order_id)
{
    var onSuccess = function(data){
    }

    var onFaliure = function(){
        alert("fail");
        document.getElementById("result").innerHTML = "Backend faliure occured";
    }
    makeDeleteRequest("removeOrder/"+order_id,onSuccess,onFaliure);
    //makeDeleteRequest("removeOrder/5ed59a800598f40045c315d3",onSuccess,onFaliure);
    //makeDeleteRequest("removeOrder/5ed59c100598f40045c315d4",onSuccess,onFaliure);
}

/*
    click tge delete button to delete all order history of a user
*/
$(document).on('click', '#delete',function getAllOrders(){
    var onSuccess = function(data)
    {
        console.log(data.data);
        var i;
        for(i=0;i<data.data.length;i++){
            deleteOrder(data.data[i]._id);
        }
    }

    var onFaliure = function()
    {
        alert("fail");
    }
    makeGetRequest("getOrders/5e8e4bcaa148b90044206526",onSuccess,onFaliure);
});

/*
    get the user information
*/
function getUserInfo() {
    var onSuccess = function(data) {
        if (data.status == true) {
            console.log("user information is here");
            console.log(data.data);
            var level = data.data.AccessLevel;
            if (level == "Submitter" || level == "Approver") {
                type = "subunit";
                unitID = data.data.SubUnitID;
            } else if (level == "Fiscal Staff" || level == "Fiscal Administrator") {
                type = "unit";
                unitID = data.data.UnitID;
            }
            user_name = data.data.userInfo.Name;
            user_uwid=data.data.userInfo.UWID;
            user_email=data.data.userInfo.email;
            user_subunitName=data.data.SubUnitName;
            user_accessLevel=data.data.AccessLevel;
        } else {
            //error message
        }
    }

    var onFailure = function() {
        // failure message
    }
    makeGetRequest("getuserInformation/" + user_id, onSuccess, onFailure);
}



/************************************************ END: Wizard step control *******************************************************/




/**************************************************** BEGIN: Form Control ********************************************************/

/***************** BEGIN: Step3 *******************/

/** 
 * Generate input group with prepend or append label
 * @param _id id for line item
 * @param _budget_id id for budget number in this line item
 * @param {boolean} isPre a mark to indicate need prepend label or append label
 * @param {string} label what's the label is (e.g. "$" or "%")
 * @param {string} name use to set the input id
 * The input group is unique for every budget number, 
 * so we use format split_{dollar-or-percent}_input_value_{line-item-id}_{budget-id} to set input id
 */
function inputGroup(_id, _budget_id, isPre, label, name) {
    var f = document.createElement('fieldset');
    var d = document.createElement('div');
    d.setAttribute('class', 'input-group');

    var sig = document.createElement('div');
    if (isPre) {
        sig.setAttribute('class', 'input-group-prepend');
    } else {
        sig.setAttribute('class', 'input-group-append');
    }
    var s = document.createElement('span');
    s.setAttribute('class', 'input-group-text');
    s.innerHTML = label;
    sig.appendChild(s);

    var i = document.createElement('input');
    i.setAttribute('class', 'form-control');
    i.setAttribute('type', 'text');
    i.setAttribute('id', 'split_' + name + '_input_value_' + _id + '_' + _budget_id);

    if (isPre) {
        d.appendChild(sig);
        d.appendChild(i);
    } else {
        d.appendChild(i);
        d.appendChild(sig);
    }

    f.appendChild(d);
    return f;

}

/** 
 * Generate task/option/project options behind each budget number 
 */
function addBudgetOptions(_id, _budget_id) {
    var row = document.createElement('div');
    row.setAttribute('class', 'form-group row');

    var first = document.createElement('div');
    first.setAttribute('class', 'col-md-1');
    first.appendChild(genOption(_id, _budget_id, "Task", "option_task"));

    var second = document.createElement('div');
    second.setAttribute('class', 'col-md-1');
    second.appendChild(genOption(_id, _budget_id, "Option", "option_option"));

    var third = document.createElement('div');
    third.setAttribute('class', 'col-md-1');
    third.appendChild(genOption(_id, _budget_id, "Project", "option_project"));
    
    row.appendChild(first);
    row.appendChild(genOptionInput("task_input", _id, _budget_id));
    row.appendChild(second);
    row.appendChild(genOptionInput("option_input", _id, _budget_id));
    row.appendChild(third);
    row.appendChild(genOptionInput("project_input", _id, _budget_id));

    return row;
}

/** 
 * Generate option of task/option/project 
 * @param _id id for line item
 * @param _budget_id id for budget number in this line item
 * @param {string} label the label for this options (Task/Option/Project)
 * @param {string} name use to set the name of this option
 * Each option group is bound to a single budget number
 */
function genOption(_id, _budget_id, label, name) {
    var list = document.createElement('ul');
    list.setAttribute('class', 'list-unstyled mb-0');
    var bullet = document.createElement('li');
    bullet.setAttribute('class', 'd-inline-block mr-2');
    var f = document.createElement('fieldset');
    var d = document.createElement('div');
    d.setAttribute('class', 'custom-control custom-checkbox');
    var i = document.createElement('input');
    i.setAttribute('type', 'checkbox');
    i.setAttribute('class', 'custom-control-input');
    i.setAttribute('name', name);
    i.setAttribute('id', name + _id + '_' + _budget_id);
    var l = document.createElement('label');
    l.setAttribute('class', 'custom-control-label');
    l.setAttribute('for', name + _id + '_' + _budget_id);
    l.innerHTML = label;
    d.appendChild(i);
    d.appendChild(l);
    f.appendChild(d);
    bullet.appendChild(f);
    list.appendChild(bullet);
    return list;
}

/** 
 * Generate the input box behind each task/option/project 
 * @param {string} name use to set the name of this input
 */
function genOptionInput(name, _id, _budget_id) {
    var div = document.createElement('div');
    div.setAttribute('class', 'col-md-3 hidden');
    div.setAttribute('id', name + _id + '_' + _budget_id);
    var i = document.createElement('input');
    i.setAttribute('type', 'text');
    i.setAttribute('class', 'form-control');
    i.setAttribute('name', name);
    return div;
}

/** 
 * Split with amount or percentage controller
 * Use to transfer between split with amount or percentage
 * Each split select box and input value is bound to a single budget number,
 * so we use split_with_{line-item-id}_{budget-id} to set select box id
 * use split_input_with_{line-item-id}_{budget-id} to set user input id
 */
function splitWithChanged(_id, _budget_id) {
    var sel = document.getElementById('split_with_' + _id + '_' + _budget_id);
    var pick = sel.options[sel.selectedIndex].value;
    var dollar = document.getElementById('split_dollar_input_' + _id + '_' + _budget_id);
    var perc = document.getElementById('split_percent_input_' + _id + '_' + _budget_id);
    if (pick == "amount") {
        dollar.setAttribute('class', 'col-md-2 visible');
        perc.setAttribute('class', 'col-md-2 hidden');
    } else if (pick == "percentage") {
        dollar.setAttribute('class', 'col-md-2 hidden');
        perc.setAttribute('class', 'col-md-2 visible');
    }
}

/** 
 * Bind to the initialized select box 
 */
$(document).on('click', '#split_with_1_1', function(){
    splitWithChanged(1, 1);
});
$(document).on('click', '#split_with_2_2', function(){
    splitWithChanged(2, 2);
});

function getBudgetsInfo() {
    var onSuccess = function(data) {
        if (data.status == true) {
            // console.log("budgets information is here");
            // console.log(data.data);
            for (var i = 0; i < data.data.length; i++) {
                budgets_database.push(data.data[i].budgetNumber);
            }
        } else {
            //error message
        }
    }
    var onFailure = function() {
        // failure message
    }
    makeGetRequest("getBudgetsUnderSubUnit/" + unitID, onSuccess, onFailure);
}

function addBudgetData(num) {
    var op = document.createElement('option');
    if (num == "0") {
        op.setAttribute('value', '');
        op.innerHTML = "Please select"
    } else {
        op.setAttribute('value', num);
        op.innerHTML = num;
    }
    return op;
}

$(document).on('click', '#budget-info-1-1-1', function() {
    if ($("#budget-info-1-1-1").is(":checked")) {
        $('#budget-info-input-1-1-1').attr('class', 'col-md-3 visible');
    } else {
        $('#budget-info-input-1-1-1').attr('class', 'col-md-3 hidden');
    }
});

$(document).on('click', '#budget-info-1-1-2', function() {
    if ($("#budget-info-1-1-2").is(":checked")) {
        $('#budget-info-input-1-1-2').attr('class', 'col-md-3 visible');
    } else {
        $('#budget-info-input-1-1-2').attr('class', 'col-md-3 hidden');
    }
});

$(document).on('click', '#budget-info-1-1-3', function() {
    if ($("#budget-info-1-1-3").is(":checked")) {
        $('#budget-info-input-1-1-3').attr('class', 'col-md-3 visible');
    } else {
        $('#budget-info-input-1-1-3').attr('class', 'col-md-3 hidden');
    }
});

$(document).on('click', '#budget-info-2-1-1', function() {
    if ($("#budget-info-2-1-1").is(":checked")) {
        $('#budget-info-input-2-1-1').attr('class', 'col-md-3 visible');
    } else {
        $('#budget-info-input-2-1-1').attr('class', 'col-md-3 hidden');
    }
});

$(document).on('click', '#budget-info-2-1-2', function() {
    if ($("#budget-info-2-1-2").is(":checked")) {
        $('#budget-info-input-2-1-2').attr('class', 'col-md-3 visible');
    } else {
        $('#budget-info-input-2-1-2').attr('class', 'col-md-3 hidden');
    }
});

$(document).on('click', '#budget-info-2-1-3', function() {
    if ($("#budget-info-2-1-3").is(":checked")) {
        $('#budget-info-input-2-1-3').attr('class', 'col-md-3 visible');
    } else {
        $('#budget-info-input-2-1-3').attr('class', 'col-md-3 hidden');
    }
});

function sendRequestHistory(request_id, actionstr) {
    var history = {
        userName: window.sessionStorage.getItem("id"),
        action: actionstr
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
    makePostRequest("updateOrderHistory/" + request_id, history, onSuccess, onFailure);
}

























