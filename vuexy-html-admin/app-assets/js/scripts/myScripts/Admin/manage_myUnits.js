//keep track of the staff oever view table
var staff_over_view_table = null;
//keep track of selected row in manage my Unit table
var selected_row = -1;

var name_comp = document.getElementById("name_staff_overview");
var UWID_comp = document.getElementById("uw_ID_staff_overview");
var email_comp = document.getElementById("email_staff_overview");
var accesslevel_comp = document.getElementById("accessLevel_staff_overview");
var addBtn = document.getElementById("ManageUnit_addBtn");

var nameError = document.getElementById("nameErrorField");
var UWIDError = document.getElementById("UWIDErrorField");
var EmailError = document.getElementById("emailErrorField");
var accessLevelError = document.getElementById("accessLevelErrorField");

var Manage_unit_name_field = document.getElementById("Manage_unit_name_field");
var ManageUnitNameUpdate_btn = document.getElementById("ManageUnitNameUpdate");

var staff_table_body = document.getElementById("staff_overview_table_body");

var formVisiblity_table_body = document.getElementById("formVisiblity_table_body");

window.onload = function()
{
    update_staff_overview_table();
    initialize_table();

    manage_Unit_addBtn_hide_unhide();
    manage_Unit_removeBtn_hide_unhide();
    manage_Unit_updateBtn_hide_unhide();
    fill_Manage_Unit_name_field();
    Manage_unit_name_button_hide_unhide_logic();

    update_FormVisibility_table();
}



//onlick event for staff overview table
$('#staff_overview_table tbody').on( 'click', 'tr', function () {
    //table row highlight code
    if ( $(this).hasClass('selected') ) 
    {
        $(this).removeClass('selected');
        selected_row = -1;
    }
    else 
    {
        staff_over_view_table.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        selected_row = staff_over_view_table.row( this ).index();
        
    }

    fill_form_staff_overview_table(selected_row);
    manage_Unit_addBtn_hide_unhide();
    manage_Unit_removeBtn_hide_unhide();
    manage_Unit_updateBtn_hide_unhide();

} );



function initialize_table()
{
    staff_over_view_table = $('#staff_overview_table').DataTable(  {
        "columnDefs": [
            {
                "targets": [ 0 ],
                "visible": false,
                "searchable": false
            },
            {
                "targets": [ 7 ],
                "visible": false,
                "searchable": false
            }
        ],
        "lengthMenu": [[5, 10, 20, -1], [5, 10, 20, "All"]]
    });
}

