// alert("CONNECTED!");

//this function is called at onlick of each travelable expense check boxes
function  myselfRadio_actions(RadioLogic) //CheckboxLogic = 1 -- YES, CheckboxLogic == 0 -- NO
{
    var yesRadio = document.getElementById("myselfRadio_Yes");
    var noRadio = document.getElementById("myselfRadio_No");

    // -- UI manipulations ----
    if(RadioLogic == 1) //if yes is checked then no is unchecked
        noRadio.checked = false;
    else
        yesRadio.checked = false;

    
    //actually checking which one's checked and displaying any additional messages
    if(yesRadio.checked)
        document.getElementById("myself_Yes").className = "col-12 visible";
    else
        document.getElementById("myself_Yes").className = "col-12 hidden"; 

}

function  onBehalfRadio_actions(RadioLogic) //CheckboxLogic = 1 -- YES, CheckboxLogic == 0 -- NO
{
    var yesRadio = document.getElementById("onBehalfRadio_Yes");
    var noRadio = document.getElementById("onBehalfRadio_No");

    // -- UI manipulations ----
    if(RadioLogic == 1)
        noRadio.checked = false;
    else
        yesRadio.checked = false;

    
    if(yesRadio.checked) {
        document.getElementById("onBehalf_Yes").className = "col-12 visible";
        document.getElementById("onBehalf_Yes_2").className = "col-12 visible";
    }
    else {
        document.getElementById("onBehalf_Yes").className = "col-12 hidden"; 
        document.getElementById("onBehalf_Yes_2").className = "col-12 hidden";
    }

}

//this function is called at onlick of each uw employee check boxes
function  uwEmployee_CheckBox_actions(CheckboxLogic) //CheckboxLogic = 1 -- YES, CheckboxLogic == 0 -- NO
{
    var yesCheckBox = document.getElementById("uwEmployee_YES_Box");
    var noCheckBox = document.getElementById("uwEmployee_NO_Box");

    // -- UI manipulations ----
    if(CheckboxLogic == 1) //if yes is checked then no is unchecked
        noCheckBox.checked = false;
    else
        yesCheckBox.checked = false;

    
    //actually checking which one's checked and displaying any additional messages
    if(yesCheckBox.checked)
    {
        //show UW affiliation dropdown
        document.getElementById("uwAffiliation").style.display = "block";
        //hide payee name dropdown with search
        document.getElementById("payeeName_withSearch").style.display = "none";
        //show payee name text box
        document.getElementById("payeeName_withOutSearch").style.display = "block";
        //if UW Affiiation is set to other then show Other UW affiliation field
        if(document.getElementById("uwAffiliation_dropdown").value == "Other")
            document.getElementById("uwAffiliation_other").style.display="block";
        else
            document.getElementById("uwAffiliation_other").style.display="none";

    }else
    {
        //hide UW affiliation dropdown
        document.getElementById("uwAffiliation").style.display = "none";
        //show payee name dropdown with search
        document.getElementById("payeeName_withSearch").style.display = "block";
        //hide payee name text box
        document.getElementById("payeeName_withOutSearch").style.display = "none";
        //hide other UW affiliation all times
        document.getElementById("uwAffiliation_other").style.display="none";

    }


}


//this function will handle what will happen when user choose an option in UW Affiliation drop down
function uwAffiliation_dropdown_onChange()
{
    var dropdown = document.getElementById("uwAffiliation_dropdown");

    //if user selects other we need to show Other UW Affiliation field, if not hide
    if(dropdown.value == "Other")
        document.getElementById("uwAffiliation_other").style.display="block";
    else
        document.getElementById("uwAffiliation_other").style.display="none"; 

}



