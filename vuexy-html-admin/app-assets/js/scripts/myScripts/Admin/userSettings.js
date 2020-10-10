var name_input = document.getElementById("name_input");
var UWID_input = document.getElementById("UWID_input");
var email_input = document.getElementById("email_input");
var name_input_error = document.getElementById("name_input_error");
var UWID_input_error = document.getElementById("UWID_input_error");
var email_input_error = document.getElementById("email_input_error");

var userInfo_updateBtn = document.getElementById("userInfo_updateBtn");

var Image_holder = document.getElementById("Image_holder");
var upload_btn = document.getElementById("upload_btn");

var address_input = document.getElementById("address_input");
var apartment_input = document.getElementById("apartment_input");
var city_input = document.getElementById("city_input");
var state_input = document.getElementById("state_input");
var zip_input = document.getElementById("zip_input");

window.onload = function(){
    load_userInformation();
    enable_disable_update_btn();

    $image_crop = $('#upload-image').croppie({
        enableExif: true,
        viewport: {
            width: 200,
            height: 200,
            type: 'square'
        },
        boundary: {
            width: Image_holder.clientWidth - 50,
            height: 500
        }
    });

    $("#Image_holder").hide();
    upload_btn.disabled = true;

}



function initialize_croppie()
{
    var fileSelect = document.getElementById("images");

    if(fileSelect.files && fileSelect.files.length == 1){
        $("#Image_holder").show();

        Image_holder.style.visibility='block';
    
        $('#images').on('change', function () { 
            var reader = new FileReader();
            reader.onload = function (e) {
                $image_crop.croppie('bind', {
                    url: e.target.result
                }).then(function(){
                    console.log('jQuery bind complete');
                });			
            }
            reader.readAsDataURL(this.files[0]);
        });

        upload_btn.disabled = false;
    }else
    {
        $("#Image_holder").hide();
        upload_btn.disabled = true;
    }


}

function upload_logic()
{
	
        $image_crop.croppie('result', {
            type: 'canvas',
            size: 'viewport'
        }).then(function (response) {
            update_profile_pic(window.sessionStorage.getItem("id"),response);
        });

}

