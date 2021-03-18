
var parent_section = document.getElementById("parentRow");
var data = JSON.parse(window.sessionStorage.getItem('infomation'));
main();

function main()
{
    var elementID= 0;

    
    console.log(data);
    var approverRoles = data.approver[0];
    var submitter = data.submitter;
    var fiscalStaff = data.fiscalStaff;
    var fiscalAdmin =data.fiscalAdmin;

    for(var x=0;x<fiscalAdmin.length;x++)
    {
        elementID++;
        parent_section.appendChild(generate_card(elementID,"bg-gradient-danger","admin","Financial Administrator",fiscalAdmin[x].UnitName,fiscalAdmin[x].UnitID));
    }

    for(var x=0;x<fiscalStaff.length;x++)
    {
        elementID++;
        parent_section.appendChild(generate_card(elementID,"bg-gradient-info","staff","Financial Staff",fiscalStaff[x].UnitName,fiscalStaff[x].UnitID));
    }

    for(var x=0;x<submitter.length;x++)
    {
        elementID++;
        parent_section.appendChild(generate_card(elementID,"bg-gradient-success","submitter","Submitter",submitter[x].SubunitName,submitter[x].SubunitID));
    }

    for(var x=0;x<approverRoles.length;x++)
    {
        console.log(approverRoles[x]);
        elementID++;
        parent_section.appendChild(generate_card(elementID,"bg-gradient-primary","approver","Approver",approverRoles[x].SubunitName,approverRoles[x].SubunitID));
    }
        


}

function generate_card(ElementID, cardColor,cardType, role, unit_subUnit_name,unit_subunit_ID)
{
    var parent_div = document.createElement('div');
    parent_div.setAttribute('class', 'col-lg-4 col-md-6 col-sm-12');

    var div_main_card = document.createElement('div');
    div_main_card.setAttribute('class',`card text-white ${cardColor} text-center`);
    div_main_card.setAttribute('onclick',`card_click(${ElementID.toString()},'${cardType}')`);

    var card_content = document.createElement('div');
    card_content.setAttribute('class','card-content')

    var card_body = document.createElement('div');
    card_body.setAttribute('class','card-body');

    var imageTag = document.createElement('img');
    imageTag.setAttribute('src','../../../app-assets/images/elements/husky.png');
    imageTag.setAttribute('alt','element 02');
    imageTag.setAttribute('width','150');
    imageTag.setAttribute('class','mb-1');

    var card_title = document.createElement('h3');
    card_title.setAttribute('class','card-title text-white');
    card_title.innerHTML = role;

    var unitSubunit_name = document.createElement('p');
    unitSubunit_name.setAttribute('id',`unitSubunitname${ElementID}`);
    unitSubunit_name.setAttribute('class',`card-text`);
    unitSubunit_name.innerHTML = unit_subUnit_name;

    var unitSubunit_ID = document.createElement('p');
    unitSubunit_ID.setAttribute('id',`unitSubunitID${ElementID}`);
    unitSubunit_ID.innerHTML = unit_subunit_ID;
    unitSubunit_ID.hidden = true;


    card_body.appendChild(imageTag);
    card_body.appendChild(card_title);
    card_body.appendChild(unitSubunit_name);
    card_body.appendChild(unitSubunit_ID);

    card_content.appendChild(card_body);
    div_main_card.appendChild(card_content);

    parent_div.appendChild(div_main_card);


    return parent_div;


}

function card_click(elementID, cardType)
{
    window.sessionStorage.clear();
    window.sessionStorage.setItem("id",data.userInfo._id);
    window.sessionStorage.setItem("name",data.userInfo.Name);
    window.sessionStorage.setItem("uwid",data.userInfo.UWID);
    window.sessionStorage.setItem("email",data.userInfo.email);
    window.sessionStorage.setItem("verified_user",data.userInfo.verified_user);
    window.sessionStorage.setItem("profile_pic_url",data.userInfo.profileImage_URL);
    window.sessionStorage.setItem("address",JSON.stringify(data.userInfo.address));
    console.log(elementID);
    console.log(cardType);
    if(cardType == "admin")
    {
        var unitName = document.getElementById("unitSubunitname"+elementID).innerHTML;
        var unitID = document.getElementById("unitSubunitID"+elementID).innerHTML;
	EngineUI.setUnitID(unitID);
	EngineUI.setUnitName(unitName);
	EngineUI.setLevel(EngineUI.LEVEL_ADMIN);

        window.location.replace("../Admin/dashboard_admin.html");
    }else if(cardType == "staff")
    {
        var unitName = document.getElementById("unitSubunitname"+elementID).innerHTML;
        var unitID = document.getElementById("unitSubunitID"+elementID).innerHTML;
	EngineUI.setUnitID(unitID);
	EngineUI.setUnitName(unitName);
	EngineUI.setLevel(EngineUI.LEVEL_FISCAL_STAFF);

        window.location.replace("../buyers/buyer-dashboard.html");
    }else if (cardType == "submitter")
    {
        console.log("submitetr clk");
        var subunitName = document.getElementById("unitSubunitname"+elementID).innerHTML;
        var subunitID = document.getElementById("unitSubunitID"+elementID).innerHTML;
	EngineUI.setSubunitID(subunitID);
	EngineUI.setSubunitName(subunitName);
	EngineUI.setLevel(EngineUI.LEVEL_SUBMITTER);

        window.location.replace("../users/user-dashboard.html");
    }else if (cardType == "approver")
    {
        var subunitName = document.getElementById("unitSubunitname"+elementID).innerHTML;
        var subunitID = document.getElementById("unitSubunitID"+elementID).innerHTML;
	EngineUI.setSubunitID(subunitID);
	EngineUI.setSubunitName(subunitName);
	EngineUI.setLevel(EngineUI.LEVEL_APPROVER);

        window.location.replace("../approvers/approver-dashboard.html");
    }
}
