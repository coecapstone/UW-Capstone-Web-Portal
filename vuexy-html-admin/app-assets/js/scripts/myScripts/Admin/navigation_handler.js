update_top_navigation_inofrmation();



function update_top_navigation_inofrmation()
{
    //as soon as we get here lets set user name and Unit information to the dashboard
    document.getElementById("navigationBarName").textContent = sessionStorage.getItem("name");

    //this will update the navigation bar profile picture
    var nav_image_element = document.getElementById("navigationBarImage");
    const profile_pic_url = window.sessionStorage.getItem("profile_pic_url");

    if(profile_pic_url== "" || profile_pic_url == null)
        nav_image_element.setAttribute('src','../../../app-assets/images/portrait/small/default.jpg');
    else
        nav_image_element.setAttribute('src',profile_pic_url);

}


function logout()
{
    //clear all the session storage
    window.sessionStorage.clear();
}

function month_in_Name(month_number)
{
    const array_of_Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    return array_of_Months[month_number];
}


