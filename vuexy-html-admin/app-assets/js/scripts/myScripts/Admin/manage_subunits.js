//keep track of the subunit over view table
var subunit_over_view_table = null;
//keep track of the submitter over view table
var submitter_over_view_table = null;
//keep track of the budget over view table
var budget_over_view_table = null;
//keep track of the approvers over view table
var approvers_over_view_table = null;
//keep track of modal table
var modal_budgets_table = null;

//keep track of table body tags
var subunit_names_table_body = document.getElementById("subunit_names_table_body");
var submitters_overview_table_body = document.getElementById("submitters_overview_table_body");
var budget_overview_table_body = document.getElementById("budget_overview_table_body");
var approvers_overview_table_body = document.getElementById("approvers_overview_table_body");

//these variables will keep track of selected rows in 4 tables
var selected_row_subunit_over_view = -1;
var selected_row_submitter_over_view = -1;
var selected_row_budget_over_view = -1;
var selected_row_approvers_over_view = -1;

var subunit_info = null;

//form elements
var subUnit_name_input = document.getElementById("subUnit_name_input");
var subUnit_name_input_error = document.getElementById("subUnit_name_input_error");
var ManageSubUnit_removeBtn = document.getElementById("ManageSubUnit_removeBtn");
var ManageSubUnit_updateBtn = document.getElementById("ManageSubUnit_updateBtn");
var ManageSubUnit_addBtn = document.getElementById("ManageSubUnit_addBtn");

var submitters_name_input = document.getElementById("submitters_name_input");
var submitters_name_input_error = document.getElementById("submitters_name_input_error");
var submitter_email_input = document.getElementById("submitter_email_input");
var submitter_email_input_error = document.getElementById("submitter_email_input_error");
var submitter_UWID_input = document.getElementById("submitter_UWID_input");
var submitter_UWID_input_error = document.getElementById("submitter_UWID_input_error");
var submitter_clearBtn = document.getElementById("submitter_clearBtn");
var submitter_removeBtn = document.getElementById("submitter_removeBtn");
var submitter_updateBtn = document.getElementById("submitter_updateBtn");
var submitter_addBtn = document.getElementById("submitter_addBtn");

var budget_addBtn = document.getElementById("budget_addBtn");
var budget_removeBtn = document.getElementById("budget_removeBtn");

var approver_name_input = document.getElementById("approver_name_input");
var approver_name_input_error = document.getElementById("approver_name_input_error");
var approver_email_input = document.getElementById("approver_email_input");
var approver_email_input_error = document.getElementById("approver_email_input_error");
var approver_UWID_input = document.getElementById("approver_UWID_input");
var approver_UWID_input_error = document.getElementById("approver_UWID_input_error");
var approver_limit_input = document.getElementById("approver_limit_input");
var approver_limit_input_error = document.getElementById("approver_limit_input_error");
var approvers_removeBtn = document.getElementById("approvers_removeBtn");
var approvers_updateBtn = document.getElementById("approvers_updateBtn");
var approvers_addBtn = document.getElementById("approvers_addBtn");
var approvers_clearBtn = document.getElementById("approvers_clearBtn");
var formAllowed_selectBox = document.getElementById("formAllowed_selectBox");
var approver_PI_input = document.getElementById("approver_PI_input");
var approver_PI_input_error = document.getElementById("approver_PI_input_error");
var approver_allowedRequests_input_error = document.getElementById("approver_allowedRequests_input_error");


//This will keep track of selected rows in the modal budget table
var selected_rows_modal_budget_table = [];
//modal button
var updateSubUnit_with_budgets_btn = document.getElementById("updateSubUnit_with_budgets_btn_");

//approval logic Modal
var approval_logic_modal = document.getElementById("approval_logic_modal");
var AllCheckBox = document.getElementById("AllCheckBox");
var AnyoneCheckBox = document.getElementById("AnyoneCheckBox");
var AdvancedCheckBox = document.getElementById("AdvancedCheckBox");
var ApproversSelectBox = document.getElementById("ApproversSelectBox");
var ApproversLogicSelectBox = document.getElementById("ApproversLogicSelectBox");
var updateApprovalChainLogic_btn = document.getElementById("updateApprovalChainLogic_btn");
var currentApproverLogic = document.getElementById("currentApproverLogic");

window.onload = function()
{
    
    //initializing all the tables
    initialize_Subunit_overview_table();
    initialize_submitter_overview_table();
    initialize_budget_overview_table();
    initialize_approvers_overview_table();

    //updating subunit overview table
    update_Subunit_overview_table();
   

    add_btn_hide_unhide_logic_Subunit_overview();
    update_btn_hide_unhide_logic_Subunit_overview();
    remove_btn_hide_unhide_logic_Subunit_overview();

    //all the buttons in Subinit Overview must be hidden
    hide_all_btns_logic_Submitter_overview();
    //all the buttons in budget Overview must be hidden
    hide_all_btns_logic_budget_overview();
    updateSubUnit_with_budgets_btn.disabled = true;
    //approver overviewsection
    hide_all_btns_logic_approver_overview();
}

function update_Subunit_overview_table()
{
    //api Call to get all the subunits under a this unit
    subunit_info = getAll_Subunits_under_Unit();
    if(subunit_info)
    {
        subunit_over_view_table.clear().destroy();
        //filling subunit overview table
        for(var x=0;x<subunit_info.length;x++)
            subunit_names_table_body.appendChild(prepare_Subunit_overview_table_rows(subunit_info[x]._id,subunit_info[x].subUnitName));

        initialize_Subunit_overview_table();
        
    }
    
}

function update_Budget_overview_table()
{
    const x = selected_row_subunit_over_view;

    if(subunit_info && x > -1)
    {    
        budget_over_view_table.clear().destroy();
            for(var y=0;y<subunit_info[x].BudgetTable.length;y++)
                budget_overview_table_body.appendChild(prepare_Budget_overview_table_rows(subunit_info[x].BudgetTable[y].budgetNumber, subunit_info[x].BudgetTable[y].budgetName, subunit_info[x].BudgetTable[y].startDate, subunit_info[x].BudgetTable[y].endDate, subunit_info[x].BudgetTable[y].approvalLogic));
            
        initialize_budget_overview_table();
        
    }
}

function update_Submitters_overview_table()
{
    const x = selected_row_subunit_over_view;

    if(subunit_info && x > -1)
    {
        submitter_over_view_table.clear().destroy();
        for(var y=0;y<subunit_info[x].Submitters_IDs.length;y++)
        {
            const results = get_user_information_given_ID(subunit_info[x].Submitters_IDs[y]);
            if(results)
                submitters_overview_table_body.appendChild(prepare_Submitters_overview_table_rows(results._id, results.Name, results.UWID, results.email, results.verified_user, results.profileImage_URL));
        }

        initialize_submitter_overview_table();
    }
}

