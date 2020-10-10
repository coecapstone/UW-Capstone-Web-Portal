/**
 * Should be included by forms
 * lineitem controller
 */

var request_type = null;

function lineItemInit(type) {
    request_type = type;
    
    var budgetBtnEl = document.getElementById("budget_btn_1_1");
    budgetBtnEl.addEventListener('click', function() {
        document.getElementById(`budget_1_${budgetIds[0]-1}`).after(addBudget(1, budgetIds[0]++, false));
    });

    var infoEl1 = document.getElementById(`budget-info-1-1-1`);
    infoEl1.addEventListener('change', function() {
        toggleInputBox(1, 1, 1);
    });
    var infoEl2 = document.getElementById(`budget-info-1-1-2`);
    infoEl2.addEventListener('change', function() {
        toggleInputBox(1, 1, 2);
    });
    var infoEl3 = document.getElementById(`budget-info-1-1-3`);
    infoEl3.addEventListener('change', function() {
        toggleInputBox(1, 1, 3);
    });

    var splitEl = document.getElementById("split_with_1_1");
    splitEl.addEventListener('change', function() {
        splitWithChanged(1, 1);
    });
    
    if (type == "Purchase Request") {
        var quantityEl = document.getElementById("quantity_1");
        var unitpriceEl = document.getElementById("unit_price_1");

        quantityEl.addEventListener('change', function() {
            var u = unitpriceEl.value;
            var q = quantityEl.value;
            updateLastSplitVal(1, parseFloat(u) * parseFloat(q));
        });
        unitpriceEl.addEventListener('change', function() {
            var u = unitpriceEl.value;
            var q = quantityEl.value;
            updateLastSplitVal(1, parseFloat(u) * parseFloat(q));
        });
    } else {
        var amountEl = document.getElementById("amount_1");
        amountEl.addEventListener('change', function() {
            updateLastSplitVal(1, parseFloat(amountEl.value));
        });
    }

    var addnewitemBtnEl = document.getElementById("add_new_line_item");
    addnewitemBtnEl.addEventListener('click', function() {
        addNewLineItem(idFlags.length);
    });

    var fileBtnEl = document.getElementById("file_btn_1_1");
    fileBtnEl.addEventListener('click', function() {
        fileNum ++;
        document.getElementById('file_block').appendChild(addOneMoreFile(fileNum));
    });

    var deleteBtnEl = document.getElementById("delete_1");
    deleteBtnEl.addEventListener('click', function() {
        removeLineItem(1);
    });
}

/**
 * BEGIN: Budgets Controller
 * @param _id id for line item, start from 1
 * @param _budget_id id for budget number in this line item, start from 1 
 * For each line item, we may have multiple budget number,
 * so for every budget number and budget button, 
 * they have their unique id
 * button: budget_btn_{line-item-id}_{budget-id}
 * budget number: budget_{line-item-id}_{budget-id}
 */

/**
 * Get the budgets information from database
 * @param {array} budgets_database global variable, store all the budget number of this unit or subunit
 */
function getBudgetsInfo() {
    var onSuccess = function(data) {
        if (data.status == true) {
            // console.log("budgets information is here");
            // console.log(data.data);
            for (var i = 0; i < data.data.length; i++) {
                budgets_database.push(data.data[i].budgetNumber);
            }
        } else {
            //error message
        }
    }

    var onFailure = function() {
        // failure message
    }

    makeGetRequest("getBudgetsUnderSubUnit/" + unit_id, onSuccess, onFailure);
}

function sendRequestHistory(request_id, actionstr) {
    var history = {
        userName: window.sessionStorage.getItem("id"),
        action: actionstr
    };

    var onSuccess = function(data) {
        if (data.status == true) {
            console.log("update success");
        } else {
            //error message
        }
    }

    var onFailure = function() {
        // failure message
    }
    makePostRequest("updateOrderHistory/" + request_id, history, onSuccess, onFailure);
}

/**
 * Auto-calculate the last budget split value
 * @param {int} idx the line item index
 * @param {float} amount input amount
 * @param {float} currD input dollar
 * @param {float} currP input percentage
 * @param {boolean} DorP true represent dollar, flase represent percentage
 */

