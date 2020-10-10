
function login()
{
    //get UW ID from the field
    var UWID_ = document.getElementById("uwNetID").value;


    var onSuccess = function(data)
    {
        if(data.status)
        {
            window.sessionStorage.clear();
            console.log(data);
            window.sessionStorage.setItem('infomation',JSON.stringify(data.data));
            //saving following data in session storage
            /*window.sessionStorage.setItem("id",data.data.userInfo._id);
            window.sessionStorage.setItem("name",data.data.userInfo.Name);
            window.sessionStorage.setItem("uwid",data.data.userInfo.UWID);
            window.sessionStorage.setItem("email",data.data.userInfo.email);
            window.sessionStorage.setItem("verified_user",data.data.userInfo.verified_user);
            window.sessionStorage.setItem("unitID",data.data.UnitID);
            window.sessionStorage.setItem("unitName",data.data.UnitName);
            window.sessionStorage.setItem("profile_pic_url",data.data.userInfo.profileImage_URL);*/


            window.location.replace("chooseRole.html");
                
            
        }else
        {
            alert(data.data);
        }

    }

    //this function will be called when data exchange with backend occured an error
    var onFaliure = function()
    {
        alert("Backend faliure !");
    }

    makeGetRequest("login/"+UWID_,onSuccess,onFaliure);
}



