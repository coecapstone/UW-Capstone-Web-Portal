addLoadEvent(function() {
    update_left_navigationbar();
});

/*
 * If the autoenticated user is a super-user, show the "manage units" control.
 * XXX The decision as to whether a user it a super-user
 * XXX needs to come from a new user role, not be hard-coded in this way.
 */
function update_left_navigationbar()
{
    if (!document.getElementById("manage_units"))
	return;
    
    if (window.sessionStorage.getItem("uwid") == "perseant"
	|| window.sessionStorage.getItem("uwid") == "tjhanson") {
        document.getElementById("manage_units").style.display="list-item";
    }
}
