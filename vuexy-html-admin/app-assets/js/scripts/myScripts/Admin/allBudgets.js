//table variable
var allBudgets_table = null;
var uploaded_budgets_table = null;
//table dody
var allBudgets_table_body = document.getElementById("allBudgets_table_body");
var uploaded_budgets_table_body = document.getElementById("uploaded_budgets_table_body");
//keep track of selected row in allbudgets table
var selected_row = -1;

var budgetNumber_field = document.getElementById("budgetNumber");
var startDate_field = document.getElementById("startDate");
var BudgetName_field = document.getElementById("BudgetName");
var endDate_field = document.getElementById("endDate");

//buttons
var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");
var removeBtn = document.getElementById("removeBtn");
var modal_file_choose_btn = document.getElementById("modal_file_choose_btn");
var modal_file_upload_btn = document.getElementById("modal_file_upload_btn");

//error fields
var budgetNumberErrorField = document.getElementById("budgetNumberErrorField");
var budgetNameErrorField = document.getElementById("budgetNameErrorField");

//modal sections 
var modal_instructions_part = document.getElementById("modal_instructions_part");
var modal_uploading_part = document.getElementById("modal_uploading_part");
var modal_results_part = document.getElementById("modal_results_part");
var modal_close_btn = document.getElementById("modal_close_btn");

window.onload = function()
{
    
    initialize_table();
    update_allBudgets_table();
    initialize_uploaded_budgets_table();
    add_btn_hide_unhide();
    update_btn_hide_unhide();
    remove_btn_hide_unhide();
    modal_file_upload_btn.disabled = true;
}

//onlick event for staff overview table
$('#allBudgets_table tbody').on( 'click', 'tr', function () {
    //table row highlight code
    if ( $(this).hasClass('selected') ) 
    {
        $(this).removeClass('selected');
        selected_row = -1;
    }
    else 
    {
        allBudgets_table.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        selected_row = allBudgets_table.row( this ).index();
        
    }

    fill_form_information();

    add_btn_hide_unhide();
    update_btn_hide_unhide();
    remove_btn_hide_unhide();

} );


function fill_form_information()
{
    if(selected_row > -1)
    {
        const row_info = allBudgets_table.row( selected_row ).data();
        budgetNumber_field.value = row_info[1];
        BudgetName_field.value = row_info[2];
        startDate_field.value = row_info[3];
        endDate_field.value = row_info[4];

    }else
    {
        clearInformation();
    }
}

function update_allBudgets_table()
{
    
    const results = (get_all_budgets_under_Unit()).data;
    if(results)
    {
        allBudgets_table.clear().destroy();
        for(var x=0;x<results.length;x++)
            allBudgets_table_body.appendChild(prepare_all_budget_table_rows(results[x]._id,results[x].BudgetNumber,results[x].BudgetName,results[x].StartDate,results[x].EndDate));
        
        initialize_table();    
    }
}


function clearBtn_logic()
{
    clearInformation();
}

function allBudgetAdd()
{
    if(validate_input_fields())
        return;

    var startDate = null;
    if(startDate_field.value == "" || startDate_field.value == null)
        startDate = null;
    else
        startDate = startDate_field.value;

    var endDate = null;
    if(endDate_field.value == "" || endDate_field.value == null)
        endDate = null;
    else
        endDate = endDate_field.value;

    var JSON_Obj = {
        "BudgetNumber": budgetNumber_field.value,
        "BudgetName": BudgetName_field.value,
        "StartDate": startDate,
        "EndDate": endDate
    }


    const results = add_new_budget(JSON_Obj);
    console.log(results);
    if(results)
    {
        update_allBudgets_table();
        clearInformation();
        toastr.success("Budget "+JSON_Obj.BudgetNumber +' successfully added to '+window.sessionStorage.getItem('unitName'), 'Success', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });

    }
        
}

