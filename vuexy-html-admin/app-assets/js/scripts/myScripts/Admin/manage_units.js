//keep track of the unit over view table
var unit_over_view_table = null;
//keep track of modal table
var modal_budgets_table = null;

//keep track of table body tags
var unit_names_table_body = document.getElementById("unit_names_table_body");

//these variables will keep track of selected rows in 4 tables
var selected_row_unit_over_view = -1;

var unit_info = null;

//form elements
var unit_name_input = document.getElementById("unit_name_input");
var unit_name_input_error = document.getElementById("unit_name_input_error");
var ManageUnit_removeBtn = document.getElementById("ManageUnit_removeBtn");
var ManageUnit_updateBtn = document.getElementById("ManageUnit_updateBtn");
var ManageUnit_addBtn = document.getElementById("ManageUnit_addBtn");

var formAllowed_selectBox = document.getElementById("formAllowed_selectBox");

//This will keep track of selected rows in the modal budget table
var selected_rows_modal_budget_table = [];
//modal button
var updateUnit_with_budgets_btn = document.getElementById("updateUnit_with_budgets_btn_");

//approval logic Modal
var approval_logic_modal = document.getElementById("approval_logic_modal");
var AllCheckBox = document.getElementById("AllCheckBox");
var AnyoneCheckBox = document.getElementById("AnyoneCheckBox");
var AdvancedCheckBox = document.getElementById("AdvancedCheckBox");
var ApproversSelectBox = document.getElementById("ApproversSelectBox");
var ApproversLogicSelectBox = document.getElementById("ApproversLogicSelectBox");
var updateApprovalChainLogic_btn = document.getElementById("updateApprovalChainLogic_btn");
var currentApproverLogic = document.getElementById("currentApproverLogic");

addLoadEvent(function()
{
    
    //initializing all the tables
    initialize_Unit_overview_table();

    //updating unit overview table
    update_Unit_overview_table();

    add_btn_hide_unhide_logic_Unit_overview();
    update_btn_hide_unhide_logic_Unit_overview();
    remove_btn_hide_unhide_logic_Unit_overview();
});

function update_Unit_overview_table()
{
    //api Call to get all the units under a this unit
    unit_info = getAll_Units();
    if(unit_info)
    {
        unit_over_view_table.clear().destroy();
        //filling unit overview table
        for(var x=0;x<unit_info.length;x++)
            unit_names_table_body.appendChild(prepare_Unit_overview_table_rows(unit_info[x]._id,unit_info[x].unitName));

        initialize_Unit_overview_table();
        
    }
    
}

//----------------------- Functions to prepare rows for different tables ----------------------------------------------
function prepare_Unit_overview_table_rows(UnitID, UnitName)
{
    var td_id = document.createElement('td');
    td_id.innerHTML = UnitID;
    var td_name = document.createElement('td');
    td_name.innerHTML = UnitName;

    var tr = document.createElement('tr');
    tr.appendChild(td_id);
    tr.appendChild(td_name);

    return tr;

}

//----------------------- End of Functions to prepare rows for different tables ---------------------------------------

//----------------------- Input Validators ----------------------------------------------------------------------------
function unit_overview_input_validator()
{
    var errorFound = false;

    if(unit_name_input.value == "" || unit_name_input.value == null)
    {
        unit_name_input_error.innerHTML = "* Unit Name required";
        errorFound = true;
    }else
        unit_name_input_error.innerHTML = "";
        
    if(errorFound)
        return true;
    else
        return false;

}

//----------------------- End of inout Validators ---------------------------------------------------------------------

//----------------------- Functions to fill form elements associated with the tables ----------------------------------------
function fill_form_elements_Unit_overview(row_index)
{
    
    if(row_index > -1)
    {
        const row_info = unit_over_view_table.row(row_index).data();
        unit_name_input.value = row_info[1];
    }else
    {
        unit_name_input.value = "";
    }
}

function fill_allowed_requests_options()
{
    const allForms = getAllFormInformation();
    //remove all the options in the select box
    $("#formAllowed_selectBox").empty();
    if(allForms)
    {
        for(var x=0; x<allForms.length;x++)
        {

            formAllowed_selectBox.options[formAllowed_selectBox.options.length] = new Option(allForms[x].formName, allForms[x].formName);
        }
        
    }
}

//----------------------- End of Functions to fill form elements associated with the tables ----------------------------------

