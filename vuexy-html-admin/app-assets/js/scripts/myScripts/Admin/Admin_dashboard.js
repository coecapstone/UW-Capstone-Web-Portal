var administrative_staff_table = null;


window.onload = function()
{
    //const socket = io.connect('http://localhost:3000');
    update_Dashboard_welcomebar_navigationbar();
    update_administrativeStaff_table();
    update_subunit_table();

    /*socket.on('connect', function(data) {
        socket.emit('join', window.sessionStorage.getItem('id'));
     });
    socket.on('message', data =>{
        console.log(data);
        console.log(data.Message);
        Handle_notifications(data.Title,data.Message,data.timeStamp,data.Type);
    });*/

}

/*
<a class="d-flex justify-content-between" href="javascript:void(0)">
<div class="media d-flex align-items-start">
    <div class="media-left"><i class="feather icon-plus-square font-medium-5 primary"></i></div>
    <div class="media-body">
        <h6 class="primary media-heading">You have new order!</h6><small class="notification-text"> Amazon Web Services - Standard Order</small>
    </div>
    <small>
        <time class="media-meta" datetime="2015-06-11T18:29:20+08:00">9 hours ago</time>
    </small>
</div>
</a>*/

function getMonth_inName(monthNum)
{
    const months = ['Jan','Feb', 'Mar', "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Nov", "Dec"];

    return months[monthNum-1];
}

function to_12_hours(hours, minutes)
{
    //it is pm if hours from 12 onwards
    suffix = (parseInt(hours) >= 12)? 'PM' : 'AM';

    //only -12 from hours if it is greater than 12 (if not back at mid night)
    hours = (parseInt(hours) > 12)? hours -12 : hours;

    //if 00 then it is 12 am
    hours = (parseInt(hours) == '00')? 12 : hours;

    if(parseInt(minutes) < 10)
        minutes = "0"+minutes;

    return hours+":"+minutes+" "+suffix;
}

function Handle_notifications(Title,content,timeStamp,type)
{
    var a_tag = document.createElement('a');
    a_tag.setAttribute('class', 'd-flex justify-content-between'); //maybe Href to the main notification section ? href="javascript:void(0)"
    var div_parent = document.createElement('div');
    div_parent.setAttribute('class','media d-flex align-items-start');
    var div_i_wrapper = document.createElement('div');
    div_i_wrapper.setAttribute('class','media-left');
    var i_tag = document.createElement('i');
    var h6_tag = document.createElement('h6');
    
    if(type=="accepted")
    {
        i_tag.setAttribute('class','feather icon-check-circle font-medium-5 success'); //change class attributes to change notifcation color and icon
        h6_tag.setAttribute('class','success media-heading');
    }else if (type == "pending")
    {
        i_tag.setAttribute('class','feather icon-clipboard font-medium-5 warning');
        h6_tag.setAttribute('class','warning media-heading');
    }else if (type == "info")
    {
        i_tag.setAttribute('class','feather icon-info font-medium-5 primary');
        h6_tag.setAttribute('class','primary media-heading');
    }else if(type == "danger")
    {
        i_tag.setAttribute('class','feather icon-x font-medium-5 danger');
        h6_tag.setAttribute('class','danger media-heading');
    }
        
        
    var div_media_body = document.createElement('div');
    div_media_body.setAttribute('class','media-body');

    h6_tag.innerHTML = Title;
    var small_tag = document.createElement('small');
    small_tag.setAttribute('class','notification-text');
    small_tag.innerHTML = content;
    var small_tag_2 = document.createElement('small');
    var time_tag = document.createElement('time');
    time_tag.setAttribute('class','media-meta');
    const dateTime = new Date(timeStamp);
    //const m = moment(dateTime).format().minutes();
    time_tag.innerHTML = getMonth_inName(dateTime.getMonth()) +" "+dateTime.getDate()+" at "+to_12_hours(dateTime.getHours(),dateTime.getMinutes());

    small_tag_2.appendChild(time_tag);
    div_media_body.appendChild(h6_tag);
    div_media_body.appendChild(small_tag);
    div_i_wrapper.appendChild(i_tag);

    div_parent.appendChild(div_i_wrapper);
    div_parent.appendChild(div_media_body);
    div_parent.appendChild(small_tag_2);

    a_tag.appendChild(div_parent);

    document.getElementById('notification_content').appendChild(a_tag);

    //increment number of notifications
    const notification_num_span = document.getElementById("notification_span");
    if(notification_num_span.innerHTML == "" || notification_num_span.innerHTML == null)
        notification_num_span.innerHTML = "1";
    else
        notification_num_span.innerHTML = (parseInt(notification_num_span.innerHTML)+1).toString(); 

}