function allBudgetRemove()
{
    if(selected_row > -1)
    {
        const BudgetID = allBudgets_table.row( selected_row ).data()[0];
        const BudgetNumber = allBudgets_table.row( selected_row ).data()[1];
        
        if(remove_budget_from_allBudgets(BudgetID))
        {

            toastr.success(`Budget: ${BudgetNumber} successfully removed from ${window.sessionStorage.getItem("unitName")} unit`, 'Success', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            update_allBudgets_table();
            clearInformation();
            

        }

    }else
    {
        toastr.warning('Select a budget to delete', 'Warning', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
    }
}


function allBudgetUpdate()
{
    if(selected_row > -1)
    {
        var JSON_Obj = {
            "BudgetNumber": budgetNumber_field.value,
            "BudgetName": BudgetName_field.value,
            "StartDate": startDate_field.value,
            "EndDate": endDate_field.value
        }

        const BudgetID = allBudgets_table.row( selected_row ).data()[0];
        const BudgetNumber = allBudgets_table.row( selected_row ).data()[1];
        
        if(update_budget_given_budgetID(BudgetID,JSON_Obj))
        {

            toastr.success(`Budget: ${BudgetNumber} successfully updated`, 'Success', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            update_allBudgets_table();
            clearInformation();

        }else
            toastr.error('Internal Server Error occured, while updating the budget. Plase try again ', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' }); 

    }else
    {
        toastr.warning('Select a budget to update', 'Warning', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
    }
}

function modal_file_upload_btn_logic()
{
    //once upload button is pressed hide the instructions and unhide waiting for server response
    modal_instructions_part.style.display = "none";
    modal_uploading_part.style.display = "block";
    modal_results_part.style.display = "none;"
    //once upload is pressed disable upload and close buttons, but keep upload locked all the time
    modal_file_upload_btn.disabled = true;

    var formData = new FormData();

    var fileSelect = document.getElementById("modal_file_choose_btn");
    if(fileSelect.files && fileSelect.files.length == 1){
     var file = fileSelect.files[0]
     formData.set("files", file , file.name);
    }

    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (request.readyState == request.DONE) {
            const JSON_response = JSON.parse(request.responseText)
            if(JSON_response.status)
            {
                //hide all except for results part
                modal_instructions_part.style.display = "none";
                modal_uploading_part.style.display = "none";
                modal_results_part.style.display = "block"

                uploaded_budgets_table.clear().destroy();
                
                for(var x=0; x<JSON_response.data.errors.length;x++)
                    uploaded_budgets_table_body.appendChild(prepare_modal_result_table_rows(JSON_response.data.errors[x].BudgetNumber,JSON_response.data.errors[x].Info,true));
                
                for(var x=0; x<JSON_response.data.success.length;x++)
                    uploaded_budgets_table_body.appendChild(prepare_modal_result_table_rows(JSON_response.data.success[x].BudgetNumber,JSON_response.data.success[x].Info,false));

                initialize_uploaded_budgets_table();

                //and finally update the main table
                update_allBudgets_table();


            }else
            {
                toastr.error(JSON_response.data, 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            }
            //console.log(request.responseText);
        }

    }
    request.open('PUT', baseURL+"allBudgets/uploadExcelFile/"+window.sessionStorage.getItem("unitID"));
    request.send(formData);
}

function modal_file_choose_btn_logic()
{
    var fileSelect = document.getElementById("modal_file_choose_btn");
    if(fileSelect.files && fileSelect.files.length == 1)
    {
        modal_file_upload_btn.disabled = false;
    }else
    {
        modal_file_upload_btn.disabled = true;
    }
}

function modal_close_btn_logic()
{
    setTimeout(function(){
    //and set everything back to normal in the modal
    modal_instructions_part.style.display = "block";
    modal_uploading_part.style.display = "none";
    modal_results_part.style.display = "none"
    //and clear the error table and reinitialize it
    uploaded_budgets_table.clear().destroy();
    initialize_uploaded_budgets_table();    
    modal_file_upload_btn.disabled = false;
    },500);

}



//------------------------------ Helper Functions ---------------------------------------------

function prepare_modal_result_table_rows(BudgetNumber,Info,isError) //isError --> True = Red , else no color
{
    var td_budgetNumber = document.createElement('td');
    td_budgetNumber.innerHTML = BudgetNumber;

    var td_Info = document.createElement('td');
    if(isError)
        td_Info.setAttribute('style','color:#e74c3c');
    else
        td_Info.setAttribute('style','color:#2ecc71');
    //creating error rows
    for(var x=0;x<Info.length;x++)
        td_Info.innerHTML = Info[x] +"\n";
    
    //tr element
    var tr = document.createElement('tr');
    tr.appendChild(td_budgetNumber);
    tr.appendChild(td_Info);

    console.log(tr);
    return tr;
}

function validate_input_fields()
{
    String.prototype.isNumber = function(){return /^\d+$/.test(this);}
    var errorFound = false;
    
    if(BudgetName_field.value == "" || BudgetName_field.value == null)
    {
        budgetNameErrorField.innerHTML = "* Budget Name required";
        errorFound = true;
    }        
    else
        budgetNameErrorField.innerHTML = "";
    
        

    if(budgetNumber_field.value == "" || budgetNumber_field.value == null)
    {
        budgetNumberErrorField.innerHTML = "* Budget Number required";
        errorFound = true;
    }else
        budgetNumberErrorField.innerHTML = "";    

    return errorFound;
}

function add_btn_hide_unhide()
{
    if(selected_row > -1)
    {
        const row_info = allBudgets_table.row( selected_row ).data();

        if(row_info[1] == budgetNumber_field.value)
         addBtn.disabled = true;
        else
         addBtn.disabled = false;
    }else
        addBtn.disabled = false; 
}

function update_btn_hide_unhide()
{
    const row_info = allBudgets_table.row( selected_row ).data();

    if(selected_row > -1)
    {
       
        if(row_info[1] == budgetNumber_field.value && row_info[2] == BudgetName_field.value && row_info[3] == startDate_field.value && row_info[4] == endDate_field.value)
            updateBtn.disabled = true;
        else
            updateBtn.disabled = false;  
    
    }else
        updateBtn.disabled = true;
}


function remove_btn_hide_unhide()
{
    if(selected_row > -1)
        removeBtn.disabled = false;
    else
        removeBtn.disabled = true;
}

function clearInformation()
{
    budgetNumber_field.value = "";
    BudgetName_field.value = "";
    startDate_field.value = "";
    endDate_field.value = "";

    allBudgets_table.rows('.selected').nodes().to$().removeClass( 'selected' );
    selected_row = -1;

    budgetNumberErrorField.innerHTML = "";
    budgetNameErrorField.innerHTML = "";

    add_btn_hide_unhide();
    update_btn_hide_unhide();
    remove_btn_hide_unhide();
}

function initialize_table()
{
    allBudgets_table = $('#allBudgets_table').DataTable(  {
        "columnDefs": [
            {
                "targets": [ 0 ],
                "visible": false,
                "searchable": false
            }
        ],
        "lengthMenu": [[5, 10, 20, -1], [5, 10, 20, "All"]]
    });
}


function initialize_uploaded_budgets_table()
{
    uploaded_budgets_table = $('#uploaded_budgets_table').DataTable(  {

        "lengthMenu": [[5, 10, 20, -1], [5, 10, 20, "All"]]
    });
}


function get_all_budgets_under_Unit()
{
    var return_val = null;
    var onSuccess = function(data)
    {
        if(data.status)
            return_val = data;
        else
        {
            return_val = null;
            toastr.error(data.data, 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        }
        
    }

    //this function will be called when data exchange with backend occured an error
    var onFaliure = function()
    {
        toastr.error('Backend error occured while updating the table', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        return_val = null;
    }
    

    makeGetRequest("allBudgets/"+window.sessionStorage.getItem("unitID"),onSuccess,onFaliure);

    return return_val;
}

function add_new_budget(JSON_data)
{
    var return_value = null;
    var onSuccess = function(data)
    {
        if(data.status == false)
        {
            toastr.error(data.data, 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            return_value =  null;
        }else
        {
            return_value =  true;
        }

    }

    //this function will be called when data exchange with backend occured an error
    var onFaliure = function()
    {
        toastr.error('Internal server error has occured. Please try again', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        return_value =  null;
    }

    makePostRequest("allBudgets/"+window.sessionStorage.getItem("unitID"),JSON_data,onSuccess,onFaliure);

    return return_value;
}

function remove_budget_from_allBudgets(BudgetID)
{
    var return_value = false;
    var onSuccess = function(data)
    {
        if(data.status == false)
        {
            toastr.error(data.data, 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            return_value =  false;
        }else
        {
            return_value =  true;
        }

    }

    //this function will be called when data exchange with backend occured an error
    var onFaliure = function()
    {
        toastr.error('Internal server error has occured. Please try again', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        return_value =  false;
    }

    makeDeleteRequest("allBudgets/"+window.sessionStorage.getItem("unitID")+"/"+BudgetID,onSuccess,onFaliure);

    return return_value;
}


function update_budget_given_budgetID(budgetID,JSON_data)
{
    var return_value = null;
    var onSuccess = function(data)
    {
        if(data.status == false)
        {
            return_value =  null;
        }else
        {
            return_value =  true;
        }

    }

    //this function will be called when data exchange with backend occured an error
    var onFaliure = function()
    {
        toastr.error('Internal server error has occured. Please try again', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        return_value =  null;
    }

    makePutRequest("allBudgets/"+budgetID,JSON_data,onSuccess,onFaliure);

    return return_value;
}



function prepare_all_budget_table_rows(_id,BudgetNumber,BudgetName,StartDate,EndDate)
{


    var _id_td = document.createElement('td');
    _id_td.innerHTML = _id;

    var BudgetNumber_td = document.createElement('td');
    BudgetNumber_td.innerHTML = BudgetNumber;

    var BudgetName_td = document.createElement('td');
    BudgetName_td.innerHTML = BudgetName;

    var startDate_td = document.createElement('td');
    var startDate_value = "";
    if(StartDate == null || StartDate == "")
        startDate_value=""
    else
    {
        const Start_Date_obj = new Date(StartDate);
        startDate_value = Start_Date_obj.getUTCDate() + " " + month_in_Name(Start_Date_obj.getUTCMonth()) + ", " + Start_Date_obj.getUTCFullYear();
    }

    startDate_td.innerHTML = startDate_value;

    var endDate_td = document.createElement('td');
    var endDate_value = "";
    if(EndDate == null || EndDate == "")
        endDate_value= ""
    else
    {
        const End_Date_obj = new Date(EndDate);    
        endDate_value = End_Date_obj.getUTCDate() + " " + month_in_Name(End_Date_obj.getUTCMonth()) + ", " + End_Date_obj.getUTCFullYear();
    }

    endDate_td.innerHTML = endDate_value;

    //tr element
    var tr = document.createElement('tr');
    tr.appendChild(_id_td);
    tr.appendChild(BudgetNumber_td);
    tr.appendChild(BudgetName_td);
    tr.appendChild(startDate_td);
    tr.appendChild(endDate_td);


    return tr;

}

//------------------------------ End Helper Functions -----------------------------------------