//----------------------- Button Click Events --------------------------------------------------------------------------------
function add_Unit_Unit_overview()
{
	console.log('Add unit button pressed');
    if(!unit_overview_input_validator())
    {
	console.log('Add unit point 1');
        if(add_unit(unit_name_input.value))
        {
	console.log('Add unit success');
            toastr.success(`Unit ${unit_name_input.value} added to ${window.sessionStorage.getItem("unitName")}`, 'Success', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            clear_Information_Unit_overview();
            update_Unit_overview_table();
        } else {
	console.log('Add unit failure');
	}
    }
}

function update_Unit_Unit_overview()
{
    if(selected_row_unit_over_view > -1)
    {
        const selected_row_info = unit_over_view_table.row( selected_row_unit_over_view ).data();
        const newName = unit_name_input.value;

        if(update_Unit_name(selected_row_info[0],newName))
        {
            toastr.success(`Unit name successfully updated`, 'Success', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            clear_Information_Unit_overview();
            update_Unit_overview_table();
        }
    }
}

function remove_Unit_Unit_overview()
{
    if(selected_row_unit_over_view > -1)
    {
        const selected_row_info = unit_over_view_table.row( selected_row_unit_over_view ).data();

        if(remove_unit(selected_row_info[0]))
        {
            toastr.success(`Unit ${selected_row_info[1]} successfully removed`, 'Success', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            clear_Information_Unit_overview();
            update_Unit_overview_table();
        }
    }
}


function clear_Information_Unit_overview()
{
    unit_name_input.value = "";
    unit_name_input_error.innerHTML = "";

    if(selected_row_unit_over_view > -1)
    {
        unit_over_view_table.rows('.selected').nodes().to$().removeClass( 'selected' );
        selected_row_unit_over_view = -1;
    }

    
    add_btn_hide_unhide_logic_Unit_overview();
    update_btn_hide_unhide_logic_Unit_overview();
    remove_btn_hide_unhide_logic_Unit_overview();
}

function modalTable_checkBox_click_event(selected_index,DOM_element)
{
    
    if(DOM_element.checked)
        selected_rows_modal_budget_table.push(selected_index);
    else
     selected_rows_modal_budget_table.splice(selected_rows_modal_budget_table.indexOf(selected_index), 1);


    if(selected_rows_modal_budget_table.length <= 0)

        updateUnit_with_budgets_btn.disabled = true;     
    else
        updateUnit_with_budgets_btn.disabled = false; 

}

function modal_close_btn_logic()
{
    setTimeout(function(){
    
    clear_Information_Unit_overview();
    update_Unit_overview_table();
    modal_budgets_table.clear().destroy();
    modal_budgets_table = null;  
    
 
    updateUnit_with_budgets_btn_.disabled = true;
    },500);

}

//this function will create a approval chain logic once the Update Approval chain logic button is pressed
function prepare_approval_logic()
{
    var isErrorFound = false;

    var approval_String = "";
    //first get all the approvers UserIDs under selected budget
    const approverIDs = $("#ApproversSelectBox>option").map(function() { return $(this).val(); });

    if(AllCheckBox.checked)
        for(var x=0;x<approverIDs.length;x++)
            approval_String += approverIDs[x]+"&&"
    else if(AnyoneCheckBox.checked)
        for(var x=0;x<approverIDs.length;x++)
            approval_String += approverIDs[x]+"||"
    else if(AdvancedCheckBox.checked)
    {
        //get selected options from the approvers select box
        const selected_approvers = $("#ApproversSelectBox").val();
        if(selected_approvers.length <= 0)
        {
            ApproversSelectBox_input_error.innerHTML = "* At least one approver is required to setup the approval logic";
            isErrorFound = true;
        }
        //lets get the selected index of ApproversLogicSelectBox
        const selected_index = ApproversLogicSelectBox.selectedIndex;
        if(selected_index == 0) //all
            for(var x=0;x<selected_approvers.length;x++)
                approval_String += selected_approvers[x]+"&&"
        else
            for(var x=0;x<selected_approvers.length;x++)
                approval_String += selected_approvers[x]+"&&"  
    }else
    {
        ApproversSelectBox_input_error.innerHTML = "* Please Select an option to setup the approval logic";
        isErrorFound = true;
    }

    //remove last two characters
    approval_String = approval_String.substring(0,approval_String.length-2);
    if(!isErrorFound)
    {
        const unitID_ = unit_info[selected_row_unit_over_view]._id;
        const budgetNumber_ = unit_info[selected_row_unit_over_view].BudgetTable[selected_row_budget_over_view].budgetNumber;
        ApproversSelectBox_input_error.innerHTML = "";
        if(update_approval_logic(unitID_,budgetNumber_,approval_String))
        {
            clear_Information_Unit_overview();
            update_Unit_overview_table();  
            $('#approval_logic_modal').modal('hide');
        }
            
    }
        

}

//----------------------- End of Button Click Events -------------------------------------------------------------------------

//----------------------- Button Hide/Unhide logic ----------------------------------------------------------------------------
function add_btn_hide_unhide_logic_Unit_overview()
{
    if(selected_row_unit_over_view > -1)
    {
        const row_info = unit_over_view_table.row( selected_row_unit_over_view ).data();

        if(row_info[1] == unit_name_input.value)
            ManageUnit_addBtn.disabled = true;
        else
            ManageUnit_addBtn.disabled = false;
    }else
        ManageUnit_addBtn.disabled = false; 
}

function update_btn_hide_unhide_logic_Unit_overview()
{
    if(selected_row_unit_over_view > -1)
    {
        const row_info = unit_over_view_table.row( selected_row_unit_over_view ).data();

        if(row_info[1] == unit_name_input.value)
            ManageUnit_updateBtn.disabled = true;
        else
            ManageUnit_updateBtn.disabled = false;
    }else
        ManageUnit_updateBtn.disabled = true; 
}

function remove_btn_hide_unhide_logic_Unit_overview()
{
    if(selected_row_unit_over_view > -1)
        ManageUnit_removeBtn.disabled = false;
    else
        ManageUnit_removeBtn.disabled = true;
}

//----------------------- End of Button Hide/Unhide logic ---------------------------------------------------------------------

// ------------------------ Table Information clearing function ---------------------------------------------------------------
function clear_and_initialize_Unit_overview_table()
{
    selected_row_unit_over_view = -1;
    unit_over_view_table.clear().destroy();
    initialize_Unit_overview_table();
}

// ------------------------ End of Table Information clearing function --------------------------------------------------------

//----------------------- Table Click events ----------------------------------------------------------------------------------

//unit overiew table
$('#unit_names_table tbody').on( 'click', 'tr', function () {

    //table row highlight code
    if ( $(this).hasClass('selected') ) 
    {
        $(this).removeClass('selected');
        selected_row_unit_over_view = -1;
    }
    else 
    {
        unit_over_view_table.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        selected_row_unit_over_view = unit_over_view_table.row( this ).index();
    }

    fill_form_elements_Unit_overview(selected_row_unit_over_view);
    add_btn_hide_unhide_logic_Unit_overview();
    update_btn_hide_unhide_logic_Unit_overview();
    remove_btn_hide_unhide_logic_Unit_overview();

} );

function prepare_current_approval_logic_string()
{
    const all_approvers = ApproversSelectBox.options;
    const currentApproval_logic_string  = unit_info[selected_row_unit_over_view].BudgetTable[selected_row_budget_over_view].approvalLogic;
    var approval_logic_to_display = "<b>Current Approval Logic:</b> ";

    if(currentApproval_logic_string == "" || currentApproval_logic_string == null)
    {
        currentApproverLogic.innerHTML = approval_logic_to_display+" Approval logic not set-up yet";
        return;
    }
    
    
    if(currentApproval_logic_string.includes("&&"))
    {
        var approvers_to_show = currentApproval_logic_string.split("&&");
        for(var x=0;x<approvers_to_show.length;x++)
        {
            for(var y=0;y<all_approvers.length;y++)
            {
                if(all_approvers[y].value == approvers_to_show[x])
                    approval_logic_to_display += all_approvers[y].innerHTML +"<i style='color:#d35400'> AND </i>";
            }
        }
        //remove unwanted AND part
        approval_logic_to_display = approval_logic_to_display.substring(0,approval_logic_to_display.length - 34);
    }else if(currentApproval_logic_string.includes("||"))
    {
        var approvers_to_show = currentApproval_logic_string.split("||");
        for(var x=0;x<approvers_to_show.length;x++)
        {
            for(var y=0;y<all_approvers.length;y++)
            {
                if(all_approvers[y].value == approvers_to_show[x])
                    approval_logic_to_display += all_approvers[y].innerHTML +"<i style='color:#d35400'> OR </i>";
            }
        }       
        //remove unwanted OR part
        approval_logic_to_display = approval_logic_to_display.substring(0,approval_logic_to_display.length - 23); 
    }else //case referes to where only one approver in the approver logic
    {
        var approvers_to_show = [currentApproval_logic_string];
        for(var x=0;x<approvers_to_show.length;x++)
        {
            for(var y=0;y<all_approvers.length;y++)
            {
                if(all_approvers[y].value == approvers_to_show[x])
                    approval_logic_to_display += all_approvers[y].innerHTML;
            }
        }  
    }

    currentApproverLogic.innerHTML = approval_logic_to_display;

}


function Approval_Logic_Modal_check_box_logic(checkBoxNum)
{
    if(checkBoxNum == 1)
        if(AllCheckBox.checked)
        {
            AnyoneCheckBox.checked = false;
            AdvancedCheckBox.checked = false;
            Approval_logic_list_box_disable_enable(true);
        }else
            AllCheckBox.checked = true;

    if(checkBoxNum == 2)
        if(AnyoneCheckBox.checked)
        {
            AllCheckBox.checked = false;
            AdvancedCheckBox.checked = false;
            Approval_logic_list_box_disable_enable(true);
        }else
            AnyoneCheckBox.checked = true;

    if(checkBoxNum == 3)
        if(AdvancedCheckBox.checked)
        {
            AllCheckBox.checked = false;
            AnyoneCheckBox.checked = false;
            Approval_logic_list_box_disable_enable(false);
        }else
            AdvancedCheckBox.checked = true;

}

function Approval_logic_list_box_disable_enable(state)
{
    ApproversSelectBox.disabled = state;
    ApproversLogicSelectBox.disabled = state;
    if(state)
    {
        //remove all of the stuff and reload, this modified components dont allow removing one by one
        fill_ApproverSelect_box_with_approvers();
        //set selected index to 0
        ApproversLogicSelectBox.selectedIndex = 0;
    }
}

function fill_ApproverSelect_box_with_approvers()
{
    var All_approvers = approvers_over_view_table.rows( ).data();
    $("#ApproversSelectBox").empty();
    for(var y=0; y<All_approvers.length;y++)
        ApproversSelectBox.options[ApproversSelectBox.options.length] = new Option(All_approvers[y][2],All_approvers[y][0]);      
    
}

//Budget overview table
$('#approvers_overview_table tbody').on( 'click', 'tr', function () {
    //table row highlight code
    if ( $(this).hasClass('selected') ) 
    {
        $(this).removeClass('selected');
        selected_row_approvers_over_view= -1;
    }
    else 
    {
        approvers_over_view_table.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        selected_row_approvers_over_view = approvers_over_view_table.row( this ).index();

        
        
    }

    fill_form_elements_Approvers_overview(selected_row_approvers_over_view);
    add_btn_hide_unhide_logic_Approvers_overview();
    update_btn_hide_unhide_logic_Approver_overview();
    remove_btn_hide_unhide_logic_Approver_overview();
} );
//----------------------- End of Table Click events ---------------------------------------------------------------------------

//----------------------- Table initializer functions -------------------------------------------
function initialize_Unit_overview_table()
{
    unit_over_view_table = $('#unit_names_table').DataTable(  {
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

//for Modal table
function initialize_table()
{
    modal_budgets_table = $('#modal_budgets_table').DataTable(  {
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
//----------------------- End of Table initializers ---------------------------------------------


//----------------------- API functions to talk to backend ----------------------------------------------------
function getAll_Units()
{
    var return_value = null;
    var onSuccess = function(data)
    {
        if(data.status == false)
        {
            toastr.error('Backend error occured while fetching Unit information. Please try again', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            return_value = null;
        }   
        else
            return_value = data.data;
        
    }

    //this function will be called when data exchange with backend occured an error
    var onFaliure = function()
    {
        toastr.error('Backend error occured while fetching Unit information. Please try again', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        return_value = null;
    }

    makeGetRequest("allUnits",onSuccess,onFaliure);
    return return_value;
}

function add_unit(Unit_name)
{
    var Unit_JSON = {
    "unitName": Unit_name,
    "userIDs": [],
    "subUnitIDs": [],
    "formVisibility": []
    }

    var return_value = null;
    var onSuccess = function(data)
    {
        if(data.status == false)
        {
            toastr.error(data.data, 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            return_value =  null;
        }else
        {
            return_value =  data.data;
        }

    }

    //this function will be called when data exchange with backend occured an error
    var onFaliure = function()
    {
        toastr.error('Internal server error has occured. Please try again', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        return_value =  null;
    }

    makePostRequest("units",Unit_JSON,onSuccess,onFaliure);

    return return_value;
}


function update_Unit_name(UnitID,newName)
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

    makePutRequest_NoBody("units/"+UnitID+"/"+newName,onSuccess,onFaliure);

    return return_value;   
}


function remove_unit(UnitID)
{
    var return_value = false;
    var onSuccess = function(data)
    {
        if(data.status == false)
        {
            toastr.error(data.data, 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            return_value = false;
        }   
        else
            return_value = true;
        
    }

    //this function will be called when data exchange with backend occured an error
    var onFaliure = function()
    {
        toastr.error('Backend error occured while removing Unit. Please try again', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        return_value = false;
    }

    makeDeleteRequest("units/"+UnitID,onSuccess,onFaliure);
    return return_value;    
}

function getAllFormInformation()
{
    var return_value = null;
    var onSuccess = function(data)
    {
        if(data.status == false)
        {
            toastr.error('Backend error occured while fetching allowed requests', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            return_value = null;
        }else
            return_value =  data.data;
    }

    //this function will be called when data exchange with backend occured an error
    var onFaliure = function()
    {
        toastr.error('Backend error occured while fetching allowed requests', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        return_value = null;
    }
    

    makeGetRequest("formVisibility/"+window.sessionStorage.getItem("unitID"),onSuccess,onFaliure);

    return return_value;
}

//----------------------- End of API functions to talk to backend ---------------------------------------------