function update_Approvers_overview_table()
{
    const x = selected_row_subunit_over_view;
    const z = selected_row_budget_over_view;

    if(subunit_info && x > -1 && z > -1)
    {
        approvers_over_view_table.clear().destroy();
        for(var y=0; y<subunit_info[x].BudgetTable[z].approvers.length;y++)
        {
            
            const results = get_user_information_given_ID(subunit_info[x].BudgetTable[z].approvers[y].ID);
            if(results)
                approvers_overview_table_body.appendChild(prepare_Approvers_overview_table_rows(results._id, results.Name, results.UWID, results.email, results.verified_user, results.profileImage_URL,subunit_info[x].BudgetTable[z].approvers[y].limit,subunit_info[x].BudgetTable[z].approvers[y].allowedRequests,subunit_info[x].BudgetTable[z].approvers[y].PI));
        }
        initialize_approvers_overview_table();
    }
}

//----------------------- Functions to prepare rows for different tables ----------------------------------------------
function prepare_Subunit_overview_table_rows(SubunitID, SubunitName)
{
    var td_id = document.createElement('td');
    td_id.innerHTML = SubunitID;
    var td_name = document.createElement('td');
    td_name.innerHTML = SubunitName;

    var tr = document.createElement('tr');
    tr.appendChild(td_id);
    tr.appendChild(td_name);

    return tr;

}

function prepare_Budget_overview_table_rows(budgetNumber, BudgetName, StartDate, EndDate, ApprovalLogic)
{
    var td_budgetNumber = document.createElement('td');
    td_budgetNumber.innerHTML = budgetNumber;
    var td_BudgetName = document.createElement('td');
    td_BudgetName.innerHTML = BudgetName;
    var td_StartDate = document.createElement('td');
    td_StartDate.innerHTML = StartDate;
    var td_EndDate = document.createElement('td');
    td_EndDate.innerHTML = EndDate;
    var td_ApprovalLogic = document.createElement('td');
    td_ApprovalLogic.innerHTML = ApprovalLogic;


    var Approval_setup = "";
    if(ApprovalLogic.trim() == "" || ApprovalLogic == null)
        Approval_setup = "Not Set-up";
    else
        Approval_setup = "Set-up";

    var td_ApprovalLogic_status = document.createElement('td');
    td_ApprovalLogic_status.innerHTML = Approval_setup;    

    var tr = document.createElement('tr');
    tr.appendChild(td_budgetNumber);
    tr.appendChild(td_BudgetName);
    tr.appendChild(td_StartDate);
    tr.appendChild(td_EndDate);
    tr.appendChild(td_ApprovalLogic);
    tr.appendChild(td_ApprovalLogic_status);

    return tr;

}

function prepare_Submitters_overview_table_rows(_id, Name, UWID, Email, verified_user, profile_pic_url)
{
    var td_id_ = document.createElement('td');
    td_id_.innerHTML = _id;

    //making profile picture cell part 
    var td_profile_image = document.createElement('td');
    var avatar_div = document.createElement('div');
    avatar_div.setAttribute('class','avatar mr-1 avatar-lg');
    var avatar_img = document.createElement('img');
    avatar_img.setAttribute('alt','avtar img holder');
    if(profile_pic_url == "" || profile_pic_url == null)
        avatar_img.setAttribute('src','../../../app-assets/images/portrait/small/default.jpg');
    else
        avatar_img.setAttribute('src',profile_pic_url);
    
    avatar_div.appendChild(avatar_img);
    td_profile_image.appendChild(avatar_div);

    var td_name = document.createElement('td');
    td_name.innerHTML = Name;

    var td_UWID = document.createElement('td');
    td_UWID.innerHTML = UWID;

    var td_Email = document.createElement('td');
    td_Email.innerHTML = Email;

    var td_verfied_user = document.createElement('td');
    if(verified_user)
        td_verfied_user.innerHTML = "Yes";
    else
        td_verfied_user.innerHTML = "No";

    var td_profile_pic_url = document.createElement('td');
    td_profile_pic_url.innerHTML = profile_pic_url;

    var tr = document.createElement('tr');
    tr.appendChild(td_id_);
    tr.appendChild(td_profile_image);
    tr.appendChild(td_name);
    tr.appendChild(td_UWID);
    tr.appendChild(td_Email);
    tr.appendChild(td_verfied_user);
    tr.appendChild(td_profile_pic_url);

    return tr;    

}

function prepare_Approvers_overview_table_rows(_id, Name, UWID, Email, verified_user, profile_pic_url,limit,requests,PI)
{
    var td_id_ = document.createElement('td');
    td_id_.innerHTML = _id;

    //making profile picture cell part 
    var td_profile_image = document.createElement('td');
    var avatar_div = document.createElement('div');
    avatar_div.setAttribute('class','avatar mr-1 avatar-lg');
    var avatar_img = document.createElement('img');
    avatar_img.setAttribute('alt','avtar img holder');
    if(profile_pic_url == "" || profile_pic_url == null)
        avatar_img.setAttribute('src','../../../app-assets/images/portrait/small/default.jpg');
    else
        avatar_img.setAttribute('src',profile_pic_url);
    
    avatar_div.appendChild(avatar_img);
    td_profile_image.appendChild(avatar_div);

    var td_name = document.createElement('td');
    td_name.innerHTML = Name;

    var td_UWID = document.createElement('td');
    td_UWID.innerHTML = UWID;

    var td_Email = document.createElement('td');
    td_Email.innerHTML = Email;

    var td_verfied_user = document.createElement('td');

    if(verified_user)
        td_verfied_user.innerHTML = "Yes";
    else
        td_verfied_user.innerHTML = "No";

    var td_limit = document.createElement('td');
    td_limit.innerHTML = limit;

    var td_requests = document.createElement('td');
    var allowed_requests = "";
    for(var x=0;x<requests.length;x++)
        allowed_requests = allowed_requests + requests[x] + "</br>";

    td_requests.innerHTML = allowed_requests;

    var td_PI = document.createElement('td');

    if(PI)
        td_PI.innerHTML = "Yes";
    else
        td_PI.innerHTML = "No";

    var td_profile_pic_URL = document.createElement('td');
    td_profile_pic_URL.innerHTML = profile_pic_url;

    var tr = document.createElement('tr');
    tr.appendChild(td_id_);
    tr.appendChild(td_profile_image);
    tr.appendChild(td_name);
    tr.appendChild(td_UWID);
    tr.appendChild(td_Email);
    tr.appendChild(td_verfied_user);
    tr.appendChild(td_limit);
    tr.appendChild(td_requests);
    tr.appendChild(td_PI);
    tr.appendChild(td_profile_pic_URL);
    return tr;     


}

