
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
            EngineUI.setInfomation(JSON.stringify(data.data));
            //saving following data in session storage
            /*EngineUI.setId(data.data.userInfo._id);
            EngineUI.setName(data.data.userInfo.Name);
            EngineUI.setUwid(data.data.userInfo.UWID);
            EngineUI.setEmail(data.data.userInfo.email);
            EngineUI.setVerified_user(data.data.userInfo.verified_user);
            EngineUI.setUnitID(data.data.UnitID);
            EngineUI.setUnitName(data.data.UnitName);
            EngineUI.setProfile_pic_url(data.data.userInfo.profileImage_URL);*/


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



