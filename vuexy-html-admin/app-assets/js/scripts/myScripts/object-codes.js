    // XXX ideally these values would come from the database
    // XXX and the administrator would be able to edit them using the UI.
    const CODES = [
	    { text: "Books (05-30)", value: "05-30" },
	    { text: "Chemicals and Chemical Products (05-31)", value: "05-31" },
	    { text: "Computer Equipment <$5,000 (05-40)", value: "05-40" },
	    { text: "Consultant or Professional Services (02)", value: "02" },
	    { text: "Equipment >$5,000 (06)", value: "06" },
	    { text: "Food and Beverage", value: "food" },
	    { text: "Honorarium (02-20)", value: "02-20" },
	    { text: "M&E Tax Exempt Equipment", value: "METEE" },
	    { text: "Memberships & Dues (03-30)", value: "03-30" },
	    { text: "Mileage (04-12)", value: "04-12" },
	    { text: "Misc Services (03)", value: "03" },
	    { text: "Office Supplies (05-64)", value: "05-64" },
	    { text: "Other/Not sure", value: "other" },
	    { text: "Publication Fees (03-54)", value: "03-54" },
	    { text: "Registration Fees (03-34)", value: "03-34" },
	    { text: "Research Subject Payments (02-08)", value: "02-08" },
	    { text: "Service/Maintenance Contract (03-64)", value: "03-64" },
	    { text: "Service/Repair (03-60)", value: "03-60" },
	    { text: "Shipping (03-24)", value: "03-24" },
	    { text: "Supplies/Consumables (05)", value: "05" },
	    { text: "Travel (04)", value: "04" },
	];

class UWObjectCodes {
    static get CODES() { return CODES; }

    static fillCodes(element, header) {
	element.innerHTML = ""; // delete whatever is there now

	// header
	var option = document.createElement("option");
	option.setAttribute("value", "");
	option.innerHTML = "<i>Please Select</i>";
	element.appendChild(option);

	//console.log("CODES = " + JSON.stringify(CODES));
	CODES.forEach(pair => {
		//console.log("pair = " + pair);
		var option = document.createElement("option");
		option.setAttribute("value", pair.value);
		option.innerHTML = pair.text;
		element.appendChild(option);
	});
    }
}