function prepare_all_budget_table_rows(_id,BudgetNumber,BudgetName,StartDate,EndDate,index)
{
    var checkbox_td_parent = document.createElement('td');

    var checkbox_div = document.createElement('div');
    checkbox_div.setAttribute('class','vs-checkbox-con vs-checkbox-primary');

    var checkbox_input = document.createElement('input');
    checkbox_input.setAttribute('type','checkbox');
    checkbox_input.setAttribute('onclick',`modalTable_checkBox_click_event(${index},this)`);

    var outter_span = document.createElement('span');
    outter_span.setAttribute('class','vs-checkbox');

    var inner_span = document.createElement('span');
    inner_span.setAttribute('class','vs-checkbox--check');

    var i = document.createElement('i');
    i.setAttribute('class','vs-icon feather icon-check');

    inner_span.appendChild(i);
    outter_span.appendChild(inner_span);
    checkbox_div.appendChild(checkbox_input);
    checkbox_div.appendChild(outter_span);
    checkbox_td_parent.appendChild(checkbox_div);


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
    tr.appendChild(checkbox_td_parent);
    tr.appendChild(BudgetNumber_td);
    tr.appendChild(BudgetName_td);
    tr.appendChild(startDate_td);
    tr.appendChild(endDate_td);


    return tr;

}

//----------------------- End of Functions to prepare rows for different tables ---------------------------------------

//----------------------- Input Validators ----------------------------------------------------------------------------
function subunit_overview_input_validator()
{
    var errorFound = false;

    if(subUnit_name_input.value == "" || subUnit_name_input.value == null)
    {
        subUnit_name_input_error.innerHTML = "* Subunit Name required";
        errorFound = true;
    }else
        subUnit_name_input_error.innerHTML = "";
        
    if(errorFound)
        return true;
    else
        return false;

}


function submitter_overview_input_validator()
{
    String.prototype.isNumber = function(){return /^\d+$/.test(this);}
    var errorFound = false;
    
    if(submitters_name_input.value == "" || submitters_name_input.value == null)
    {
        submitters_name_input_error.innerHTML = "* Name required";
        errorFound = true;
    }        
    else
        submitters_name_input_error.innerHTML = "";

    if(submitter_UWID_input.value == "" || submitter_UWID_input.value == null)
    {
        submitter_UWID_input_error.innerHTML = "* UW ID required";
        errorFound = true;
    }        
    // else if (!submitter_UWID_input.value.isNumber())
    // {
    //     submitter_UWID_input_error.innerHTML = "* Only digits allowed";
    //     errorFound = true;
    // }
    else
        submitter_UWID_input_error.innerHTML = "";
        
        
    if(submitter_email_input.value == "" || submitter_email_input.value == null)
    {
        submitter_email_input_error.innerHTML = "* Email address required";
        errorFound = true;
    }        
    else if (submitter_email_input.value.includes("@uw.edu") == false)
    {
        submitter_email_input_error.innerHTML = "* Only UW email adresses allowed";
        errorFound = true;
    }else
        submitter_email_input_error.innerHTML = "";


    if(errorFound)
        return true;
    else
        return false;
    
}

function approver_overview_input_validator()
{
    String.prototype.isNumber = function(){return /^\d+$/.test(this);}
    String.prototype.isMoney = function(){return /^[0-9]+\.[0-9]+$/.test(this);}
    var errorFound = false;
    
    if(approver_name_input.value == "" || approver_name_input.value == null)
    {
        approver_name_input_error.innerHTML = "* Name required";
        errorFound = true;
    }        
    else
        approver_name_input_error.innerHTML = "";

    if(approver_UWID_input.value == "" || approver_UWID_input.value == null)
    {
        approver_UWID_input_error.innerHTML = "* UW ID required";
        errorFound = true;
    }        
    // else if (!approver_UWID_input.value.isNumber())
    // {
    //     approver_UWID_input_error.innerHTML = "* Only digits allowed";
    //     errorFound = true;
    // }
    else
        approver_UWID_input_error.innerHTML = "";
        
        
    if(approver_email_input.value == "" || approver_email_input.value == null)
    {
        approver_email_input_error.innerHTML = "* Email address required";
        errorFound = true;
    }        
    else if (approver_email_input.value.includes("@uw.edu") == false)
    {
        approver_email_input_error.innerHTML = "* Only UW email adresses allowed";
        errorFound = true;
    }else
        approver_email_input_error.innerHTML = "";


    if(approver_limit_input.value.trim() != "")
    {
        if (!approver_limit_input.value.isMoney())
        {
            approver_limit_input_error.innerHTML = "* Only digits allowed";
            errorFound = true;
        }else
            approver_limit_input_error.innerHTML = "";
    }else
        approver_limit_input_error.innerHTML = "";
    
    if(approver_PI_input.selectedIndex == 0)
    {
        approver_PI_input_error.innerHTML = "* PI information required";
        errorFound = true;
    }else
        approver_PI_input_error.innerHTML = ""; 


    var selected_options = $('#formAllowed_selectBox').val();
    if(selected_options.length <= 0)
    {
        approver_allowedRequests_input_error.innerHTML = "* Allowed reuests are required";
        errorFound = true;
    }else
        approver_allowedRequests_input_error.innerHTML = "";


    if(errorFound)
        return true;
    else
        return false;
    
}

//----------------------- End of inout Validators ---------------------------------------------------------------------

//----------------------- Functions to fill form elements associated with the tables ----------------------------------------
function fill_form_elements_Subunit_overview(row_index)
{
    
    if(row_index > -1)
    {
        const row_info = subunit_over_view_table.row(row_index).data();
        subUnit_name_input.value = row_info[1];
    }else
    {
        subUnit_name_input.value = "";
    }
}

function fill_form_elements_Submitters_overview(row_index)
{
    if(row_index > -1)
    {
        const row_info = submitter_over_view_table.row(row_index).data();
        submitters_name_input.value = row_info[2];
        submitter_UWID_input.value = row_info[3];
        submitter_email_input.value = row_info[4];
    }else
    {
        submitters_name_input.value = "";
        submitter_UWID_input.value = "";
        submitter_email_input.value = "";
    }   
}