function update_profile_pic(userID,ImageData)
{

    var isVerified = false;

   
    var User_JSON = {
        "userID": userID,
        "imageData": ImageData,

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

            //window.sessionStorage.setItem("profile_pic_url",data.data.profileImage_URL);
            //load_userInformation();
            //toastr.success('Profile image successfully updated', 'Success', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        }

    }

    //this function will be called when data exchange with backend occured an error
    var onFaliure = function()
    {
        toastr.error('Internal server error has occured. Please try again', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        return_value =  null;
    }

    makePostRequest("uploadProfilePic",User_JSON,onSuccess,onFaliure);

    return return_value;   
}



function load_userInformation()
{
    name_input.value = window.sessionStorage.getItem("name");
    UWID_input.value = window.sessionStorage.getItem("uwid");
    email_input.value = window.sessionStorage.getItem("email");

    if(window.sessionStorage.getItem("address") != "null")
    {
        JSON_Object = JSON.parse(window.sessionStorage.getItem("address"));

        address_input.value = JSON_Object.address;
        apartment_input.value = JSON_Object.apartment;
        city_input.value = JSON_Object.city;
        state_input.value = JSON_Object.state;
        zip_input.value = JSON_Object.zipCode;
    }else
    {
        address_input.value = "";
        apartment_input.value = "";
        city_input.value = "";
        state_input.value = "";
        zip_input.value = "";
    }

    if(window.sessionStorage.getItem("profile_pic_url") == "" || window.sessionStorage.getItem("profile_pic_url") == null)
        document.getElementById("userImage").setAttribute('src','../../../app-assets/images/portrait/small/default.jpg');
    else
        document.getElementById("userImage").setAttribute('src',window.sessionStorage.getItem("profile_pic_url"));
}


function reset_button_logic()
{
    name_input.value = window.sessionStorage.getItem("name");
    UWID_input.value = window.sessionStorage.getItem("uwid");
    email_input.value = window.sessionStorage.getItem("email");

    name_input_error.innerHTML = "";
    UWID_input_error.innerHTML = "";
    email_input_error.innerHTML = "";
}


function update_user_information()
{
    if(validate_fields() == false)
        update_user_information_request(name_input.value,email_input.value,UWID_input.value,window.sessionStorage.getItem("profile_pic_url"));
}

function enable_disable_update_btn()
{
    const user_name = window.sessionStorage.getItem("name");
    const user_UWID = window.sessionStorage.getItem("uwid");
    const user_Email = window.sessionStorage.getItem("email");

    if(name_input.value == user_name && UWID_input.value == user_UWID && email_input.value == user_Email)
        userInfo_updateBtn.disabled = true;
    else
        userInfo_updateBtn.disabled = false;

    
}

function validate_fields()
{
    
    String.prototype.isNumber = function(){return /^\d+$/.test(this);}
    var errorFound = false;
    
    if(name_input.value == "" || name_input.value == null)
    {
        name_input_error.innerHTML = "* Name required";
        errorFound = true;
    }        
    else
        name_input_error.innerHTML = "";

    if(UWID_input.value == "" || UWID_input.value == null)
    {
        UWID_input_error.innerHTML = "* UW ID required";
        errorFound = true;
    }        
    else if (!UWID_input.value.isNumber())
    {
        UWID_input_error.innerHTML = "* Only digits allowed";
        errorFound = true;
    }else
        UWID_input_error.innerHTML = "";
        
        
    if(email_input.value == "" || email_input.value == null)
    {
        email_input_error.innerHTML = "* Email address required";
        errorFound = true;
    }        
    else if (email_input.value.includes("@uw.edu") == false)
    {
        email_input_error.innerHTML = "* Only UW email adresses allowed";
        errorFound = true;
    }else
        email_input_error.innerHTML = "";


    if(errorFound)
        return true;
    else
        return false;
}



function update_user_information_request(newName,newEmail,newUWID,profile_pic_url)
{

    var isVerified = false;

    if(window.sessionStorage.getItem("verified_user") == "false")
        isVerified = false;
    else if (window.sessionStorage.getItem("verified_user") == "true")
        isVerified = true;
    
    var User_JSON = {
        "Name": newName,
        "email": newEmail,
        "UWID":newUWID,
        "profile_imageURL":profile_pic_url,
        "verified_user":isVerified
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
            window.sessionStorage.setItem("name",data.data.Name);
            window.sessionStorage.setItem("uwid",data.data.UWID);
            window.sessionStorage.setItem("email",data.data.email);
            window.sessionStorage.setItem("verified_user",data.data.verified_user);
            window.sessionStorage.setItem("profile_pic_url",data.data.profileImage_URL);
            reset_button_logic();
            toastr.success('User information successfully updated', 'Success', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        }

    }

    //this function will be called when data exchange with backend occured an error
    var onFaliure = function()
    {
        toastr.error('Internal server error has occured. Please try again', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        return_value =  null;
    }

    makePutRequest("usersbyID/"+window.sessionStorage.getItem("id"),User_JSON,onSuccess,onFaliure);

    return return_value;   
}


function updateAddress(address,apartment,city,state,zipCode)
{
    var address_JSON = {
        "address": address,
        "apartment": apartment,
        "city":city,
        "state":state,
        "zipCode":zipCode
    }

    var onSuccess = function(data)
    {
        if(data.status == false)
        {
            toastr.error(data.data, 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });

        }else
        {
            window.sessionStorage.setItem("address",JSON.stringify(data.data.address));
            reset_address_logic();
            toastr.success('User default address successfully updated', 'Success', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        }

    }

    //this function will be called when data exchange with backend occured an error
    var onFaliure = function()
    {
        toastr.error('Internal server error has occured. Please try again', 'Error', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });

    }

    makePostRequest("users/updateAddress/"+window.sessionStorage.getItem("id"),address_JSON,onSuccess,onFaliure);  
}

function updateAddressBtn()
{
    updateAddress(address_input.value,apartment_input.value,city_input.value,state_input.value,zip_input.value);
}


function reset_address_logic()
{
    if(window.sessionStorage.getItem("address") != "null")
    {
        JSON_Object = JSON.parse(window.sessionStorage.getItem("address"));

        address_input.value = JSON_Object.address;
        apartment_input.value = JSON_Object.apartment;
        city_input.value = JSON_Object.city;
        state_input.value = JSON_Object.state;
        zip_input.value = JSON_Object.zipCode;
    }else
    {
        address_input.value = "";
        apartment_input.value = "";
        city_input.value = "";
        state_input.value = "";
        zip_input.value = "";
    }   
}

function reset_address_btn()
{
    reset_address_logic();
}