function updateLastSplitVal(idx, amount) {
    var total_pre = amount;
    var presumD = 0;
    var presumP = 0;
    if (budgetMap.has(idx)) {
        total_pre = budgetMap.get(idx).total;
    }
    
    var dollarInputs = document.getElementsByName(`split_dollar_input_value_${idx}`);
    var percInputs = document.getElementsByName(`split_percent_input_value_${idx}`);
    var n = dollarInputs.length;
    if (amount != total_pre) {
        budgetMap.set(idx, {
            total: amount,
            dollar: 0,
            perc: 0
        })
        for (var x = 0; x < n - 1; x++) {
            dollarInputs[x].value = 0;
            percInputs[x].value = 0;
        }
    } else {
        for (var x = 0; x < n - 1; x++) {
            presumD += parseFloat(dollarInputs[x].value);
            presumP += parseFloat(percInputs[x].value);
        }
        budgetMap.set(idx, {
            total: amount,
            dollar: presumD,
            perc: presumP
        });
    }
    
    var lastPerc = percInputs[n - 1];
    var lastDollar = dollarInputs[n - 1];

    lastDollar.value = budgetMap.get(idx).total - budgetMap.get(idx).dollar;
    lastPerc.value = 100 - budgetMap.get(idx).perc;
    
    console.log(budgetMap);
}



/**
 * Add budget numbers to selected box from database
 * For now this is just test
 */
function addBudgetData(num) {
    var op = document.createElement('option');
    if (num == "0") {
        op.setAttribute('value', '');
        op.innerHTML = "Please select"
    } else {
        op.setAttribute('value', num);
        op.innerHTML = num;
    }
    return op;
}


/** 
 * Core function of budgets controller 
 * @param _id id for line item
 * @param _budget_id id for budget number in this line item
 * @param {boolean} init signal for if this is the original budget number in this line item
 * This function will use to add new budget block in form
 * If this is the initialized budget block for this line item (init == true),
 * the button will be plus button, otherwise the button will be delete button
 */
function addBudget(_id, _budget_id, init) {
    // Make the previous budget active
    if (!init) {
        var dollarValInput = document.getElementById(`split_dollar_input_value_${_id}_${_budget_id-1}`);
        var percentValInput = document.getElementById(`split_percent_input_value_${_id}_${_budget_id-1}`);
        dollarValInput.removeAttribute('disabled');
        percentValInput.removeAttribute('disabled');

        dollarValInput.addEventListener('change', function() {
            updateLastSplitVal(_id, budgetMap.get(_id).total);
        });

        percentValInput.addEventListener('change', function() {
            updateLastSplitVal(_id, budgetMap.get(_id).total);
        });
    }

    if (init) {
        budgetIds.push(2);
    }

    var box = document.createElement('div');
    box.setAttribute('class', 'col-12');
    box.setAttribute('id', 'budget_' + _id + '_' + _budget_id);
    var row = document.createElement('div');
    row.setAttribute('class', 'form-group row');

    var first = document.createElement('div');
    first.setAttribute('class', 'col-md-4');
    if (init) {
        first.innerHTML = "<span>Budget Number</span>";
    }

    var second = document.createElement('div');
    second.setAttribute('class', 'col-md-2');
    second.appendChild(genBudgetsSelectBox(_id, _budget_id));

    var third = document.createElement('div');
    third.setAttribute('class', 'col-md-2');
    var sel2 = document.createElement('select');
    sel2.setAttribute('class', 'custom-select form-control');
    sel2.setAttribute('id', 'split_with_' + _id + '_' + _budget_id);
    sel2.setAttribute('name', 'split_with_' + _id);
    sel2.addEventListener('change', function() {
        splitWithChanged(_id, _budget_id);
    });

    var op1 = document.createElement('option');
    op1.setAttribute('value', 'amount');
    op1.innerHTML = "Amount";
    var op2 = document.createElement('option');
    op2.setAttribute('value', 'percentage');
    op2.innerHTML = "Percentage";
    sel2.appendChild(op1);
    sel2.appendChild(op2);
    third.appendChild(sel2);

    var forth = document.createElement('div');
    forth.setAttribute('class', 'col-md-2');
    forth.setAttribute('id', 'split_dollar_input_' + _id + '_' + _budget_id);
    forth.appendChild(inputGroup(_id, _budget_id, true, "$", "dollar"));

    var hiddenForth = document.createElement('div');
    hiddenForth.setAttribute('class', 'col-md-2 hidden');
    hiddenForth.setAttribute('id', 'split_percent_input_' + _id + '_' + _budget_id);
    hiddenForth.appendChild(inputGroup(_id, _budget_id, false, "%", "percent"));

    var fifth = document.createElement('div');
    fifth.setAttribute('class', 'col-md-1');
    var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    if (init) {
        btn.setAttribute('class', 'btn btn-icon rounded-circle btn-flat-success');
        btn.setAttribute('id', 'budget_btn_' + _id + '_' + _budget_id);
    } else {
        btn.setAttribute('class', 'btn btn-icon rounded-circle btn-flat-danger');
        btn.setAttribute('id', 'budget_btn_' + _id + '_' + _budget_id);
    }
    
    var icon = document.createElement('i');
    if (init) {
        icon.setAttribute('class', 'feather icon-plus-circle');
    } else {
        icon.setAttribute('class', 'feather icon-x-circle');
    }
    btn.appendChild(icon);
    if (init) {
        btn.onclick = function() {
            console.log(budgetIds);
            document.getElementById(`budget_${_id}_${budgetIds[_id-1]-1}`).after(addBudget(_id, budgetIds[_id - 1]++, false));
        }
    } else {
        btn.onclick = function() {
            document.getElementById('budget_' + _id + '_' + _budget_id).remove();
            updateLastSplitVal(_id, budgetMap.get(_id).total);
        };
    }
    fifth.appendChild(btn);
    
    row.appendChild(first);
    row.appendChild(second);
    row.appendChild(third);
    row.appendChild(forth);
    row.appendChild(hiddenForth);
    row.appendChild(fifth);
    box.appendChild(row);
    box.appendChild(addBudgetOptions(_id, _budget_id));

    return box;
}

