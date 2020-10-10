window.onload = function()
{
    update_Dashboard_welcomebar_navigationbar();
}

function update_Dashboard_welcomebar_navigationbar()
{
    
    //Now welcome mesaage
    const welcome_message = welcomeMessage() + " " + sessionStorage.getItem("name").split(" ")[0] + " !";
    document.getElementById("welcome_userName").innerHTML = "<b>"+welcome_message+"</b>";
    //adding unit name
    document.getElementById("welcome-unitName").innerHTML = '<i class="feather icon-map-pin"></i> ' + sessionStorage.getItem("subunitName");

}