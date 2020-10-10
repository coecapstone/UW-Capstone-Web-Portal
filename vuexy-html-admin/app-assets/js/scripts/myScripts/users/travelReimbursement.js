var itemNum = 1;
var lineItems = [];
var table1 = [];
var table2 = [];
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
    this.getUserInfo();
    this.getBudgetsInfo();
    var budget_select = this.document.getElementById('budget_num_1');
    var budget_select2 = this.document.getElementById('budget_num_2');
    for (var i = 0; i < this.budgets_database.length; i++) {
        var num = budgets_database[i];
        budget_select.appendChild(addBudgetData(num));
        budget_select2.appendChild(addBudgetData(num));
    }
};

/*
    submit the form
*/
$(document).on('click', '#confirm_item', function uploadFiles_without_HTML_FORMS() {
        //***************** check the input validation *****************************/
        if($("input[name='beforeRadio']:checked").val()!="yes" && $("input[name='beforeRadio']:checked").val()!="no"){
            alert("Please fill out \"Have you been reimbursed before this trip?\".");
            document.getElementById("warning").innerHTML="Please fill out all * field.";
            return false;
        } 
        if($("input[name='myself']:checked").val()!="yes" && $("input[name='myself']:checked").val()!="no"){
            alert("Please fill out \"I am requesting travel reimbursement for myself\".");
            document.getElementById("warning").innerHTML="Please fill out all * field.";
            return false;
        } 
        if($("input[name='myself']:checked").val()=="no"){
            if(document.getElementById("someone_name").value==""){
                alert("Please fill out the Someone's name field.");
                document.getElementById("warning").innerHTML="Please fill out all * field.";
                return false;
            }else if(document.getElementById("someone_affliation").value==""){
                alert("Please fill out the Someone's affliation field.");
                document.getElementById("warning").innerHTML="Please fill out all * field.";
                return false;
            }else if(document.getElementById("someone_email").value==""){
                alert("Please fill out the Someone's email field.");
                document.getElementById("warning").innerHTML="Please fill out all * field.";
                return false;
            }
        }
        if($("input[name='submit_date']:checked").val()==""){
            alert("Please fill out Date Submitted field");
            document.getElementById("warning").innerHTML="Please fill out all * field.";
            return false;
        } 
        if($("input[name='US_Radio']:checked").val()!="yes" && $("input[name='US_Radio']:checked").val()!="no"){
            alert("Please fill out \"US Citizen or Permanent Resident?\".");
            document.getElementById("warning").innerHTML="Please fill out all * field.";
            return false;
        } 
        if($("input[name='US_Radio']:checked").val()=="no"){
            if( !document.getElementById("passport").value){
                alert("Please include the passport file.");
                document.getElementById("warning").innerHTML="Please fill out all * field.";
                return false;
            }
            if( !document.getElementById("visa").value){
                alert("Please include the visa file.");
                document.getElementById("warning").innerHTML="Please fill out all * field.";
                return false;
            }
        }
        if(document.getElementById("purpose").value==""){
            alert("Please fill out the Purpose of Travel field.");
            document.getElementById("warning").innerHTML="Please fill out all * field.";
            return false;
        }
        if($("input[name='personalTravel_Radio']:checked").val()!="yes" && $("input[name='personalTravel_Radio']:checked").val()!="no"){
            alert("Please fill out \"Was personal travel included?\".");
            document.getElementById("warning").innerHTML="Please fill out all * field.";
            return false;
        } 
        if($("input[name='personalTravel_Radio']:checked").val()=="yes"){
            if( document.getElementById("personalTravel_detail").value==""){
                alert("Please fill out the personal travel details field.");
                document.getElementById("warning").innerHTML="Please fill out all * field.";
                return false;
            }
        }
        //***************** check the input validation end*****************************/

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
        //---------------------------------------------------------------------------------------------------------------------------------
       
        alert("Submitted!");
        alert('send data to database');
        getUserInfo();
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
        //--------------- Second Budget -------------------------------------------------
        //alert(split_with_1_1("budget_num_2").value);
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

        //* meal per dim table */
        var i;
        var c1=$("input[name='colNum1']").val();
        for(i=1;i<=c1;i++){
            var dateId = "1meal_date";
            dateId+=i;
            var breakfastId =  "1breakfast";
            breakfastId+=i;
            var lunchId =  "1lunch";
            lunchId+=i;
            var dinnerId =  "1dinner";
            dinnerId+=i;
            table1.push({
                Date: document.getElementById(dateId).value,
                Breakfast: document.getElementById(breakfastId).checked,
                Lunch:  document.getElementById(lunchId).checked,
                Dinner:  document.getElementById(dinnerId).checked
            });
        }

        var c2=$("input[name='colNum2']").val();
        for(i=1;i<=c2;i++){
            var dateId = "2meal_date";
            dateId+=i;
            var breakfastId =  "2breakfast";
            breakfastId+=i;
            var lunchId =  "2lunch";
            lunchId+=i;
            var dinnerId =  "2dinner";
            dinnerId+=i;
            table2.push({
                Date: document.getElementById(dateId).value,
                Breakfast: document.getElementById(breakfastId).checked,
                Lunch:  document.getElementById(lunchId).checked,
                Dinner:  document.getElementById(dinnerId).checked
            });
        }
        //* meal per dim table end*/

         //-------------------------files -----------------------------------
        var visa_name;
        var passport_name;
        var airfare_name;
        var train_name;
        var rental_name;
        var hotel_name;
        var car_name;
        var registration_name;
        // ******************** save the attached files ************************
        var fileSelect = document.getElementById("passport");
        for(var x = 0; x < fileSelect.files.length; x++) {
            formData.append(fileSelect.files[x].name, fileSelect.files[x]);
            passport_name=fileSelect.files[x].name;
        }
        fileSelect = document.getElementById("visa");
        for(var x = 0; x < fileSelect.files.length; x++) {
            formData.append(fileSelect.files[x].name, fileSelect.files[x]);
            visa_name=fileSelect.files[x].name;
        }
        fileSelect = document.getElementById("airfare_receipt");
        for(var x = 0; x < fileSelect.files.length; x++) {
            formData.append(fileSelect.files[x].name, fileSelect.files[x]);
            airfare_name=fileSelect.files[x].name;
        }
        fileSelect = document.getElementById("trainReceipt");
        for(var x = 0; x < fileSelect.files.length; x++) {
            formData.append(fileSelect.files[x].name, fileSelect.files[x]);
            train_name=fileSelect.files[x].name;
        }
        fileSelect = document.getElementById("rentalReceipt");
        for(var x = 0; x < fileSelect.files.length; x++) {
            formData.append(fileSelect.files[x].name, fileSelect.files[x]);
            rental_name=fileSelect.files[x].name;
        }
        fileSelect = document.getElementById("hotelReceipt");
        for(var x = 0; x < fileSelect.files.length; x++) {
            formData.append(fileSelect.files[x].name, fileSelect.files[x]);
            hotel_name=fileSelect.files[x].name;
        }
        fileSelect = document.getElementById("registration_receipt");
        for(var x = 0; x < fileSelect.files.length; x++) {
            formData.append(fileSelect.files[x].name, fileSelect.files[x]);
            registration_name=fileSelect.files[x].name;
        }
        fileSelect = document.getElementById("car_receipt");
        for(var x = 0; x < fileSelect.files.length; x++) {
            formData.append(fileSelect.files[x].name, fileSelect.files[x]);
            car_name=fileSelect.files[x].name;
        }
        
        formData.append("files", fileSelect.files[x]);
        // ******************** save the attached files end************************
        //---------------------------------------------------------------------
        
        //-------------------------Amount--------------------------------------
        var amount=0;
        var registrationAmount=0;
        var airfareAmount=0;
        var carAmount=0;
        var trainAmount=0;
        var carRentalAmount=0;
        var hotelAmount=0;
        if($("input[name='registration']").val().length!=0){
            registrationAmount=parseInt($("input[name='registration']").val());
        }
        if($("input[name='airfare']").val().length!=0){
            airfareAmount=parseInt($("input[name='airfare']").val());
        }
        if($("input[name='car']").val().length!=0){
            carAmount=parseInt($("input[name='car']").val());
        }
        if($("input[name='train']").val().length!=0){
            trainAmount=parseInt($("input[name='train']").val());
        }
        if($("input[name='carRental']").val().length!=0){
            carRentalAmount=parseInt($("input[name='carRental']").val());
        }
        if($("input[name='hotel']").val().length!=0){
            hotelAmount=parseInt($("input[name='hotel']").val());
        }
        amount = registrationAmount + airfareAmount + carRentalAmount + carAmount + trainAmount + hotelAmount;
        //--------------------------Amount end----------------------------------------------
        var requestInfo = {
            TravelBefore: $("input[name='beforeRadio']:checked").val(),
            ReferenceNumber: $("input[name='reference_number_input']").val(),
            ForMyself: $("input[name='myself']").val(),
            SomeoneName: $("input[name='someone_name']").val(),
            SomeoneAffliation: $("input[name='someone_affliation']").val(),
            SomeoneEmail: $("input[name='someone_email']").val(),
            SubmitDate: $("input[name='submit_date']").val(),
            UScitizen: $("input[name='US_Radio']:checked").val(),
            Purpose: $("input[name='purpose']").val(),
            Registration: $("input[name='registration']").val(),
            PersonalTravel: $("input[name='personalTravel_Radio']:checked").val(),
            PersonalTravelDetail: $("input[name='personalTravel_detail']").val(),
            AirFare: $("input[name='airfare']").val(),
            Car: $("input[name='car']").val(),
            Train: $("input[name='train']").val(),
            CarRental: $("input[name='carRental']").val(),
            HotelFee: $("input[name='hotel']").val(),
            Meal: $("input[name='meal_Radio']:checked").val(),

            MealProvided: $("input[name='meal2_Radio']:checked").val(),
            Visa_file: visa_name,
            Passport_file: passport_name,
            Airfare_file: airfare_name,
            Train_file: train_name,
            Rental_file: rental_name,
            Hotel_file: hotel_name,
            Registration_file: registration_name,
            Car_file: car_name,
            amount: amount,
            Col1: $("input[name='colNum1']").val(),
            Col2: $("input[name='colNum2']").val(),
            Meal_amount: $("input[name='meal_amount']").val(),
            Meal_table1: table1,
            Meal_table2: table2,
            NoteFromApprover: "",
            LineItems: lineItems
        }

        //now lets set up the JSON_toServer JSON Object
        JSON_toServer.userID_ref = user_id;  // 5e63127145f8e019d1f26ddc
        JSON_toServer.OrderType = "Travel Reimbursement";
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
                sendRequestHistory(data_obj._id, "Submitted");
                console.log(requestInfo_obj);
                // transfer data and direct to summary-travelReimbursement.html
                window.sessionStorage.setItem('orderId',data_obj._id);
                window.sessionStorage.setItem('user_id',user_id);
                window.sessionStorage.setItem('user_name',user_name);
                window.sessionStorage.setItem('user_uwid',user_uwid);
                window.sessionStorage.setItem('user_email',user_email);
                window.sessionStorage.setItem('user_subunitName',user_subunitName);
                window.sessionStorage.setItem('user_AccessLevel',user_accessLevel);
                window.sessionStorage.setItem('type',"Travel Reimbursement");
                window.sessionStorage.setItem('submit_date',$("input[name='submit_date']").val());
                window.sessionStorage.setItem('status',"Awaiting Approval");
                window.sessionStorage.setItem('note',"");
                window.sessionStorage.setItem('budget1',budget1);
                window.sessionStorage.setItem('split1',split1);
                window.sessionStorage.setItem('budget_length',budgetsArr.length);
                window.sessionStorage.setItem('budget2',budget2);
                window.sessionStorage.setItem('split2',split2);
                window.sessionStorage.setItem('TravelBefore',$("input[name='beforeRadio']:checked").val());
                window.sessionStorage.setItem('ReferenceNumber',$("input[name='reference_number_input']").val());
                window.sessionStorage.setItem('ForMyself',$("input[name='myself']").val());
                window.sessionStorage.setItem('SomeoneName',$("input[name='someone_name']").val());
                window.sessionStorage.setItem('SomeoneAffliation',$("input[name='someone_affliation']").val());
                window.sessionStorage.setItem('SomeoneEmail',$("input[name='someone_email']").val());
                window.sessionStorage.setItem('US',$("input[name='US_Radio']:checked").val());
                window.sessionStorage.setItem('purpose',$("input[name='purpose']").val());
                window.sessionStorage.setItem('personalTravel',$("input[name='personalTravel_Radio']:checked").val());
                window.sessionStorage.setItem('personalTravelDetails',$("input[name='personalTravel_detail']").val());
                window.sessionStorage.setItem('registration',$("input[name='registration']").val());
                window.sessionStorage.setItem('airfare',$("input[name='airfare']").val());
                window.sessionStorage.setItem('car',$("input[name='car']").val());
                window.sessionStorage.setItem('train',$("input[name='train']").val());
                window.sessionStorage.setItem('carRental',$("input[name='carRental']").val());
                window.sessionStorage.setItem('hotelFee',$("input[name='hotel']").val());
                window.sessionStorage.setItem('visa_file',visa_name);
                window.sessionStorage.setItem('passport_file',passport_name);
                window.sessionStorage.setItem('airfare_file',airfare_name);
                window.sessionStorage.setItem('train_file',train_name);
                window.sessionStorage.setItem('rental_file',rental_name);
                window.sessionStorage.setItem('hotel_file',hotel_name);
                window.sessionStorage.setItem('meal',$("input[name='meal_Radio']:checked").val());
                window.sessionStorage.setItem('meal_amount',$("input[name='meal_amount']").val());
                window.sessionStorage.setItem('mealProvided',$("input[name='meal2_Radio']:checked").val());
                window.sessionStorage.setItem('registration_file',registration_name);
                window.sessionStorage.setItem('car_file',car_name);
                window.sessionStorage.setItem('amount',amount);
                window.location.href = "summary-travelReimbursement.html";
            }
        }
        request.open('POST', baseURL + "uploadOrder/" + type + "/" + unitID);
        request.send(formData);
        return true;
        // window.location.href = "../../../html/ltr/users/user-summary.html";
        // window.location.replace("../../../html/ltr/users/user-summary.html");
});

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
 * Deprecated
 * Previous options controller
 */
$(document).on('click', '#option_task', function() {
    if ($("#option_task").is(":checked")) {
        $('#task_checked').attr('class', 'col-md-3 visible');
    } else {
        $('#task_checked').attr('class', 'col-md-3 hidden');
    }
});

$(document).on('click', '#option_option', function() {
    if ($("#option_option").is(":checked")) {
        $('#option_checked').attr('class', 'col-md-3 visible');
    } else {
        $('#option_checked').attr('class', 'col-md-3 hidden');
    }
});

$(document).on('click', '#option_project', function() {
    if ($("#option_project").is(":checked")) {
        $('#project_checked').attr('class', 'col-md-3 visible');
    } else {
        $('#project_checked').attr('class', 'col-md-3 hidden');
    }
});

/** END: Budgets Controller */

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
/** END: Summary Table Display Controller */