/** 
 * Generate input group with prepend or append label
 * @param _id id for line item
 * @param _budget_id id for budget number in this line item
 * @param {boolean} isPre a mark to indicate need prepend label or append label
 * @param {string} label what's the label is (e.g. "$" or "%")
 * @param {string} name use to set the input id
 * The input group is unique for every budget number, 
 * so we use format split_{dollar-or-percent}_input_value_{line-item-id}_{budget-id} to set input id
 */
function inputGroup(_id, _budget_id, isPre, label, name) {
    var f = document.createElement('fieldset');
    var d = document.createElement('div');
    d.setAttribute('class', 'input-group');

    var sig = document.createElement('div');
    if (isPre) {
        sig.setAttribute('class', 'input-group-prepend');
    } else {
        sig.setAttribute('class', 'input-group-append');
    }
    var s = document.createElement('span');
    s.setAttribute('class', 'input-group-text');
    s.innerHTML = label;
    sig.appendChild(s);

    var i = document.createElement('input');
    i.setAttribute('class', 'form-control');
    i.setAttribute('type', 'text');
    i.setAttribute('id', 'split_' + name + '_input_value_' + _id + '_' + _budget_id);
    i.setAttribute('name', 'split_' + name + '_input_value_' + _id);
    i.setAttribute('disabled', '');

    if (isPre) {
        d.appendChild(sig);
        d.appendChild(i);
    } else {
        d.appendChild(i);
        d.appendChild(sig);
    }

    f.appendChild(d);
    return f;

}


/** 
 * Generate task/option/project options behind each budget number 
 */
function addBudgetOptions(_id, _budget_id) {
    var row = document.createElement('div');
    row.setAttribute('class', 'form-group row');

    var zero = document.createElement('div');
    zero.setAttribute('class', 'col-md-4');

    var first = document.createElement('div');
    first.setAttribute('class', 'col-md-1');
    first.appendChild(addNewBudgetInfoCheckbox(_id, _budget_id, 1));

    var second = document.createElement('div');
    second.setAttribute('class', 'col-md-1');
    second.appendChild(addNewBudgetInfoCheckbox(_id, _budget_id, 2));

    var third = document.createElement('div');
    third.setAttribute('class', 'col-md-1');
    third.appendChild(addNewBudgetInfoCheckbox(_id, _budget_id, 3));
    
    row.appendChild(zero);
    row.appendChild(first);
    row.appendChild(addNewBudgetInfoInput(_id, _budget_id, 1));
    row.appendChild(second);
    row.appendChild(addNewBudgetInfoInput(_id, _budget_id, 2));
    row.appendChild(third);
    row.appendChild(addNewBudgetInfoInput(_id, _budget_id, 3));

    return row;
}

/**
 * Add additional information checkboxes for a certain budget number
 * @param {int} _id the line item id
 * @param {int} _budget_id the budget id of this line item
 * @param {int} seq the info sequence of this budget number (1-task, 2-option, 3-project)
 */
function addNewBudgetInfoCheckbox(_id, _budget_id, seq) {
    var list = document.createElement('ul');
    list.setAttribute('class', 'list-unstyled mb-0');
    var bullet = document.createElement('li');
    bullet.setAttribute('class', 'd-inline-block mr-2');
    var f = document.createElement('fieldset');
    var d = document.createElement('div');
    d.setAttribute('class', 'custom-control custom-checkbox');
    var i = document.createElement('input');
    i.setAttribute('type', 'checkbox');
    i.setAttribute('class', 'custom-control-input');
    i.setAttribute('id', 'budget-info-' + _id + '-' + _budget_id + '-' + seq);
    i.addEventListener('change', function() {
        toggleInputBox(_id, _budget_id, seq);
    });
    var l = document.createElement('label');
    l.setAttribute('class', 'custom-control-label');
    l.setAttribute('for', 'budget-info-' + _id + '-' + _budget_id + '-' + seq);
    if (seq == 1) {
        l.innerHTML = "Task";
    } else if (seq == 2) {
        l.innerHTML = "Option";
    } else if (seq == 3) {
        l.innerHTML = "Project";
    }
    d.appendChild(i);
    d.appendChild(l);
    f.appendChild(d);
    bullet.appendChild(f);
    list.appendChild(bullet);
    return list;
}