function update_staff_overview_table()
{
    var onSuccess = function(data)
    {
        for(var x=0;x<data.data.length;x++)
        {
            
            staff_table_body.appendChild(build_staff_overview_table_row(data.data[x].profileImage_URL,data.data[x].Name,data.data[x].UWID,data.data[x].email,data.data[x].Admin,data.data[x].verified_user,data.data[x]._id));
        }
    }

    //this function will be called when data exchange with backend occured an error
    var onFaliure = function()
    {
        toastr.error('Backend error occured while updating the table', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
    }
    
    makeGetRequest("units/getUserInfomation/"+window.sessionStorage.getItem("unitID"),onSuccess,onFaliure);
}



//clear button logic
function ManageUnit_clearBtn_logic()
{
  clearInformation();

}


//manage unit add button logic
function ManageUnitAdd()
{
    if(validate_input_fields() == false)
    {
        New_User_JSON = {
            "Name": name_comp.value,
            "email": email_comp.value,
            "UWID": UWID_comp.value,
            "profile_imageURL": "",
            "verified_user": false
        }
        

        const server_return_id = addUserto_userTable(New_User_JSON)
        if(server_return_id)
        {
            var adminbool = false;

            if(accesslevel_comp.selectedIndex == 1)
                adminbool = true;
            else
                adminbool = false;

            assign_JSON = {
                "userIDs": [{"ID":server_return_id,"Admin":adminbool}]
            }

            assign_Users_to_Unit(assign_JSON);
            update_and_redraw_staff_overview_table();
            clearInformation();
            toastr.success(New_User_JSON.Name +' successfully added to '+window.sessionStorage.getItem('unitName'), 'Success', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        }
    }


}


function ManageUnitRemove()
{

    if(selected_row > -1)
    {
        const userID = staff_over_view_table.row( selected_row ).data()[0];
        const userName = staff_over_view_table.row( selected_row ).data()[2];
        
        if(remove_user_from_Unit(userID))
        {
            //if(remove_user_from_users_table(userID))
            //{
                toastr.success(`${userName} successfully removed from ${window.sessionStorage.getItem("unitName")} unit`, 'Success', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                update_and_redraw_staff_overview_table();
                clearInformation();
            //}
            

        }

    }else
    {
        toastr.warning('Select a user to delete', 'Warning', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
    }

}

function ManageUnitUpdate()
{
    if(selected_row > -1 && validate_input_fields() == false)
    {
        if(update_user_information())
            if(update_accessLevel_information())
            {
                toastr.success(`Information successfully updated`, 'Success', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                update_and_redraw_staff_overview_table();
                clearInformation();
            }

        
    }


}

function ManageUnitNameUpdate()
{
    const input_value = Manage_unit_name_field.value;
    if(update_Unit_name(input_value))
        window.sessionStorage.setItem("unitName",input_value);
    else
        Manage_unit_name_field.value = window.sessionStorage.getItem("unitName");

    Manage_unit_name_button_hide_unhide_logic();
}

function update_FormVisibility_table()
{
    var onSuccess = function(data)
    {
        for(var x=0;x<data.data.length;x++)
        {
            
            formVisiblity_table_body.appendChild(build_form_visibility_table_row(data.data[x]._id,data.data[x].formName,data.data[x].visible));
        }
    }

    //this function will be called when data exchange with backend occured an error
    var onFaliure = function()
    {
        toastr.error('Backend error occured while updating the table', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
    }
    

    makeGetRequest("formVisibility/"+window.sessionStorage.getItem("unitID"),onSuccess,onFaliure);
}


function checkbox_click_event(DOM_object)
{
   
    var onSuccess = function(data)
    {
        if(data.status == false)
        {
            toastr.error(data.data, 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        }

    }

    //this function will be called when data exchange with backend occured an error
    var onFaliure = function()
    {
        toastr.error('Internal server error has occured. Please try again', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
    }

    makePutRequest_NoBody("formVisibility/"+window.sessionStorage.getItem("unitID")+"/"+DOM_object.id+"/"+DOM_object.checked.toString(),onSuccess,onFaliure);

}



//------------------------------ Helper Functions ---------------------------------------------

function build_form_visibility_table_row(_id, formName, visibility)
{

    var td_formName = document.createElement('td');
    td_formName.innerHTML = formName;

    var td_checkbox_parent = document.createElement('td');

    var checkbox_div = document.createElement('div');
    checkbox_div.setAttribute('class', 'custom-control custom-checkbox ml-50');

    var checkbox_input = document.createElement('input');
    checkbox_input.setAttribute('type','checkbox');
    checkbox_input.setAttribute('id',_id);
    checkbox_input.setAttribute('class','custom-control-input');
    checkbox_input.setAttribute('onclick','checkbox_click_event(this)');

    if(visibility)
        checkbox_input.checked = true;
    else
        checkbox_input.checked = false;

    var label = document.createElement('label');
    label.setAttribute('class','custom-control-label');
    label.setAttribute('for',_id);

    checkbox_div.appendChild(checkbox_input);
    checkbox_div.appendChild(label);
    td_checkbox_parent.appendChild(checkbox_div);

    var tr = document.createElement('tr');
    tr.appendChild(td_formName);
    tr.appendChild(td_checkbox_parent);

    return tr;
    
}


function Manage_unit_name_button_hide_unhide_logic()
{
    //ManageUnitNameUpdate
    if(Manage_unit_name_field.value == window.sessionStorage.getItem("unitName"))
        ManageUnitNameUpdate_btn.disabled = true;
    else
        ManageUnitNameUpdate_btn.disabled = false;
}

function fill_Manage_Unit_name_field()
{
    Manage_unit_name_field.value = window.sessionStorage.getItem("unitName");
}


function update_Unit_name(newUnitName)
{
    var return_value = null;

    
    var onSuccess = function(data)
    {
        if(data.status == false)
        {
            toastr.error(data.data, 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            return_value =  false;
        }else
        { 
            toastr.success(data.data, 'Success', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            return_value =  true;
        }

    }

    //this function will be called when data exchange with backend occured an error
    var onFaliure = function()
    {
        toastr.error('Internal server error has occured. Please try again', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        return_value =  false;
    }

    makePutRequest_NoBody("units/"+window.sessionStorage.getItem("unitID")+"/"+newUnitName,onSuccess,onFaliure);

    return return_value; 
}


function update_accessLevel_information()
{
    var return_value = null;

    var accesslevel_bool = false;
    const userID = staff_over_view_table.row( selected_row ).data()[0];
    
    if(accesslevel_comp.selectedIndex == 1)
        accesslevel_bool = true;
    else
        accesslevel_bool = false;

    
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

    makePutRequest_NoBody("units/"+userID+"/"+accesslevel_bool+"/"+window.sessionStorage.getItem("unitID"),onSuccess,onFaliure);

    return return_value;  
}


function update_user_information()
{
    var return_value = null;

    var isVerfied = false;
    var old_email = staff_over_view_table.row( selected_row ).data()[4];
    var old_UWID = staff_over_view_table.row( selected_row ).data()[3];

    if(staff_over_view_table.row( selected_row ).data()[6] == "Yes")
        isVerfied = true;
    else
        isVerfied = false;

    const JSON_obj = {
        "Name": name_comp.value,
        "email": email_comp.value,
        "UWID": UWID_comp.value,
        "profile_imageURL": staff_over_view_table.row( selected_row ).data()[7],
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

function remove_user_from_users_table(UserID)
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

function remove_user_from_Unit(UserID)
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

    makeDeleteRequest("units/removeUser/"+UserID+"/"+window.sessionStorage.getItem("unitID"),onSuccess,onFaliure);

    return return_value;
}

function update_and_redraw_staff_overview_table()
{
    staff_over_view_table.clear().destroy();
    update_staff_overview_table();
    initialize_table();
}

function validate_input_fields()
{
    String.prototype.isNumber = function(){return /^\d+$/.test(this);}
    var errorFound = false;
    
    if(name_comp.value == "" || name_comp.value == null)
    {
        nameError.innerHTML = "* Name required";
        errorFound = true;
    }        
    else
        nameError.innerHTML = "";
    
        

    if(UWID_comp.value == "" || UWID_comp.value == null)
    {
        UWIDError.innerHTML = "* UW ID required";
        errorFound = true;
    }        
    // else if (!UWID_comp.value.isNumber())
    // {
    //     UWIDError.innerHTML = "* Only digits allowed";
    //     errorFound = true;
    // }
    else
        UWIDError.innerHTML = "";

    if(email_comp.value == "" || email_comp.value == null)
    {
        EmailError.innerHTML = "* Email address required";
        errorFound = true;
    }        
    else if (email_comp.value.includes("@uw.edu") == false)
    {
        EmailError.innerHTML = "* Only UW email adresses allowed";
        errorFound = true;
    }else
        EmailError.innerHTML = "";
    

    if(accesslevel_comp.selectedIndex == 0)
    {
        accessLevelError.innerHTML = "* Access Level required";
        errorFound = true;
    }else
        accessLevelError.innerHTML = "";
    

    if(errorFound)
        return true;
    else
        return false;

}


function build_staff_overview_table_row(profile_pic_url,name,uwID,email,admin,verified,_id)
{
    var _id_ = document.createElement('td');
    _id_.innerHTML = _id;

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

    //name cell
    var td_name = document.createElement('td');
    td_name.innerHTML = name;

    //UWID cell
    var td_uwID = document.createElement('td');
    td_uwID.innerHTML = uwID;

    //email cell
    var td_email = document.createElement('td');
    td_email.innerHTML = email;

    //accesslevel cell
    var td_accessLevel = document.createElement('td');
    var chip = document.createElement('div');
    var chip_body = document.createElement('div');
    chip_body.setAttribute('class','chip-body');
    var chip_text = document.createElement('div');
    chip_text.setAttribute('class','chip-text');
    if(admin)
    {
        chip.setAttribute('class','chip chip-danger');
        chip_text.innerHTML = "Administrator";
    }else
    {
        chip.setAttribute('class','chip chip-success');
        chip_text.innerHTML = "Fiscal Staff";
    }

    chip_body.appendChild(chip_text);
    chip.appendChild(chip_body);
    td_accessLevel.appendChild(chip);

    //verified user
    var td_verfied_user = document.createElement('td');
    if(verified)
        td_verfied_user.innerHTML = "Yes";
    else
        td_verfied_user.innerHTML = "No";

    //profile_pic_url
    var td_profile_pic_url = document.createElement('td');
    td_profile_pic_url.innerHTML = profile_pic_url;


    //tr element
    var tr = document.createElement('tr');
    tr.appendChild(_id_);
    tr.appendChild(td_profile_image);
    tr.appendChild(td_name);
    tr.appendChild(td_uwID);
    tr.appendChild(td_email);
    tr.appendChild(td_accessLevel);
    tr.appendChild(td_verfied_user);
    tr.appendChild(td_profile_pic_url);


    return tr;


}


function fill_form_staff_overview_table(row_index)
{

    if(row_index > -1)
    {
        const row_info = staff_over_view_table.row( row_index ).data();
        name_comp.value = row_info[2];
        UWID_comp.value = row_info[3];
        email_comp.value = row_info[4];
        if(row_info[5].search("Administrator") > -1)
            accesslevel_comp.selectedIndex = "1";
        else if (row_info[5].search("Fiscal Staff") > -1)
            accesslevel_comp.selectedIndex = "2";
    }else
    {
        name_comp.value = "";
        UWID_comp.value = "";
        email_comp.value = "";
        accesslevel_comp.selectedIndex = "0";
    }
    
}


function manage_Unit_addBtn_hide_unhide()
{
    if(selected_row > -1)
    {
        const row_info = staff_over_view_table.row( selected_row ).data();

        if(row_info[3] == UWID_comp.value || row_info[4] == email_comp.value)
         addBtn.disabled = true;
        else
         addBtn.disabled = false;
    }else
        addBtn.disabled = false; 

    

}

function manage_Unit_removeBtn_hide_unhide()
{

    if(selected_row > -1)
        ManageUnit_removeBtn.disabled = false;
    else
        ManageUnit_removeBtn.disabled = true;

}

function manage_Unit_updateBtn_hide_unhide()
{
    const row_info = staff_over_view_table.row( selected_row ).data();
    var table_accessLevel = -1;


    if(selected_row > -1)
    {
        if(row_info[5].search("Administrator") > -1)
            table_accessLevel = 1;
        else if (row_info[5].search("Fiscal Staff") > -1)
            table_accessLevel = 2;
       
        if(row_info[2] == name_comp.value && row_info[3] == UWID_comp.value && row_info[4] == email_comp.value && table_accessLevel == accesslevel_comp.selectedIndex)
            ManageUnit_updateBtn.disabled = true;
        else
            ManageUnit_updateBtn.disabled = false;  
    
    }else
        ManageUnit_updateBtn.disabled = true;


}

//send post request to add a new user to user table
function addUserto_userTable(User_JSON_info)
{
    var return_value = null;
    var onSuccess = function(data)
    {
        if(data.status == false)
        {
            if(data.data.Name == User_JSON_info.Name)
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

    makePostRequest("users",User_JSON_info,onSuccess,onFaliure);
    console.log(return_value);
    return return_value;
}


//send put request to assign a new staff/admin to the given unit
function assign_Users_to_Unit(JSON_data)
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

    makePostRequest("units/"+window.sessionStorage.getItem("unitID"),JSON_data,onSuccess,onFaliure);

    return return_value;

}


function clearInformation()
{
    name_comp.value = "";
    UWID_comp.value = "";
    email_comp.value = "";
    accesslevel_comp.selectedIndex = "0";

    nameError.innerHTML = "";
    UWIDError.innerHTML = "";
    EmailError.innerHTML = "";
    accessLevelError.innerHTML = "";

    staff_over_view_table.rows('.selected').nodes().to$().removeClass( 'selected' );

    selected_row = -1;
    manage_Unit_addBtn_hide_unhide();
    manage_Unit_removeBtn_hide_unhide();
    manage_Unit_updateBtn_hide_unhide();

}




//------------------------------ End Helper Functions -----------------------------------------