function fill_form_elements_Approvers_overview(row_index)
{
    if(row_index > -1)
    {
        
        const row_info = approvers_over_view_table.row(row_index).data();
        
        var allowed_requests = row_info[7].split("<br>");

            const allForms = getAllFormInformation();
            //remove all the options in the select box
            $("#formAllowed_selectBox").empty();
            if(allForms)
            {
                for(var y=0; y<allForms.length;y++)
                {
                    if(allowed_requests.includes(allForms[y].formName))
                        formAllowed_selectBox.options[formAllowed_selectBox.options.length] = new Option(allForms[y].formName, allForms[y].formName,false,true);
                    else
                        formAllowed_selectBox.options[formAllowed_selectBox.options.length] = new Option(allForms[y].formName, allForms[y].formName,false,false);

                }
                
            }

        approver_name_input.value = row_info[2];
        approver_UWID_input.value = row_info[3];
        approver_email_input.value = row_info[4];
        approver_limit_input.value = row_info[6];

        if(row_info[8].search("Yes") > -1)
            approver_PI_input.selectedIndex = "1";
        else if (row_info[8].search("No") > -1)
            approver_PI_input.selectedIndex = "2";     

    }else
    {
        approver_name_input.value = "";
        approver_UWID_input.value = "";
        approver_email_input.value = "";
        approver_limit_input.value = "";

        const allForms = getAllFormInformation();
        //remove all the options in the select box
        $("#formAllowed_selectBox").empty();
        if(allForms)
        {
            for(var y=0; y<allForms.length;y++)
                formAllowed_selectBox.options[formAllowed_selectBox.options.length] = new Option(allForms[y].formName, allForms[y].formName);      
        }

        approver_PI_input.selectedIndex = "0";


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
function add_SubUnit_SubUnit_overview()
{
    if(!subunit_overview_input_validator())
    {
        if(add_subUnit(subUnit_name_input.value))
        {
            toastr.success(`Subunit ${subUnit_name_input.value} added to ${window.sessionStorage.getItem("unitName")}`, 'Success', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            clear_Information_Subunit_overview();
            update_Subunit_overview_table();
        }
    }
}

function update_SubUnit_SubUnit_overview()
{
    if(selected_row_subunit_over_view > -1)
    {
        const selected_row_info = subunit_over_view_table.row( selected_row_subunit_over_view ).data();
        const newName = subUnit_name_input.value;

        if(update_SubUnit_name(selected_row_info[0],newName))
        {
            toastr.success(`Subunit name successfully updated`, 'Success', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            clear_Information_Subunit_overview();
            update_Subunit_overview_table();
        }
    }
}

function remove_SubUnit_SubUnit_overview()
{
    if(selected_row_subunit_over_view > -1)
    {
        const selected_row_info = subunit_over_view_table.row( selected_row_subunit_over_view ).data();

        if(remove_subunit(selected_row_info[0]))
        {
            toastr.success(`Subunit ${selected_row_info[1]} successfully removed`, 'Success', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            clear_Information_Subunit_overview();
            update_Subunit_overview_table();
        }
    }
}


function clear_Information_Subunit_overview()
{
    subUnit_name_input.value = "";
    subUnit_name_input_error.innerHTML = "";

    if(selected_row_subunit_over_view > -1)
    {
        subunit_over_view_table.rows('.selected').nodes().to$().removeClass( 'selected' );
        selected_row_subunit_over_view = -1;
    }

    
    add_btn_hide_unhide_logic_Subunit_overview();
    update_btn_hide_unhide_logic_Subunit_overview();
    remove_btn_hide_unhide_logic_Subunit_overview();

    //clear all the information in Subunit fields and hide the buttons and clear all the information in the table
    clear_Infomraiton_Submitter_overview();
    hide_all_btns_logic_Submitter_overview();
    clear_and_initialize_Submitters_overview_table();

    clear_Infomraiton_Budget_overview();
    hide_all_btns_logic_budget_overview();
    clear_and_initialize_Budget_overview_table();

    clear_Infomraiton_Approver_overview();
    clear_and_initialize_Approvers_overview_table();


}

function add_user_Submitter_overview()
{
    if(!submitter_overview_input_validator())
    {
        
        const reurn_value = add_user_to_user_table(submitters_name_input.value,submitter_email_input.value,submitter_UWID_input.value);

        if(reurn_value)
            if(add_user_to_submitter_list(reurn_value,subunit_info[selected_row_subunit_over_view]._id))
            {
                toastr.success(`${submitters_name_input.value} added to ${subunit_info[selected_row_subunit_over_view].subUnitName} as a submitter`, 'Success', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                clear_Information_Subunit_overview();
                update_Subunit_overview_table();  
            }     
    }
}

function update_user_Submitter_overview()
{
    if(!submitter_overview_input_validator())
    {
        var old_email = submitter_over_view_table.row( selected_row_submitter_over_view ).data()[4];
        var old_UWID = submitter_over_view_table.row( selected_row_submitter_over_view ).data()[3];
        var verified = submitter_over_view_table.row( selected_row_submitter_over_view ).data()[5];
        var name = submitters_name_input.value;
        var newEmail = submitter_email_input.value;
        var newUWID = submitter_UWID_input.value;
        var profilePic = submitter_over_view_table.row( selected_row_submitter_over_view ).data()[6];

        if(update_user_information(old_email,old_UWID,name,newEmail,newUWID,profilePic,verified))
        {
            toastr.success(`User information successfully updated`, 'Success', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            clear_Information_Subunit_overview();
            update_Subunit_overview_table();  
        } 
    }
    
    
}

function remove_user_Submitter_overview()
{
    if(selected_row_submitter_over_view > -1)
    {
        const userID = submitter_over_view_table.row( selected_row_submitter_over_view ).data()[0];
        const userName = submitter_over_view_table.row( selected_row_submitter_over_view ).data()[2];
        const subUnitID = subunit_info[selected_row_subunit_over_view]._id;
        const subUnitName = subunit_info[selected_row_subunit_over_view].subUnitName;
        
        if(remove_user_to_submitter_list(userID,subUnitID))
        {
            //if(remove_user_from_user_table(userID))
            //{
                toastr.success(`${userName} successfully removed from ${subUnitName} subunit`, 'Success', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                clear_Information_Subunit_overview();
                update_Subunit_overview_table();  
            //}         
        }

    }else
    {
        toastr.warning('Select a user to delete', 'Warning', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
    } 
    
}

function clear_Infomraiton_Submitter_overview()
{
    submitters_name_input.value = "";
    submitters_name_input_error.innerHTML = "";

    submitter_email_input.value = "";
    submitter_email_input_error.innerHTML = "";

    submitter_UWID_input.value = "";
    submitter_UWID_input_error.innerHTML = "";

    if(selected_row_submitter_over_view > -1)
    {
        submitter_over_view_table.rows('.selected').nodes().to$().removeClass( 'selected' );
        selected_row_submitter_over_view = -1;
        add_btn_hide_unhide_logic_Submitter_overview();
        update_btn_hide_unhide_logic_Submitter_overview();
        remove_btn_hide_unhide_logic_Submitter_overview();

    }
    
   
}

function clear_Infomraiton_Budget_overview()
{
    if(selected_row_budget_over_view > -1)
    {
        budget_over_view_table.rows('.selected').nodes().to$().removeClass( 'selected' );
        selected_row_budget_over_view = -1;
        remove_btn_hide_unhide_logic_budget_overview();
    }

    
}

function clear_Infomraiton_Approver_overview()
{
    approver_name_input.value = "";
    approver_name_input_error.innerHTML = "";

    approver_email_input.value = "";
    approver_email_input_error.innerHTML = "";

    approver_UWID_input.value = "";
    approver_UWID_input_error.innerHTML = "";

    approver_limit_input.value = "";
    approver_limit_input_error.innerHTML = "";

    approver_PI_input.selectedIndex = "0";
    approver_PI_input_error.innerHTML="";

    //clearing out selection box and loading all the types of forms from the backend
    const allForms = getAllFormInformation();
    //remove all the options in the select box
    $("#formAllowed_selectBox").empty();
    if(allForms)
    {
        for(var y=0; y<allForms.length;y++)
            formAllowed_selectBox.options[formAllowed_selectBox.options.length] = new Option(allForms[y].formName, allForms[y].formName);      
    }
    approver_allowedRequests_input_error.innerHTML = "";

    if(selected_row_approvers_over_view > -1)
    {
        approvers_over_view_table.rows('.selected').nodes().to$().removeClass( 'selected' );
        selected_row_approvers_over_view = -1;
        add_btn_hide_unhide_logic_Approvers_overview();
        update_btn_hide_unhide_logic_Approver_overview();
        remove_btn_hide_unhide_logic_Approver_overview();
        //hide_all_btns_logic_approver_overview();
    }


  
}


function RemoveBudget_button()
{
    //get selected row, so we can get the budgert number
    const selected_row_info = budget_over_view_table.row( selected_row_budget_over_view ).data();
    const subUnitID = subunit_info[selected_row_subunit_over_view]._id;

    console.log(selected_row_info);

    var onSuccess = function(data)
    {
        if(data.status == false)
        {
            toastr.error(data.data, 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });

        }   
        else
        {
            toastr.success(`Sucessfully removed Budget ${selected_row_info[0]}`, 'Success', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            clear_Information_Subunit_overview();
            update_Subunit_overview_table();  
        }
            
        
    }

    //this function will be called when data exchange with backend occured an error
    var onFaliure = function()
    {
        toastr.error('Backend error occured while removing Budget. Please try again', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        return_value = false;
    }

    makeGetRequest("removeBudget/"+subUnitID+"/"+selected_row_info[0],onSuccess,onFaliure);

}

function modalTable_checkBox_click_event(selected_index,DOM_element)
{
    
    if(DOM_element.checked)
        selected_rows_modal_budget_table.push(selected_index);
    else
     selected_rows_modal_budget_table.splice(selected_rows_modal_budget_table.indexOf(selected_index), 1);


    if(selected_rows_modal_budget_table.length <= 0)

        updateSubUnit_with_budgets_btn.disabled = true;     
    else
        updateSubUnit_with_budgets_btn.disabled = false; 

}

function addNewBudgets_button()
{
    if(!modal_budgets_table)
        initialize_table();
    update_allBudgets_table();
}

function update_allBudgets_table()
{
    
    const results = (get_all_budgets_under_Unit()).data;
    if(results)
    {
        modal_budgets_table.clear().destroy();
        for(var x=0;x<results.length;x++)
            modal_budgets_table_body.appendChild(prepare_all_budget_table_rows(results[x]._id,results[x].BudgetNumber,results[x].BudgetName,results[x].StartDate,results[x].EndDate,x));
        
        initialize_table();    
    }
}

function updateSubUnit_with_budgets()
{
    const subunitID = subunit_info[selected_row_subunit_over_view]._id;
    var budgets_array = [];
    for(var x=0;x<selected_rows_modal_budget_table.length;x++)
    {
        var table_data = modal_budgets_table.row( selected_rows_modal_budget_table[x] ).data();
        budgets_array.push({"budgetNumber":table_data[2],"budgetName":table_data[3], "startDate":table_data[4], "endDate":table_data[5], "approvers":[], "approvalLogic":""})
    }
        
   upload_budgets_to_subunit(budgets_array, subunitID);
   modal_budgets_table .rows().remove().draw();
   //and remove all the elements from the array of selected rows
   selected_rows_modal_budget_table.splice(0,selected_rows_modal_budget_table.length);
}

function modal_close_btn_logic()
{
    setTimeout(function(){
    
    clear_Information_Subunit_overview();
    update_Subunit_overview_table();
    modal_budgets_table.clear().destroy();
    modal_budgets_table = null;  
    
 
    updateSubUnit_with_budgets_btn_.disabled = true;
    },500);

}

function add_user_Approver_overview()
{
    

    if(!approver_overview_input_validator())
    {
        const reurn_value = add_user_to_user_table(approver_name_input.value,approver_email_input.value,approver_UWID_input.value);

        if(reurn_value)
        {
            var PI = false;
            if(approver_PI_input.selectedIndex == "1")
                PI = true;
            else if (approver_PI_input.selectedIndex == "2")
                PI = false;

            var limit = null;
            if(approver_limit_input.value.trim() == "")
                limit = null;
            else
                limit = Number(approver_limit_input.value).toFixed(2);

            var allowed_requests_fetched = $("#formAllowed_selectBox").val();

            var BudgetNumber_fetched = subunit_info[selected_row_subunit_over_view].BudgetTable[selected_row_budget_over_view].budgetNumber;
            var subunitID = subunit_info[selected_row_subunit_over_view]._id;

            addApprover_to_subUnit(PI,reurn_value,limit,allowed_requests_fetched,subunitID,BudgetNumber_fetched);
            clear_Information_Subunit_overview();
            update_Subunit_overview_table();  
              
        }
  
    }

}

function remove_user_Approver_overview()
{
    
    if(selected_row_approvers_over_view > -1)
    {
        const userID = approvers_over_view_table.row( selected_row_approvers_over_view ).data()[0];
        const subUnitID = subunit_info[selected_row_subunit_over_view]._id;
        const budgetNumber = budget_over_view_table.row( selected_row_budget_over_view ).data()[0];

        const userName = approvers_over_view_table.row( selected_row_approvers_over_view ).data()[2];
        const subUnitName = subunit_info[selected_row_subunit_over_view].subUnitName;
        
        if(remove_user_from_approvers(userID,subUnitID,budgetNumber))
        {
            //if(remove_user_from_user_table(userID))
            //{
                toastr.success(`${userName} successfully removed from ${subUnitName} subunit`, 'Success', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                clear_Information_Subunit_overview();
                update_Subunit_overview_table();  
            //}         
        }

    }else
    {
        toastr.warning('Select a user to delete', 'Warning', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
    } 
}


function update_user_Approver_overview()
{
    if(!approver_overview_input_validator())
    {
        var old_email = approvers_over_view_table.row( selected_row_approvers_over_view ).data()[4];
        var old_UWID = approvers_over_view_table.row( selected_row_approvers_over_view ).data()[3];
        var verified = approvers_over_view_table.row( selected_row_approvers_over_view ).data()[5];
        var name = approver_name_input.value;
        var newEmail = approver_email_input.value;
        var newUWID = approver_UWID_input.value;
        var profilePic = approvers_over_view_table.row( selected_row_approvers_over_view ).data()[9];
        var userID_ = approvers_over_view_table.row( selected_row_approvers_over_view ).data()[0];

        if(update_user_information(old_email,old_UWID,name,newEmail,newUWID,profilePic,verified))
        {
            var PI = false;
            if(approver_PI_input.selectedIndex == "1")
                PI = true;
            else if (approver_PI_input.selectedIndex == "2")
                PI = false;

            var limit = null;
            if(approver_limit_input.value.trim() == "")
                limit = null;
            else
                limit = Number(approver_limit_input.value).toFixed(2);

            var allowed_requests_fetched = $("#formAllowed_selectBox").val();
            var subUnitID_ = subunit_info[selected_row_subunit_over_view]._id;
            var BudgetNumber_ = subunit_info[selected_row_subunit_over_view].BudgetTable[selected_row_budget_over_view].budgetNumber;

            if(update_approver_information(userID_,limit,allowed_requests_fetched,PI,subUnitID_,BudgetNumber_))
            {
                toastr.success(`User information successfully updated`, 'Success', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                clear_Information_Subunit_overview();
                update_Subunit_overview_table();  
            }

        } 
    }
    
    
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
        const subUnitID_ = subunit_info[selected_row_subunit_over_view]._id;
        const budgetNumber_ = subunit_info[selected_row_subunit_over_view].BudgetTable[selected_row_budget_over_view].budgetNumber;
        ApproversSelectBox_input_error.innerHTML = "";
        if(update_approval_logic(subUnitID_,budgetNumber_,approval_String))
        {
            clear_Information_Subunit_overview();
            update_Subunit_overview_table();  
            $('#approval_logic_modal').modal('hide');
        }
            
    }
        

}




//----------------------- End of Button Click Events -------------------------------------------------------------------------

//----------------------- Button Hide/Unhide logic ----------------------------------------------------------------------------
function add_btn_hide_unhide_logic_Subunit_overview()
{
    if(selected_row_subunit_over_view > -1)
    {
        const row_info = subunit_over_view_table.row( selected_row_subunit_over_view ).data();

        if(row_info[1] == subUnit_name_input.value)
            ManageSubUnit_addBtn.disabled = true;
        else
            ManageSubUnit_addBtn.disabled = false;
    }else
        ManageSubUnit_addBtn.disabled = false; 
}

function update_btn_hide_unhide_logic_Subunit_overview()
{
    if(selected_row_subunit_over_view > -1)
    {
        const row_info = subunit_over_view_table.row( selected_row_subunit_over_view ).data();

        if(row_info[1] == subUnit_name_input.value)
            ManageSubUnit_updateBtn.disabled = true;
        else
            ManageSubUnit_updateBtn.disabled = false;
    }else
        ManageSubUnit_updateBtn.disabled = true; 
}

function remove_btn_hide_unhide_logic_Subunit_overview()
{
    if(selected_row_subunit_over_view > -1)
        ManageSubUnit_removeBtn.disabled = false;
    else
        ManageSubUnit_removeBtn.disabled = true;
}

function hide_all_btns_logic_Submitter_overview()
{
    submitter_clearBtn.disabled = true;
    submitter_removeBtn.disabled = true;
    submitter_updateBtn.disabled = true;
    submitter_addBtn.disabled = true;
}

function unhide_all_btns_logic_Submitter_overview()
{
    submitter_clearBtn.disabled = false;
    submitter_removeBtn.disabled = false;
    submitter_updateBtn.disabled = false;
    submitter_addBtn.disabled = false;
}

function add_btn_hide_unhide_logic_Submitter_overview()
{
    if(selected_row_submitter_over_view > -1)
    {
        const row_info = submitter_over_view_table.row( selected_row_submitter_over_view ).data();

        if(row_info[3] == submitter_UWID_input.value || row_info[4] == submitter_email_input.value)
            submitter_addBtn.disabled = true;
        else
            submitter_addBtn.disabled = false;
    }else
        submitter_addBtn.disabled = false; 
}

function update_btn_hide_unhide_logic_Submitter_overview()
{
    if(selected_row_submitter_over_view > -1)
    {
        const row_info = submitter_over_view_table.row( selected_row_submitter_over_view ).data();

        if(row_info[2] == submitters_name_input.value && row_info[3] == submitter_UWID_input.value && row_info[4] == submitter_email_input.value)
            submitter_updateBtn.disabled = true;
        else
            submitter_updateBtn.disabled = false;
    }else
        submitter_updateBtn.disabled = true; 
}

function remove_btn_hide_unhide_logic_Submitter_overview()
{
    if(selected_row_submitter_over_view > -1)
        submitter_removeBtn.disabled = false;
    else
        submitter_removeBtn.disabled = true;
}

function hide_all_btns_logic_budget_overview()
{
    budget_removeBtn.disabled = true;
    budget_addBtn.disabled = true;
}

function unhide_all_btns_logic_budget_overview()
{
    budget_removeBtn.disabled = false;
    budget_addBtn.disabled = false;
}

function remove_btn_hide_unhide_logic_budget_overview()
{

    if(selected_row_budget_over_view > -1)
        budget_removeBtn.disabled = false;
    else
        budget_removeBtn.disabled = true;
}

function hide_all_btns_logic_approver_overview()
{
    approvers_removeBtn.disabled = true;
    approvers_updateBtn.disabled = true;
    approvers_addBtn.disabled = true;
    approvers_clearBtn.disabled = true;
}

function unhide_all_btns_logic_approver_overview()
{
    approvers_removeBtn.disabled = false;
    approvers_updateBtn.disabled = false;
    approvers_addBtn.disabled = false;
    approvers_clearBtn.disabled = false;
}

function add_btn_hide_unhide_logic_Approvers_overview()
{
    if(selected_row_approvers_over_view > -1)
    {
        const row_info = approvers_over_view_table.row( selected_row_approvers_over_view ).data();

        if(row_info[3] == approver_UWID_input.value || row_info[4] == approver_email_input.value )
            approvers_addBtn.disabled = true;
        else
            approvers_addBtn.disabled = false;
    }else
        approvers_addBtn.disabled = false; 
}


function update_btn_hide_unhide_logic_Approver_overview()
{
    
    if(selected_row_approvers_over_view > -1)
    {
        const row_info = approvers_over_view_table.row( selected_row_approvers_over_view ).data();
        var row_is_PI = 1; //1 means yes, 2 means no
        var is_PI_status = false;
        var cardInfo = row_info[7].split("<br>").filter(e=>e!="");
        var selected_options = $('#formAllowed_selectBox').val();
        var isSimilar = true;

        if(selected_options.toString() == cardInfo.toString())
            isSimilar = true;
        else
            isSimilar = false;

        if(row_info[8] == "Yes")
            row_is_PI = 2;
        else
            row_is_PI = 1;

        if(approver_PI_input.selectedIndex == row_is_PI)
            is_PI_status = false;
        else
            is_PI_status = true;

        if(row_info[2] == approver_name_input.value && row_info[3] == approver_UWID_input.value && row_info[4] == approver_email_input.value && row_info[6] == approver_limit_input.value && isSimilar && is_PI_status)
            approvers_updateBtn.disabled = true;
        else
            approvers_updateBtn.disabled = false;
    }else
        approvers_updateBtn.disabled = true; 
}

function remove_btn_hide_unhide_logic_Approver_overview()
{
    if(selected_row_approvers_over_view > -1)
        approvers_removeBtn.disabled = false;
    else
        approvers_removeBtn.disabled = true;
}

//----------------------- End of Button Hide/Unhide logic ---------------------------------------------------------------------

// ------------------------ Table Information clearing function ---------------------------------------------------------------
function clear_and_initialize_SubUnit_overview_table()
{
    selected_row_subunit_over_view = -1;
    subunit_over_view_table.clear().destroy();
    initialize_Subunit_overview_table();
}

function clear_and_initialize_Submitters_overview_table()
{
    selected_row_submitter_over_view = -1;
    submitter_over_view_table.clear().destroy();
    initialize_submitter_overview_table();
}

function clear_and_initialize_Budget_overview_table()
{
    selected_row_budget_over_view = -1;
    budget_over_view_table.clear().destroy();
    initialize_budget_overview_table();
}

function clear_and_initialize_Approvers_overview_table()
{
    selected_row_approvers_over_view = -1;
    approvers_over_view_table.clear().destroy();
    initialize_approvers_overview_table();
}
// ------------------------ End of Table Information clearing function --------------------------------------------------------

//----------------------- Table Click events ----------------------------------------------------------------------------------

//subunit overiew table
$('#subunit_names_table tbody').on( 'click', 'tr', function () {

    //reset selected index of all the table to -1
    selected_row_submitter_over_view = -1;
    selected_row_budget_over_view = -1;
    selected_row_approvers_over_view = -1;

    //approver overviewsection
    hide_all_btns_logic_approver_overview();

    //table row highlight code
    if ( $(this).hasClass('selected') ) 
    {
        $(this).removeClass('selected');
        selected_row_subunit_over_view = -1;
        //if not selected we just destroy the table and reinitialize it
        budget_over_view_table.clear().destroy();
        initialize_budget_overview_table();
        //if not selected we just destroy the table and reinitialize it
        submitter_over_view_table.clear().destroy();
        initialize_submitter_overview_table();
        //if not selected we just destroy the table and reinitialize it
        approvers_over_view_table.clear().destroy();
        initialize_approvers_overview_table();

        //Submitter overview section
        clear_Infomraiton_Submitter_overview();
        hide_all_btns_logic_Submitter_overview();

        //Budget overview section
        hide_all_btns_logic_budget_overview();

        

    }
    else 
    {
        subunit_over_view_table.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        selected_row_subunit_over_view = subunit_over_view_table.row( this ).index();
        //updating budget table
        update_Budget_overview_table();
        update_Submitters_overview_table();
        //we need to clear out the approvers table when clicking into different row in submitters table
        approvers_over_view_table.clear().destroy();
        initialize_approvers_overview_table();

        //Submitter overview section
        unhide_all_btns_logic_Submitter_overview();
        add_btn_hide_unhide_logic_Submitter_overview();
        update_btn_hide_unhide_logic_Submitter_overview();
        remove_btn_hide_unhide_logic_Submitter_overview();
        
        //Budget overview section
        unhide_all_btns_logic_budget_overview();
        remove_btn_hide_unhide_logic_budget_overview();

        
    }

    fill_form_elements_Subunit_overview(selected_row_subunit_over_view);
    add_btn_hide_unhide_logic_Subunit_overview();
    update_btn_hide_unhide_logic_Subunit_overview();
    remove_btn_hide_unhide_logic_Subunit_overview();

} );

//Submitters overview table
$('#submitters_overview_table tbody').on( 'click', 'tr', function () {
    //table row highlight code
    if ( $(this).hasClass('selected') ) 
    {
        $(this).removeClass('selected');
        selected_row_submitter_over_view= -1;
    }
    else 
    {
        submitter_over_view_table.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        selected_row_submitter_over_view = submitter_over_view_table.row( this ).index();
        
    }

    fill_form_elements_Submitters_overview(selected_row_submitter_over_view);
    add_btn_hide_unhide_logic_Submitter_overview();
    update_btn_hide_unhide_logic_Submitter_overview();
    remove_btn_hide_unhide_logic_Submitter_overview();

} );

//Budget overview table
$('#budget_overview_table tbody').on( 'click', 'tr', function () {
    //table row highlight code
    clear_Infomraiton_Approver_overview();
    if ( $(this).hasClass('selected') ) 
    {
        $(this).removeClass('selected');
        selected_row_budget_over_view= -1;
        //if not selected we just destroy the table and reinitialize it
        approvers_over_view_table.clear().destroy();
        initialize_approvers_overview_table();
        hide_all_btns_logic_approver_overview();
        
    }
    else 
    {
        budget_over_view_table.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        selected_row_budget_over_view = budget_over_view_table.row( this ).index();
        update_Approvers_overview_table();
        fill_allowed_requests_options();
        unhide_all_btns_logic_approver_overview();
        add_btn_hide_unhide_logic_Approvers_overview();
        update_btn_hide_unhide_logic_Approver_overview();
        remove_btn_hide_unhide_logic_Approver_overview();

        
    }

    remove_btn_hide_unhide_logic_budget_overview();

} );


//Budget overview table double click evebt
$('#budget_overview_table tbody').on( 'dblclick', 'tr', function () {
    if ( $(this).hasClass('selected') ) 
    {
        if(subunit_info[selected_row_subunit_over_view].BudgetTable[selected_row_budget_over_view].approvers.length > 0)
        {
            Approval_logic_list_box_disable_enable(true);
            fill_ApproverSelect_box_with_approvers();
            //during the first pop up, reset everything to default
            ApproversSelectBox_input_error.innerHTML = "";
            AllCheckBox.checked = false;
            AnyoneCheckBox.checked = false;
            AdvancedCheckBox.checked = false;
            Approval_logic_list_box_disable_enable(true);
            prepare_current_approval_logic_string();
            $("#approval_logic_modal").modal();

        }

    }
    

} );

function prepare_current_approval_logic_string()
{
    const all_approvers = ApproversSelectBox.options;
    const currentApproval_logic_string  = subunit_info[selected_row_subunit_over_view].BudgetTable[selected_row_budget_over_view].approvalLogic;
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
function initialize_Subunit_overview_table()
{
    subunit_over_view_table = $('#subunit_names_table').DataTable(  {
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

function initialize_submitter_overview_table()
{
    submitter_over_view_table = $('#submitters_overview_table').DataTable(  {
        "columnDefs": [
            {
                "targets": [ 0 ],
                "visible": false,
                "searchable": false
            },
            {
                "targets": [ 6 ],
                "visible": false,
                "searchable": false
            }

        ],
        "lengthMenu": [[5, 10, 20, -1], [5, 10, 20, "All"]]
    });
}

function initialize_budget_overview_table()
{
    budget_over_view_table = $('#budget_overview_table').DataTable(  {
        "columnDefs": [
            {
                "targets": [ 4 ],
                "visible": false,
                "searchable": false
            }
        ],
        "lengthMenu": [[5, 10, 20, -1], [5, 10, 20, "All"]]
    });
}

function initialize_approvers_overview_table()
{
    approvers_over_view_table = $('#approvers_overview_table').DataTable(  {
        "columnDefs": [
            {
                "targets": [ 0 ],
                "visible": false,
                "searchable": false
            },
            {
                "targets": [ 9 ],
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
function getAll_Subunits_under_Unit()
{
    var return_value = null;
    var onSuccess = function(data)
    {
        if(data.status == false)
        {
            toastr.error('Backend error occured while fetching Subunit information. Please try again', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            return_value = null;
        }   
        else
            return_value = data.data;
        
    }

    //this function will be called when data exchange with backend occured an error
    var onFaliure = function()
    {
        toastr.error('Backend error occured while fetching Subunit information. Please try again', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        return_value = null;
    }

    makeGetRequest("subunitsinUnit/"+window.sessionStorage.getItem("unitID"),onSuccess,onFaliure);
    return return_value;
}


function get_user_information_given_ID(userID)
{
    var return_value = null;
    var onSuccess = function(data)
    {
        if(data.status == false)
        {
            toastr.error('Backend error occured while fetching user information. Please try again', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            return_value = null;
        }   
        else
            return_value = data.data;
        
    }

    //this function will be called when data exchange with backend occured an error
    var onFaliure = function()
    {
        toastr.error('Backend error occured while fetching user information. Please try again', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        return_value = null;
    }

    makeGetRequest("users/"+userID,onSuccess,onFaliure);
    return return_value;
}

function add_subUnit(SubUnit_name)
{
    var SubUnit_JSON = {

    "subUnitName": SubUnit_name,
    "Submitters_IDs": [],
    "UnitID_ref":window.sessionStorage.getItem("unitID"),
    "BudgetTable": [] 
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

    makePostRequest("subunits",SubUnit_JSON,onSuccess,onFaliure);

    return return_value;
}


function update_SubUnit_name(SubUnitID,newName)
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

    makePutRequest_NoBody("subunits/"+SubUnitID+"/"+newName,onSuccess,onFaliure);

    return return_value;   
}


function remove_subunit(SubUnitID)
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
        toastr.error('Backend error occured while removing Subunit. Please try again', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        return_value = false;
    }

    makeDeleteRequest("subunits/"+SubUnitID,onSuccess,onFaliure);
    return return_value;    
}


function add_user_to_user_table(name,email,UWID)
{
    var user_JSON = {

        "Name": name,
        "email": email,
        "UWID":UWID,
        "profile_imageURL":"",
        "verified_user":false
    }

    var return_value = null;
    var onSuccess = function(data)
    {
        if(data.status == false)
        {
            if(data.data.Name == user_JSON.Name)
            return_value =  data.data._id;
        else
        {
            toastr.error('User with same UWID or Email already exists', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            return_value =  null;
        }

        }else
        {
            return_value =  data.data._id;
        }

    }

    //this function will be called when data exchange with backend occured an error
    var onFaliure = function()
    {
        toastr.error('Internal server error has occured. Please try again', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        return_value =  null;
    }

    makePostRequest("users",user_JSON,onSuccess,onFaliure);

    return return_value;
}


function add_user_to_submitter_list(UserID, SubunitID)
{
    var submitter_JSON = {

        "Submitters_IDs": [UserID]
    }

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

    makePostRequest("submitters/"+SubunitID,submitter_JSON,onSuccess,onFaliure);

    return return_value; 
}

function update_user_information(old_email,old_UWID,name,newEmail,newUWID,profilePic,verified)
{
    var return_value = null;

    var isVerfied = false;


    if(verified == "Yes")
        isVerfied = true;
    else
        isVerfied = false;


    const JSON_obj = {
        "Name": name,
        "email": newEmail,
        "UWID": newUWID,
        "profile_imageURL": profilePic,
        "verified_user": isVerfied
    }


    
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

    makePutRequest("users/"+old_email+"/"+old_UWID,JSON_obj,onSuccess,onFaliure);
    
    return return_value;
}

function remove_user_from_user_table(UserID)
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

    makeDeleteRequest("users/"+UserID,onSuccess,onFaliure);

    return return_value;
}


function remove_user_to_submitter_list(UserID, SubunitID)
{
    var submitter_JSON = {

        "Submitters_IDs": [UserID]
    }

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

    makePostRequest("Removesubmitters/"+SubunitID,submitter_JSON,onSuccess,onFaliure);

    return return_value; 
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


function upload_budgets_to_subunit(AllBudgets, SubunitID)
{
    var AllBudgets_to_post = {

        "budgets": AllBudgets
    }

    var return_value = false;
    var onSuccess = function(data)
    {
        if(data.status == false)
        {
            toastr.error(data.data, 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            return_value =  false;
        }else
        {
            toastr.success("Budgets were successfully added to the subunit", 'Success', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            return_value =  true;
        }

    }

    //this function will be called when data exchange with backend occured an error
    var onFaliure = function()
    {
        toastr.error('Internal server error has occured. Please try again', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        return_value =  false;
    }

    makePostRequest("addNewBudgets/"+SubunitID,AllBudgets_to_post,onSuccess,onFaliure);

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


function addApprover_to_subUnit(PI, ID, limit, allowedRequests, SubunitID, budgetID)
{
    var approvers_JSON = {

        "approvers": [{"ID":ID, "limit":limit, "allowedRequests":allowedRequests, "PI":PI }]
    }

    var onSuccess = function(data)
    {
        if(data.status == false)
        {
            toastr.error(data.data, 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        }else
        {
            toastr.success("Approver successfully added to the budget", 'Success', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        }

    }

    //this function will be called when data exchange with backend occured an error
    var onFaliure = function()
    {
        toastr.error('Internal server error has occured. Please try again', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        return_value =  false;
    }

    makePostRequest("approvers/"+SubunitID+"/"+budgetID,approvers_JSON,onSuccess,onFaliure);


}


function remove_user_from_approvers(UserID,subunitID,budgetID)
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

    makeDeleteRequest("approvers/"+subunitID+"/"+budgetID+"/"+UserID,onSuccess,onFaliure);

    return return_value;
}


function update_approver_information(approverID,limit,allowedRequests,PI,SubunitID,BudgetNumber)
{
    var return_value = null;


    const JSON_obj = {
        "ID":approverID,
        "limit": limit,
        "allowedRequests": allowedRequests,
        "PI": PI
    }

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

    makePutRequest("approvers/"+SubunitID+"/"+BudgetNumber,JSON_obj,onSuccess,onFaliure);
    
    return return_value;
}


function update_approval_logic(SubunitID,BudgetNumber,approvalLogic_string)
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
            toastr.success(`Approval logic successfully updated for budget number ${BudgetNumber}`, 'Success', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            return_value =  true;
        }

    }

    //this function will be called when data exchange with backend occured an error
    var onFaliure = function()
    {
        toastr.error('Internal server error has occured. Please try again', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        return_value =  false;
    }

    makePutRequest_NoBody("approvalLogic/"+SubunitID+"/"+BudgetNumber+"/"+approvalLogic_string,onSuccess,onFaliure);

    return return_value;  
}

//----------------------- End of API functions to talk to backend ---------------------------------------------