/**
 * Add the budget information input row
 * @param {int} _id 
 * @param {int} _budget_id 
 * @param {int} seq the info sequence of this budget number (1-task, 2-option, 3-project)
 */
function addNewBudgetInfoInput(_id, _budget_id, seq) {
    var div = document.createElement('div');
    if (seq == 1 || seq == 2) {
        div.setAttribute('class', 'col-md-2 hidden');
    } else if (seq == 3) {
        div.setAttribute('class', 'col-md-3 hidden');
    }
    div.setAttribute('id', 'budget-info-input-' + _id + '-' + _budget_id + '-' + seq);
    var i = document.createElement('input');
    i.setAttribute('type', 'text');
    i.setAttribute('class', 'form-control');
    i.setAttribute('id', 'budget-info-value-' + _id + '-' + _budget_id + '-' + seq);
    if (seq == 1) {
        i.setAttribute('name', 'budget-task-' + _id);
    } else if (seq == 2) {
        i.setAttribute('name', 'budget-option-' + _id);
    } else if (seq == 3) {
        i.setAttribute('name', 'budget-project-' + _id);
    }
    
    div.appendChild(i);
    return div;
}

/**
 * Determine if the additional budget info input box triggered
 * @param {int} _id 
 * @param {int} _budget_id 
 * @param {int} seq 
 */
function toggleInputBox(_id, _budget_id, seq) {
    var checkbox = document.getElementById('budget-info-' + _id + '-' + _budget_id + '-' + seq);
    var infoInput = document.getElementById('budget-info-input-' + _id + '-' + _budget_id + '-' + seq);
    if (checkbox.checked) {
        if (seq == 1 || seq == 2) {
            infoInput.setAttribute('class', 'col-md-1');
        } else if (seq == 3) {
            infoInput.setAttribute('class', 'col-md-2');
        }
    } else {
        if (seq == 1 || seq == 2) {
            infoInput.setAttribute('class', 'col-md-1 hidden');
        } else if (seq == 3) {
            infoInput.setAttribute('class', 'col-md-2 hidden');
        }
    }
}


/** 
 * Split with amount or percentage controller
 * Use to transfer between split with amount or percentage
 * Each split select box and input value is bound to a single budget number,
 * so we use split_with_{line-item-id}_{budget-id} to set select box id
 * use split_input_with_{line-item-id}_{budget-id} to set user input id
 */
function splitWithChanged(_id, _budget_id) {
    var sel = document.getElementById('split_with_' + _id + '_' + _budget_id);
    // var pick = sel.options[sel.selectedIndex].value;
    var pick = sel.value;
    var dollar = document.getElementById('split_dollar_input_' + _id + '_' + _budget_id);
    var perc = document.getElementById('split_percent_input_' + _id + '_' + _budget_id);
    if (pick == "amount") {
        dollar.setAttribute('class', 'col-md-2 visible');
        perc.setAttribute('class', 'col-md-2 hidden');
    } else if (pick == "percentage") {
        dollar.setAttribute('class', 'col-md-2 hidden');
        perc.setAttribute('class', 'col-md-2 visible');
    }
}

function genBudgetsSelectBox(_id, _budget_id) {
    var sel = document.createElement('select');
    sel.setAttribute('class', 'custom-select form-control');
    sel.setAttribute('name', 'budget_num_' + _id);
    sel.setAttribute('id', 'budget_num_' + _id + '_' + _budget_id);
    // sel.setAttribute('required', '');
    sel.appendChild(addBudgetData('0'));
    
    for (var i = 0; i < budgets_database.length; i++) {
        var num = budgets_database[i];
        sel.appendChild(addBudgetData(num));
    }

    return sel;
}




/** 
 * BEGIN: Confirm & Delete Line Item Controller
 * @param _id line item id
 * @param {array} lineItems global variable, an array to store all line items of this form
 * Add all confirmed items to global variables lineItems array
 * Remove the delete item from global variables lineItems array
 */

