var historyCard = document.getElementById("history_card");
var requestHistory = document.getElementById("request-history");

var noteCard = document.getElementById("note_card");
var noteContent = document.getElementById("notes");

var notesArr = [];


window.addEventListener('load', function() {
    updateHistory(requestInfo);
    prepareNotesArr(requestInfo);
    updateNotes();
});


/**
 * Collect note information into global variable notesArr from database
 * @param {JSON Object} data Request data got from database
 */
function prepareNotesArr(data) {
    var info = data.ChatInfo;
    for (var x = 0; x < info.length; x++) {
        notesArr.push({
            Name: info[x].userName,
            Time: info[x].timeStamp,
            Comment: info[x].comment
        });
    }
}


/**
 * Update the content of note block based on global variable notesArr
 */
function updateNotes() {
    noteContent.innerHTML = "";
    noteCard.style.height = `${historyCard.clientHeight}px`;
    for (var x = 0; x < notesArr.length; x++) {
        var p = document.createElement('p');
        var n = document.createElement('span');
        n.setAttribute('class', 'mr-1');
        n.innerHTML = notesArr[x].Name;
        var t = document.createElement('span');
        t.setAttribute('class', 'mr-1');
        t.innerHTML = moment(notesArr[x].Time).format('MMMM Do YYYY h:mm:ss a');
        var c = document.createElement('span');
        c.setAttribute('class', 'mr-1');
        c.innerHTML = notesArr[x].Comment;
        p.appendChild(n);
        p.appendChild(t);
        p.appendChild(c);
        noteContent.appendChild(p);
    }
}

function updateHistory(data) {
    var history = data.OrderHistory;
    for (var x = 0; x < history.length; x++) {
        requestHistory.appendChild(genHistoryStamp(history[x].action, history[x].userName, history[x].timeStamp));
    }
}

function genHistoryStamp(action, name, timestamp) {
    var stamp = document.createElement('li');
    var signal = document.createElement('div');
    var info = document.createElement('div');
    var time = document.createElement('small');

    var i = document.createElement('i');
    if (action == "Submitted" || action == "Updated") {
        i.setAttribute('class', 'feather icon-file-text font-medium-2');
        signal.setAttribute('class', 'timeline-icon bg-primary');
    } else if (action.indexOf("Approved") > -1 || action.indexOf("Accepted") > -1) {
        i.setAttribute('class', 'feather icon-thumbs-up font-medium-2');
        signal.setAttribute('class', 'timeline-icon bg-warning');
    } else if (action.indexOf("Sent") > -1) {
        i.setAttribute('class', 'feather icon-alert-circle font-medium-2');
        signal.setAttribute('class', 'timeline-icon bg-danger');
    } else if (action == "Claimed" || action == "Completed") {
        i.setAttribute('class', 'feather icon-check font-medium-2');
        signal.setAttribute('class', 'timeline-icon bg-success');
    } else { // assign / reassign / untake
        i.setAttribute('class', 'feather icon-flag font-medium-2');
        signal.setAttribute('class', 'timeline-icon bg-info');
    }
    signal.appendChild(i);

    var p = document.createElement('p');
    p.setAttribute('class', 'font-weight-bold');
    p.innerHTML = action;
    info.appendChild(p);
    var span = document.createElement('span');
    span.innerHTML = "By " + name;

    time.innerHTML = moment(timestamp).format('MMMM Do YYYY h:mm:ss a');

    info.appendChild(span);
    stamp.appendChild(signal);
    stamp.appendChild(info);
    stamp.appendChild(time);
    return stamp;
}