function update_Dashboard_welcomebar_navigationbar()
{
    
    //Now welcome mesaage
    const welcome_message = welcomeMessage() + " " + sessionStorage.getItem("name").split(" ")[0] + " !";
    document.getElementById("welcome_userName").innerHTML = "<b>"+welcome_message+"</b>";
    //adding unit name
    document.getElementById("welcome-unitName").innerHTML = '<i class="feather icon-map-pin"></i> ' + sessionStorage.getItem("unitName");

}


function update_administrativeStaff_table()
{
    var administrative_staff_table_body = document.getElementById("adminnistrative_staff_table_body");
    var onSuccess = function(data)
    {
        for(var x=0;x<data.data.length;x++)
        {
            
            administrative_staff_table_body.appendChild(build_administrative_table_rows(data.data[x].profileImage_URL,data.data[x].Name,data.data[x].Admin));
        }
        
    }

    //this function will be called when data exchange with backend occured an error
    var onFaliure = function()
    {
        console.log("Backend error");
    }

    makeGetRequest("units/getUserInfomation/"+window.sessionStorage.getItem("unitID"),onSuccess,onFaliure);
}

function update_subunit_table()
{
    var subunit_table_body = document.getElementById("subunits_table_body");
    var onSuccess = function(data)
    {
        for(var x=0;x<data.data.length;x++)
        {
            
            subunit_table_body.appendChild(subunit_table_row_generator(data.data[x].subUnitName));
        }
        

    }

    //this function will be called when data exchange with backend occured an error
    var onFaliure = function()
    {
        console.log("Backend error");
    }

    makeGetRequest("subunitsinUnit/"+window.sessionStorage.getItem("unitID"),onSuccess,onFaliure);
}





// ---------------------------- Helper Functions ------------------------------
function build_administrative_table_rows(profile_img_url,name,admin)
{
    //creating profile image part
    var ul = document.createElement('ul');
    ul.setAttribute('class','list-unstyled users-list m-0  d-flex align-items-center');
    var li = document.createElement('li');
    li.setAttribute('data-toggle','tooltip');
    li.setAttribute('data-popup','tooltip-custom');
    li.setAttribute('data-placement','bottom');
    li.setAttribute('data-original-title',name);
    li.setAttribute('class','avatar mr-1 avatar-lg');
    var img = document.createElement('img');
    img.setAttribute('class','media-object rounded-circle');
    if(profile_img_url=="" || profile_img_url == null)
        img.setAttribute('src','../../../app-assets/images/portrait/small/default.jpg');
    else
        img.setAttribute('src',profile_img_url);

    img.setAttribute('alt','Avatar');
    img.setAttribute('height','30');
    img.setAttribute('width','30');
    
    li.appendChild(img);
    ul.appendChild(li);

    var td_prof_image = document.createElement('td');
    td_prof_image.setAttribute('class','p-1');
    td_prof_image.appendChild(ul);

    var td_name = document.createElement('td');
    td_name.innerHTML = name;

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
        
    

    var tr = document.createElement('tr');
    tr.appendChild(td_prof_image);
    tr.appendChild(td_name);
    tr.appendChild(td_accessLevel);

    return tr;

}


function subunit_table_row_generator(name)
{
    var td_subunitName = document.createElement('td');
    td_subunitName.innerHTML = name;

    var tr = document.createElement('tr');
    tr.appendChild(td_subunitName);

    return tr;

}



//----------------------------- End of Helpers   ------------------------------