/** Confirm function */
function confirmItem(_id) {
    if (window.sessionStorage.getItem('RequestType')) {
        request_type = window.sessionStorage.getItem('RequestType');
    }
    // If this id exists (the item is not deleted)
    if (idFlags[_id]) {

        /** Get budgets info */
        var budgetsNumArr = document.getElementsByName('budget_num_' + _id);
        var tasksArr = document.getElementsByName('budget-task-' + _id);
        var optionsArr = document.getElementsByName('budget-option-' + _id);
        var projectsArr = document.getElementsByName('budget-project-' + _id);
        var budgetsLen = budgetsNumArr.length;

        /** Front-end control */
        // for (var i = 0; i < budgetsLen; i++) {
        //     var budgetId = i + 1;
        //     var btn = document.getElementById('budget_btn_' + _id + '_' + budgetId);
        //     btn.remove();
        // }
        // var checkBtn = document.getElementById('confirm_' + _id);
        // checkBtn.remove();

        
        /** Build budgets array data structure */
        var budgetsArr = [];
        if (budgetsLen == 1) {
            budgetsArr.push({
                Number: budgetsNumArr[0].value,
                Split: "100%",
                Task: document.getElementById(`budget-info-${_id}-1-1`).checked ? tasksArr[0].value : null,
                Option: document.getElementById(`budget-info-${_id}-1-2`).checked ? optionsArr[0].value : null,
                Project: document.getElementById(`budget-info-${_id}-1-3`).checked ? projectsArr[0].value : null
            });
        } else {
            for (var i = 0; i < budgetsLen; i++) {
                var num = budgetsNumArr[i].value;
                var perOrDolSel = document.getElementsByName('split_with_' + _id)[i];
                var perOrDolVal = perOrDolSel.options[perOrDolSel.selectedIndex].value;
                var splitVal = "";
                if (perOrDolVal == "amount") {
                    splitVal = "$" + document.getElementsByName('split_dollar_input_value_' + _id)[i].value;
                } else if (perOrDolVal == "percentage") {
                    splitVal = document.getElementsByName('split_percent_input_value_' + _id)[i].value + "%";
                }
                budgetsArr.push({
                    Number: num,
                    Split: splitVal,
                    Task: document.getElementById(`budget-info-${_id}-${i + 1}-1`).checked ? tasksArr[i].value : null,
                    Option: document.getElementById(`budget-info-${_id}-${i + 1}-2`).checked ? optionsArr[i].value : null,
                    Project: document.getElementById(`budget-info-${_id}-${i + 1}-3`).checked ? projectsArr[i].value : null
                });
            }
        }
        // console.log('budgets array:');
        // console.log(budgetsArr);

        if (request_type == "Purchase Request") {
            var q = document.getElementById('quantity_' + _id).value;
            var u = document.getElementById('unit_price_' + _id).value;
            var amount = q * u;

            lineItems.push({
                id: _id,
                Expense: document.getElementById('expense_' + _id).value,
                Purpose: document.getElementById('purpose_' + _id).value,
                Category: document.getElementById('category_' + _id).value,
                Quantity: document.getElementById('quantity_' + _id).value,
                UnitPrice: document.getElementById('unit_price_' + _id).value,
                Budgets: budgetsArr,
                Amount: amount
            });
        } else if (request_type == "Pay an Invoice") {
            lineItems.push({
                id: _id,
                Expense: document.getElementById('expense_' + _id).value,
                Purpose: document.getElementById('purpose_' + _id).value,
                Category: document.getElementById('category_' + _id).value,
                Budgets: budgetsArr,
                Amount: document.getElementById('amount_' + _id).value,
            });
        } else {
            lineItems.push({
                id: _id,
                Expense: document.getElementById('expense_' + _id).value,
                Purpose: document.getElementById('purpose_' + _id).value,
                Category: document.getElementById('category_' + _id).value,
                Budgets: budgetsArr,
                Amount: document.getElementById('amount_' + _id).value,
                TaxPaid: document.querySelector(`input[name="taxRadio${_id}"]:checked`).value
            });
        }

    }

}

/** Delete function */
function removeLineItem(_id) {
    var box = document.getElementById('lineItemBox_' + _id);
    box.remove();
    idFlags[_id] = false;
}



/** 
 * BEGIN: New Line Item Controller 
 * @param _id line item id, assigned by idFlags.length, starts from 1
 *            each time when user add a new line item this _id will increase by 1 
 *            which serves as a unique id for all components inside this line item
 *            when this item (block) is deleted, the corresponding idFlag will turn to false
 * Users can add one more line item by clicking add-new-line-item button
 * This funtion will generate all needed components of each line item,
 * exactly the same as original box,
 * and each component and input value have unique id
 */

