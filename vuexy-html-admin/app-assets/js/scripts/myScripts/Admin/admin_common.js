addLoadEvent(function() {
    update_left_navigationbar();
});

/*
 * XXX The decision as to whether a user is a super-user
 * XXX needs to come from a new user role, not be hard-coded in this way.
 */
function canAddUnits()
{
    var trueName = EngineUI.getUwid();
console.log("uwid = " + trueName);
    if (trueName != "perseant" && trueName != "yangx38" && trueName != "xiyueyao" && trueName != "ab32") {
        return false;
    }
    return true;
}

/*
 * If the authenticated user is a super-user, show the "manage units" control
 * and the "impersonate a user" control.
 */
function update_left_navigationbar()
{
    // Once we know who we are, we will call this
    var onSuccessKnowingNetid = function(data) {
        EngineUI.setUwnetid( data.data.uwnetid);
        EngineUI.setTrue_uwnetid( data.data.true_uwnetid);
	
	if (document.getElementById("manage_units") && canAddUnits()) {
            document.getElementById("manage_units").style.display="list-item";
	}
    }
    
    var onFailureNoNetid = function(data) {
        alert("Failed to get Netid from server!");
    }
    
    makePostRequest("whoami", {}, onSuccessKnowingNetid, onFailureNoNetid);
}

function impersonate(netid)
{
    var onSuccess = function(data)
    {
        if(data.status == false)
        {
            alert("Failed to impersonate: " + data.data);
        }
        else
            window.location.replace("/");
    }

    //this function will be called when data exchange with backend occured an error
    var onFailure = function(err)
    {
        alert("Failed to impersonate: onFailure(" + err + ")");
    }

    makePostRequest("impersonate/" + netid, {}, onSuccess, onFailure);
}