//this function is called at onlick of each Food or beverages check boxes
function  foodAndBeverages_Radio_actions(CheckboxLogic) //CheckboxLogic = 1 -- YES, CheckboxLogic == 0 -- NO
{
 
    var yesCheckBox = document.getElementById("foodAndBeverages_YES");
    var noCheckBox = document.getElementById("foodAndBeverages_NO");

    // -- UI manipulations ----
    if(CheckboxLogic == 1) //if yes is checked then no is unchecked
        noCheckBox.checked = false;
    else
        yesCheckBox.checked = false;

    
    //actually checking which one's checked and displaying any additional checkboxes
    if(yesCheckBox.checked)
    {
        //show i will attach checkbox part
        document.getElementById("foodAndBeverages").className = "col-12 visible";
        //show food approved budget checkbox part
        document.getElementById("foodApprovedBudget").className = "row visible";
        //show food compliance checkbox part
        document.getElementById("foodCompliance").className = "row visible";

        //if food compliance is set to NO then show approved by admin part
        if(document.getElementById("foodCompliance_NO_box").checked)
            document.getElementById("approvedbyAdmin").className = "row visible";
        
        //if food compliance is set to NO then show approved by admin part
        if(document.getElementById("approvedbyAdmin_YES_box").checked)
        {
            //show i will attach checkbox part
            document.getElementById("iWillAttach_admin_approval").className = "row visible";
            //show i understand checkbox part
            document.getElementById("iUnderstand_amount").className = "row visible";
            //hide popup information
            document.getElementById("approvedbyAdmin_popup").className = "hidden";  

        }else if (document.getElementById("approvedbyAdmin_NO_box").checked)
        {
            //hide i will attach checkbox part
            document.getElementById("iWillAttach_admin_approval").className = "row hidden";
            //hide i understand checkbox part
            document.getElementById("iUnderstand_amount").className = "row hidden";
            //show popup information
            document.getElementById("approvedbyAdmin_popup").className = "visible";  
        }else
        {
            //hide i will attach checkbox part
            document.getElementById("iWillAttach_admin_approval").className = "row hidden";
            //hide i understand checkbox part
            document.getElementById("iUnderstand_amount").className = "row hidden";
            //hide popup information
            document.getElementById("approvedbyAdmin_popup").className = "hidden"; 
        }
        
            

    }else if(noCheckBox.checked)
    {
        //hide i will attach checkbox part
        document.getElementById("iWillAttach").className = "row hidden";
        //hide food approved budget checkbox part
        document.getElementById("foodApprovedBudget").className = "row hidden";
        //hide food compliance checkbox part
        document.getElementById("foodCompliance").className = "row hidden";
        //hide approved by admin check boxes
        document.getElementById("approvedbyAdmin").className = "row hidden";        
        //hide popup information
        document.getElementById("approvedbyAdmin_popup").className = "hidden";
        //hide i will attach checkbox part
        document.getElementById("iWillAttach_admin_approval").className = "row hidden";
        //hide i understand checkbox part
        document.getElementById("iUnderstand_amount").className = "row hidden";        
    
    }else
    {
        //hide i will attach checkbox part
        document.getElementById("iWillAttach").className = "row hidden";
        //hide food approved budget checkbox part
        document.getElementById("foodApprovedBudget").className = "row hidden";
        //hide food compliance checkbox part
        document.getElementById("foodCompliance").className = "row hidden";
        //hide approved by admin check boxes
        document.getElementById("approvedbyAdmin").className = "row hidden";        
        //hide popup information
        document.getElementById("approvedbyAdmin_popup").className = "hidden";
        //show i will attach checkbox part
        document.getElementById("iWillAttach_admin_approval").className = "row hidden";
        //show i understand checkbox part
        document.getElementById("iUnderstand_amount").className = "row hidden";

    }


}


//this function is called at onlick of each Food approved budget check boxes
function  foodApprovedBudget_CheckBox_actions(CheckboxLogic) //CheckboxLogic = 1 -- YES, CheckboxLogic == 0 -- NO
{
 
    var yesCheckBox = document.getElementById("foodApprovedBudget_YES_box");
    var noCheckBox = document.getElementById("foodApprovedBudget_NO_box");

    // -- UI manipulations ----
    if(CheckboxLogic == 1) //if yes is checked then no is unchecked
        noCheckBox.checked = false;
    else
        yesCheckBox.checked = false;

    
    //actually checking which one's checked and displaying any additional checkboxes
    if(yesCheckBox.checked)
        //show popup information
        document.getElementById("foodApprovedBudget_popup").className = "visible";
    else
        //hide popup information
        document.getElementById("foodApprovedBudget_popup").className = "hidden";

}