/** Core function */
function addNewLineItem(_id) {
    if (window.sessionStorage.getItem('RequestType')) {
        request_type = window.sessionStorage.getItem('RequestType');
    }
    idFlags.push(true);

    var newBox = document.createElement('div');
    newBox.setAttribute('class', 'row d-flex justify-content-center');
    newBox.setAttribute('id', 'lineItemBox_' + _id);

    var newFeild = document.createElement('div');
    newFeild.setAttribute('class', 'col-11');
    newFeild.setAttribute('style', 'margin-top: 1rem; padding-top: 1.5rem; border-top: 1px dashed #d9d9d9;');

    var form = document.createElement('div');
    form.setAttribute('class', 'form form-horizontal');
    
    var formBody = document.createElement('div');
    formBody.setAttribute('class', 'form-body');

    var row = document.createElement('div');
    row.setAttribute('class', 'row');

    // append new line item content
    row.appendChild(addNewExpense(_id));
    row.appendChild(addNewPurpose(_id));
    row.appendChild(addNewCategory(_id));
    if (request_type == "Purchase Request") {
        row.appendChild(addNewQuantity(_id));
        row.appendChild(addNewUnitPrice(_id));
    } else {
        row.appendChild(addNewAmount(_id));
    }
    if (request_type == "Reimbursement" || request_type == "Procard Receipt") {
        row.appendChild(addNewTax(_id));
    }
    row.appendChild(addBudget(_id, 1, true));

    formBody.appendChild(row);
    form.appendChild(formBody);
    newFeild.appendChild(form);
    newBox.appendChild(newFeild);
    var end = document.getElementById('new_line_item');
    end.before(newBox);

}

/** 
 * Add expense block
 * @param {int} _id line item id
 */
function addNewExpense(_id) {
    var box = document.createElement('div');
    box.setAttribute('class', 'col-12');

    var row = document.createElement('div');
    row.setAttribute('class', 'form-group row');

    var first = document.createElement('div');
    first.setAttribute('class', 'col-md-4');
    first.innerHTML = "<span>Expense Description</span>";

    var second = document.createElement('div');
    second.setAttribute('class', 'col-md-7');
    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'expense_' + _id);
    input.setAttribute('class', 'form-control');
    input.setAttribute('name', 'expense');
    input.setAttribute('placeholder', 'Expense Description');
    second.appendChild(input);

    var third = document.createElement('div');
    third.setAttribute('class', 'col-md-1');
    var button = document.createElement('button');
    button.setAttribute('class', 'btn btn-icon rounded-circle btn-flat-danger');
    button.setAttribute('id', 'delete_' + _id);
    button.setAttribute('type', 'button');
    button.onclick = function() {
        removeLineItem(_id);
    };
    var icon = document.createElement('i');
    icon.setAttribute('class', 'feather icon-x-circle');
    button.appendChild(icon);
    third.appendChild(button);
    
    row.appendChild(first);
    row.appendChild(second);
    row.appendChild(third);
    box.appendChild(row);

    return box; 
}

/**
 * Add business purpose block
 * @param {int} _id 
 */
function addNewPurpose(_id) {
    var box = document.createElement('div');
    box.setAttribute('class', 'col-12');

    var row = document.createElement('div');
    row.setAttribute('class', 'form-group row');

    var first = document.createElement('div');
    first.setAttribute('class', 'col-md-4');
    first.innerHTML = "<span>Business Purpose</span>";

    var second = document.createElement('div');
    second.setAttribute('class', 'col-md-7');
    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'purpose_' + _id);
    input.setAttribute('class', 'form-control');
    input.setAttribute('name', 'purpose');
    input.setAttribute('placeholder', 'Business Purpose');
    second.appendChild(input);
    
    row.appendChild(first);
    row.appendChild(second);
    box.appendChild(row);

    return box; 
}

/**
 * Add category block
 * @param {int} _id line item id
 */
function addNewCategory(_id) {
    var box = document.createElement('div');
    box.setAttribute('class', 'col-12');

    var row = document.createElement('div');
    row.setAttribute('class', 'form-group row');

    var first = document.createElement('div');
    first.setAttribute('class', 'col-md-4');
    first.innerHTML = "<span>Category</span>";

    var second = document.createElement('div');
    second.setAttribute('class', 'col-md-4');
    var select = document.createElement('select');
    select.setAttribute('class', 'custom-select form-control');
    select.setAttribute('id', 'category_' + _id);
    var option1 = document.createElement('option');
    option1.setAttribute('value', '');
    option1.innerHTML = "Please select";
    select.appendChild(option1);
    second.appendChild(select);
    
    row.appendChild(first);
    row.appendChild(second);
    box.appendChild(row);

    return box; 
}

/**
 * Add amount block
 * @param {int} _id line item id
 */
