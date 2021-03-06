var itemNum = 1;
var lineItems = [];
var table1 = [];
var table2 = [];
var formData = new FormData();
var type = "";
var user_id = EngineUI.getId();
var user_name="";
var user_uwid="";
var user_email="";
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

addLoadEvent(function() {
    this.getUserAndBudgetInfo();
    var budget_select = this.document.getElementById('budget_num_1');
    var budget_select2 = this.document.getElementById('budget_num_2');
    for (var i = 0; i < this.budgets_database.length; i++) {
        var num = budgets_database[i];
        budget_select.appendChild(addBudgetData(num));
        budget_select2.appendChild(addBudgetData(num));
    }
});

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
       
        getUserAndBudgetInfo();
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
        JSON_toServer.OrderType = EngineUI.ORDER_TYPE_TRAVEL_REIMBURSEMENT;
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
            if (request.readyState == 4 /* XMLHttpRequest.DONE */) {
                console.log(request.response);
                // show it in the console
                const response_obj = JSON.parse(request.response);
                const data_obj = response_obj.data;
                //convert order info to JSON
                const requestInfo_obj = JSON.parse(data_obj.OrderInfo);
                sendRequestHistory(data_obj._id, "Submitted");
                console.log(requestInfo_obj);
                // transfer data and direct to summary-travelReimbursement.html
                EngineUI.setOrderId(data_obj._id);
                EngineUI.setRequestType(EngineUI.ORDER_TYPE_TRAVEL_REIMBURSEMENT);
                EngineUI.setSubmit_date($("input[name='submit_date']").val());
                EngineUI.setStatus("Awaiting Approval");
                EngineUI.setNote("");
                EngineUI.setBudget1(budget1);
                EngineUI.setSplit1(split1);
                EngineUI.setBudget_length(budgetsArr.length);
                EngineUI.setBudget2(budget2);
                EngineUI.setSplit2(split2);
                EngineUI.setTravelBefore($("input[name='beforeRadio']:checked").val());
                EngineUI.setReferenceNumber($("input[name='reference_number_input']").val());
                EngineUI.setForMyself($("input[name='myself']").val());
                EngineUI.setSomeoneName($("input[name='someone_name']").val());
                EngineUI.setSomeoneAffliation($("input[name='someone_affliation']").val());
                EngineUI.setSomeoneEmail($("input[name='someone_email']").val());
                EngineUI.setUS($("input[name='US_Radio']:checked").val());
                EngineUI.setPurpose($("input[name='purpose']").val());
                EngineUI.setPersonalTravel($("input[name='personalTravel_Radio']:checked").val());
                EngineUI.setPersonalTravelDetails($("input[name='personalTravel_detail']").val());
                EngineUI.setRegistration($("input[name='registration']").val());
                EngineUI.setAirfare($("input[name='airfare']").val());
                EngineUI.setCar($("input[name='car']").val());
                EngineUI.setTrain($("input[name='train']").val());
                EngineUI.setCarRental($("input[name='carRental']").val());
                EngineUI.setHotelFee($("input[name='hotel']").val());
                EngineUI.setVisa_file(visa_name);
                EngineUI.setPassport_file(passport_name);
                EngineUI.setAirfare_file(airfare_name);
                EngineUI.setTrain_file(train_name);
                EngineUI.setRental_file(rental_name);
                EngineUI.setHotel_file(hotel_name);
                EngineUI.setMeal($("input[name='meal_Radio']:checked").val());
                EngineUI.setMeal_amount($("input[name='meal_amount']").val());
                EngineUI.setMealProvided($("input[name='meal2_Radio']:checked").val());
                EngineUI.setRegistration_file(registration_name);
                EngineUI.setCar_file(car_name);
                EngineUI.setAmount(amount);
                window.location.href = "summary-travelReimbursement.html";
            }
        }
	if (!EngineUI.getSubunitID()) {
	    alert("SubunitID is undefined, don't expect this to work!");
	}
	// XXX This line assumes that requests are always made at the submit level.
        request.open('POST', baseURL + "uploadOrder/subunit/" + EngineUI.getSubunitID()); // XXX always subunit requests?
        request.send(formData);
        return true;
        // window.location.href = "../../../html/ltr/users/user-summary.html";
        // window.location.replace("../../../html/ltr/users/user-summary.html");
});

/*
 * The data struture returned by /api/getUserInfoAndBudgets/:_userID
 * looks like this:
 *
 * "user": {
 *    "verified_user": false,
 *    "_id": "5f8732937fc57b003520909b",
 *    "Name": "Konrad",
 *    "email": "perseant@uw.edu",
 *    "UWID": "perseant",
 *    "profileImage_URL": "",
 *    "address": null,
 *    "__v": 0
 *  },
 *  "units": {
 *    "5e8e4a7ea148b90044206522": {
 *      "name": "test mar11"
 *    }
 *  },
 *  "roles": [
 *    {
 *      "type": "unit",
 *      "unit": "5e8e4a7ea148b90044206522",
 *      "role": "Financial Administrator"
 *    }
 *  ],
 *  "subunits": [
 *    {
 *      "_id": "5ea9bf22c389960044c3ae4d",
 *      "subUnitName": "Civil and Environmental Engineering",
 *      "UnitID_ref": "5e8e4a7ea148b90044206522"
 *    }
 *  ],
 *  "submitter_budgets": [
 *    {
 *      "budgetNumber": "63-6238",
 *      "budgetName": "VALLE-HENRIK/ELLEN END",
 *      "startDate": "3 March, 1980",
 *      "endDate": "",
 *      "approvers": [],
 *      "approvalLogic": ""
 *    },
 *   ...
 */
function getUserAndBudgetInfo() {
    var onSuccess = function(data) {
        if (data.status == true) {
            console.log("user information is here");
            console.log(data.data);
            
            type = "subunit";
            user_name = data.data.user.Name;
            user_uwid=data.data.user.UWID;
            user_email=data.data.user.email;
            // XXX what if I have more than one?
            // XXX Maybe this selection should be stored at login time?
            user_accessLevel="Submitter";

            for (var i = 0; i < data.data.submitter_budgets.length; i++) {
                budgets_database.push(data.data.submitter_budgets[i].budgetNumber);
            }
        } else {
            //error message
            console.log("user information status failure");
            console.log(data);
        }
    }

    var onFailure = function() {
        // failure message
        console.log("user information FAILED");
    }

    console.log("requesting user and budget information for user_id=" + user_id);
    makeGetRequest("getUserInfoAndBudgets", onSuccess, onFailure);
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
        userName: EngineUI.getId(),
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