//this function is called at onlick of each Food compliance check boxes
function  foodCompliance_CheckBox_actions(CheckboxLogic) //CheckboxLogic = 1 -- YES, CheckboxLogic == 0 -- NO
{
 
    var yesCheckBox = document.getElementById("foodCompliance_YES_box");
    var noCheckBox = document.getElementById("foodCompliance_NO_box");

    // -- UI manipulations ----
    if(CheckboxLogic == 1) //if yes is checked then no is unchecked
        noCheckBox.checked = false;
    else
        yesCheckBox.checked = false;

    
    //actually checking which one's checked and displaying any additional checkboxes
    if(yesCheckBox.checked)
    {
        //show popup information
        document.getElementById("foodCompliance_popup").className = "visible";
        //hide approved by admin check boxes
        document.getElementById("approvedbyAdmin").className = "row hidden";
    }else if(noCheckBox.checked)
    {
        //hide popup information
        document.getElementById("foodCompliance_popup").className = "hidden";
        //show approved by admin check boxes
        document.getElementById("approvedbyAdmin").className = "row visible";

    }else
    {
        //hide popup information
        document.getElementById("foodCompliance_popup").className = "hidden";
        //hide approved by admin check boxes
        document.getElementById("approvedbyAdmin").className = "row hidden";
     
    }




}


//this function is called at onlick of each approved by admin check boxes
function  approvedbyAdmin_CheckBox_actions(CheckboxLogic) //CheckboxLogic = 1 -- YES, CheckboxLogic == 0 -- NO
{
 
    var yesCheckBox = document.getElementById("approvedbyAdmin_YES_box");
    var noCheckBox = document.getElementById("approvedbyAdmin_NO_box");

    // -- UI manipulations ----
    if(CheckboxLogic == 1) //if yes is checked then no is unchecked
        noCheckBox.checked = false;
    else
        yesCheckBox.checked = false;

    
    //actually checking which one's checked and displaying any additional checkboxes
    if(yesCheckBox.checked)
    {
        //hide popup information
        document.getElementById("approvedbyAdmin_popup").className = "hidden";
        //show i will attach checkbox part
        document.getElementById("iWillAttach_admin_approval").className = "row visible";
        //show i understand checkbox part
        document.getElementById("iUnderstand_amount").className = "row visible";
    }else if (noCheckBox.checked)
    {
      //show popup information
      document.getElementById("approvedbyAdmin_popup").className = "visible";
     //show i will attach checkbox part
     document.getElementById("iWillAttach_admin_approval").className = "row hidden";
     //show i understand checkbox part
     document.getElementById("iUnderstand_amount").className = "row hidden";
      
    }else //all off
    {
      //hide popup information
      document.getElementById("approvedbyAdmin_popup").className = "hidden";
      //show i will attach checkbox part
      document.getElementById("iWillAttach_admin_approval").className = "row hidden";
      //show i understand checkbox part
      document.getElementById("iUnderstand_amount").className = "row hidden";
    }




}


// CheckboxLogic = 1 -- YES, CheckboxLogic == 0 -- NO
function checkMail_actions(RadioLogic) {
    var yesRadio = document.getElementById("checkMail");
    
    //actually checking which one's checked and displaying any additional messages
    if(yesRadio.checked)
        document.getElementById("mailAddr").className = "col-12 visible";
    else
        document.getElementById("mailAddr").className = "col-12 hidden"; 

}

function optional_actions(RadioLogic) {
    var yesCheckBox = document.getElementById("optional_check");
    
    if(yesCheckBox.checked)
        document.getElementById("option").className = "col-12 visible";
    else
        document.getElementById("option").className = "col-12 hidden"; 

}