function addNewAmount(_id) {
    var box = document.createElement('div');
    box.setAttribute('class', 'col-12');

    var row = document.createElement('div');
    row.setAttribute('class', 'form-group row');

    var first = document.createElement('div');
    first.setAttribute('class', 'col-md-4');
    first.innerHTML = "<span>Amount</span>";

    var second = document.createElement('div');
    second.setAttribute('class', 'col-md-4 col-12 mb-1');
    var fieldset = document.createElement('fieldset');
    var group = document.createElement('div');
    group.setAttribute('class', 'input-group');
    var prepend = document.createElement('div');
    prepend.setAttribute('class', 'input-group-prepend');
    prepend.innerHTML = "<span class='input-group-text'>$</span>";
    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('class', 'form-control');
    input.setAttribute('name', 'amount');
    input.setAttribute('placeholder', '0.00');
    input.setAttribute('aria-label', 'Amount (to the nearest dollar)');
    input.setAttribute('id', 'amount_' + _id);
    input.addEventListener('change', function() {
        updateLastSplitVal(_id, parseFloat(this.value));
    });
    group.appendChild(prepend);
    group.appendChild(input);
    fieldset.appendChild(group);
    second.appendChild(fieldset);
    
    row.appendChild(first);
    row.appendChild(second);
    box.appendChild(row);

    return box; 
}

/**
 * Add tax block
 * @param {int} _id 
 */
function addNewTax(_id) {
    var box = document.createElement('div');
    box.setAttribute('class', 'col-12');
    var row = document.createElement('div');
    row.setAttribute('class', 'form-group row');

    var first = document.createElement('div');
    first.setAttribute('class', 'col-md-4');
    first.innerHTML = "<span>Was Sales Tax Paid?</span>";

    var second = document.createElement('div');
    second.setAttribute('class', 'col-md-8');
    var list = document.createElement('ul');
    list.setAttribute('class', 'list-unstyled mb-0');
    for (var x = 1; x <= 3; x++) {
        list.appendChild(addNewTaxRadio(_id, x));
    }
    second.appendChild(list);
    
    row.appendChild(first);
    row.appendChild(second);
    box.appendChild(row);

    return box; 
}

/**
 * Helper function to add new radio for tax block
 * @param {int} _id line item id
 * @param {int} seq the sequence of this radio, use to set unique id
 * @param {string} label the label of this radio
 */
function addNewTaxRadio(_id, seq) {
    var bullet = document.createElement('li');
    bullet.setAttribute('class', 'd-inline-block mr-2');
    var f = document.createElement('fieldset');
    var d = document.createElement('div');
    d.setAttribute('class', 'custom-control custom-radio');
    var i = document.createElement('input');
    i.setAttribute('type', 'radio');
    i.setAttribute('class', 'custom-control-input');
    i.setAttribute('name', 'taxRadio' + _id);    
    i.setAttribute('id', 'taxRadio-' + _id + '-' + seq);
    var l = document.createElement('label');
    l.setAttribute('class', 'custom-control-label');
    l.setAttribute('for', 'taxRadio-' + _id + '-' + seq);
    if (seq == 1) {
        i.setAttribute('value', 'yes');
        l.innerHTML = "Yes";
    } else if (seq == 2) {
        i.setAttribute('value', 'no');
        l.innerHTML = "No";
    } else if (seq == 3) {
        i.setAttribute('value', 'nontaxable');
        l.innerHTML = "Item Not Taxable";
    }
    
    d.appendChild(i);
    d.appendChild(l);
    f.appendChild(d);
    bullet.appendChild(f);

    return bullet;
}


/**
 * Add quantity block
 * @param {int} _id line item id
 */
function addNewQuantity(_id) {
    var box = document.createElement('div');
    box.setAttribute('class', 'col-12');

    var row = document.createElement('div');
    row.setAttribute('class', 'form-group row');

    var first = document.createElement('div');
    first.setAttribute('class', 'col-md-4');
    first.innerHTML = "<span>Quantity</span>";
    
    row.appendChild(first);
    row.appendChild(genNumberInputGroup(_id));
    box.appendChild(row);

    return box; 
}


function genNumberInputGroup(_id) {
    var box = document.createElement('div');
    box.setAttribute('class', 'input-group bootstrap-touchspin');

    var preSpan = document.createElement('span');
    preSpan.setAttribute('class', 'input-group-btn input-group-prepend bootstrap-touchspin-injected');
    var preBtn = document.createElement('button');
    preBtn.setAttribute('type', 'button');
    preBtn.setAttribute('class', 'btn btn-primary bootstrap-touchspin-down');
    var preIcon = document.createElement('i');
    preIcon.setAttribute('class', 'feather icon-chevron-down');
    preBtn.appendChild(preIcon);
    preSpan.appendChild(preBtn);

    var input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.setAttribute('class', 'touchspin-icon form-control');
    input.setAttribute('value', '1');
    input.setAttribute('id', 'quantity_' + _id);

    var postSpan = document.createElement('span');
    postSpan.setAttribute('class', 'input-group-btn input-group-append bootstrap-touchspin-injected');
    var postBtn = document.createElement('button');
    postBtn.setAttribute('type', 'button');
    postBtn.setAttribute('class', 'btn btn-primary bootstrap-touchspin-up');
    var postIcon = document.createElement('i');
    postIcon.setAttribute('class', 'feather icon-chevron-up');
    postBtn.appendChild(postIcon);
    postSpan.appendChild(postBtn);

    box.appendChild(preSpan);
    box.appendChild(input);
    box.appendChild(postSpan);
    return box;
}


/**
 * Add unit price block
 * @param {int} _id line item id
 */
function addNewUnitPrice(_id) {
    var box = document.createElement('div');
    box.setAttribute('class', 'col-12');

    var row = document.createElement('div');
    row.setAttribute('class', 'form-group row');

    var first = document.createElement('div');
    first.setAttribute('class', 'col-md-4');
    first.innerHTML = "<span>Unit Price</span>";

    var second = document.createElement('div');
    second.setAttribute('class', 'col-md-4 col-12 mb-1');
    var fieldset = document.createElement('fieldset');
    var group = document.createElement('div');
    group.setAttribute('class', 'input-group');
    var prepend = document.createElement('div');
    prepend.setAttribute('class', 'input-group-prepend');
    prepend.innerHTML = "<span class='input-group-text'>$</span>";
    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('class', 'form-control');
    // input.setAttribute('placeholder', '0.00');
    input.setAttribute('aria-label', 'Amount (to the nearest dollar)');
    input.setAttribute('id', 'unit_price_' + _id);
    input.setAttribute('name', 'unit-price-' + _id);
    group.appendChild(prepend);
    group.appendChild(input);
    fieldset.appendChild(group);
    second.appendChild(fieldset);
    
    row.appendChild(first);
    row.appendChild(second);
    box.appendChild(row);

    return box; 
}


/**
 * @param {int} _id line item id
 * @param {int} file_id file id in this line item
 * @param {boolean} init indicate if this is the original file input in this line item
 * For now, there is no plus button behind the first file upload input (set it to hidden)
 * Which means users can only upload one file for one line item
 * So when calling this function, file_id will always be 1, init will always be true
 */
function addOneMoreFile(file_id) {
    var row = document.createElement('div');
    row.setAttribute('class', 'form-group row');
    row.setAttribute('id', 'file_row_' + file_id);

    var first = document.createElement('div');
    first.setAttribute('class', 'col-md-4');
    // if (init) {
    //     first.innerHTML = "<span>Upload Receipt</span>"
    // }

    var second = document.createElement('div');
    second.setAttribute('class', 'col-md-3');
    var file = document.createElement('input');
    file.setAttribute('type', 'file');
    file.setAttribute('name', 'file_input');
    file.setAttribute('id', 'file_' + file_id);
    second.appendChild(file);

    var third = document.createElement('div');
    third.setAttribute('class', 'col-md-1');
    var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    // if (init) {
    //     btn.setAttribute('class', 'btn btn-icon rounded-circle btn-flat-success');
    // } else {
    //     btn.setAttribute('class', 'btn btn-icon rounded-circle btn-flat-danger');
    // }
    btn.setAttribute('class', 'btn btn-icon rounded-circle btn-flat-danger');
    btn.setAttribute('id', 'file_btn_' + file_id);

    var icon = document.createElement('i');
    // if (init) {
    //     icon.setAttribute('class', 'feather icon-plus-circle');
    // } else {
    //     icon.setAttribute('class', 'feather icon-x-circle');
    // }
    icon.setAttribute('class', 'feather icon-x-circle');
    btn.appendChild(icon);
    // if (init) {
    //     btn.onclick = function() {
    //         document.getElementById('file_box_' + _id + '_' + file_id).after(addOneMoreFile(_id, file_id + 1, false));
    //     }
    // } else {
    //     btn.onclick = function() {
    //         document.getElementById('file_box_' + _id + '_' + file_id).remove();
    //     };
    // }
    btn.onclick = function() {
        document.getElementById('file_row_' + file_id).remove();
    };
    third.appendChild(btn);

    // var forth = document.createElement('div');
    // forth.setAttribute('class', 'col-md-1 offset-md-3');
    // var confirm_btn = document.createElement('button');
    // confirm_btn.setAttribute('type', 'button');
    // confirm_btn.setAttribute('class', 'btn btn-icon rounded-circle btn-flat-success');
    // confirm_btn.setAttribute('id', 'confirm_' + _id);
    // var i = document.createElement('i');
    // i.setAttribute('class', 'fa fa-check');
    // confirm_btn.appendChild(i);
    // confirm_btn.onclick = function() {
    //     confirmItem(_id);
    // }
    // forth.appendChild(confirm_btn);

    row.appendChild(first);
    row.appendChild(second);
    row.appendChild(third);
    // row.appendChild(forth);
    return row;
}