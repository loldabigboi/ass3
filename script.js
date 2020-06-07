//Global variables of commonly used HTML elements
const page_container = document.getElementById("page-container");
const page_cover = document.getElementById("page-cover");

const search_bar = document.getElementById('file-search')
const curr_assignments = document.getElementById('curr-assignments');
const files_list = document.getElementById('files-list')
const size_div = document.getElementById('file-size-container')
const time_div = document.getElementById('file-time-container')
const ribbons_container = document.getElementById("sort-ribbons-container");
const banner = document.getElementById("assignment-details")

// Dictionary of commonly used popups
const id_dict = {
    "group-popup": document.getElementById("group-popup"),
    "assignment-popup": document.getElementById("assignment-popup"),
    "assignment-deletion-confirmation-popup": document.getElementById("assignment-deletion-confirmation-popup"),
    "file-deletion-confirmation-popup": document.getElementById("file-deletion-confirmation-popup"),
    "upload-files-popup": document.getElementById("upload-files-popup"),
}

// Close the side bar after window is resized below 1150px
const sidebar = document.getElementById("sidebar");
const sidebar_toggle = document.getElementById("sidebar-toggle-button");
let wasBelowMin = false;
let resizeListener = (event) => {
    const belowMin = window.innerWidth < 1150;
    if (belowMin != wasBelowMin) {
        wasBelowMin = belowMin;
        if (belowMin) {
            sidebar.classList.add("sidebar-slideout");
            sidebar.classList.add("sidebar-hidden");
            sidebar_toggle.style.display = "block";
        } else {
            resetSidebar();
        }
    }
}
window.addEventListener("resize", resizeListener);
window.addEventListener("load", resizeListener);  // to account for when window is small when website first opened

// Hide the side bar
const toggleSidebar = function () {
    sidebar.classList.toggle("sidebar-hidden");
    sidebar_toggle.classList.toggle("rotated");
}

// Reset the side bar class state (make visible)
const resetSidebar = function () {
    sidebar.classList.remove("sidebar-slideout");
    sidebar.classList.remove("sidebar-hidden");
    sidebar_toggle.classList.remove("rotated");
    sidebar_toggle.style.display = "none";
}

const file_items = document.getElementsByClassName("file-item");
const file_name_items = document.getElementsByClassName("file-name-item");
const file_containers = document.getElementsByClassName("file-container");

const fileListEventWrapper = function (event, className, add) {
    const source = event.target || event.srcElement;
    const index = Array.from(source.parentNode.children).indexOf(source)
    for (let i_ = 0; i_ < file_containers.length; i_++) {
        if (add) {
            file_containers[i_].children[index].classList.add(className);
        } else {
            file_containers[i_].children[index].classList.remove(className);
        }
    }
}

// Open a popup with and perform id dependant actions
let currPopupId = ""
function openPopup(id) {
    if (id === "upload-files-popup") {
        // Reset file name field
        document.getElementById("file-name-readonly").value = "";
    }
    currPopupId = id;
    id_dict[id].style.display = "block";
    page_container.style.filter = "blur(3px)";
    page_cover.style.display = "block";
    page_container.addEventListener("mousedown", closePopup);
}

// Close a popup
let closePopup = function () {
    id_dict[currPopupId].style.display = "none";
    page_container.style.filter = "none";
    page_cover.style.display = "none";
    page_container.removeEventListener("mousedown", closePopup);
}

// Filter file list based on user input
function searchFilter() {
    for (i = 0; i < files_list.children.length; ++i) {
        if (files_list.children[i].children[0].innerText.toLowerCase().includes(search_bar.value.toLowerCase())) {
            files_list.children[i].style.display = "flex"
        } else {
            files_list.children[i].getElementsByTagName("input")[0].checked = false;
            files_list.children[i].style.display = "none"
        }
    }
}

// Populate file list with the files associated with the selected assignment
function populateFileList(element) {
    for (let i = 0; i < files_list.children.length; i++) {
        if (files_list.children[i].getAttribute("data-assignment-id") === element.getAttribute("data-assignment-id")) {
            files_list.children[i].classList.remove("hidden");
        } else {
            files_list.children[i].getElementsByTagName("input")[0].checked = false;
            files_list.children[i].classList.add("hidden");
        }
    }
}

// Select all the files in the current file window
function selectAllFiles() {
    const checkboxes = document.getElementsByClassName("file-checkbox");

    let allSelected = true;
    for (let i = 0; i < checkboxes.length; i++) {
        const file_item = checkboxes[i].parentElement.parentElement.parentElement;
        if (!file_item.classList.contains("hidden") && !checkboxes[i].checked) {  // ignore hidden files
            allSelected = false;
            break;
        }
    }

    for (let i = 0; i < checkboxes.length; i++) {
        const file_item = checkboxes[i].parentElement.parentElement.parentElement;
        if (!file_item.classList.contains("hidden")) {  // only toggle if file not hidden
            checkboxes[i].checked = !allSelected;
        }
    }

}

// Check if any files are selected for deletion
function filesSelected() {
    for (let i = 0; i < files_list.children.length; i++) {
        const file_item = files_list.children[i];
        if (file_item.getElementsByTagName("input")[0].checked) {
            return true;
        }
    }
    return false;
}

// Delete files if they are `checked`
var last_deleted = []
function deleteSelectedFiles() {
    let toDelete = [];
    for (let i = 0; i < files_list.children.length; i++) {
        const file_item = files_list.children[i];
        if (file_item.getElementsByTagName("input")[0].checked) {
            toDelete.push(file_item);
        }
    }

    if (toDelete.length == 0) { 
        return;
    }

    toDelete.forEach((item) => {
        last_deleted.push(item)
        files_list.removeChild(item);
    })
    
    notificationUndoDelete();
}

let reverseDict = {
    "name": false,
    "size": false,
    "time": false
}

// Sort files based on their properties (name, size, date)
function sortFiles(src) {

    let type = src.getAttribute('data-type');
    let sortFunc;
    if (type === "name") {
        sortFunc = function(e1, e2) {
            return e1.innerText.trim().localeCompare(e2.innerText.trim());
        }
    } else {
        sortFunc = function(e1, e2) {
            return Number(e1.getAttribute("data-" + type + "-ord")) - Number(e2.getAttribute("data-" + type + "-ord"));
        }
    }

    let elems = files_list.children;

    let array = [];
    for (let i = 0; i < elems.length; i++) {
        array[i] = elems[i].cloneNode(true);
    }

     // set button reverse state and reset all other button reverse states
    for (let i = 0; i < ribbons_container.children.length; i++) {

        const sort_ribbon = ribbons_container.children[i];
        let ribbon_type = sort_ribbon.getAttribute("data-type");
        if (ribbon_type != type) {
            reverseDict[ribbon_type] = false
            sort_ribbon.classList.remove("reversed");
        } else {
            reverseDict[ribbon_type] = !reverseDict[ribbon_type]
            sort_ribbon.classList.toggle("reversed");
        }
    }

    // perform sort
    array.sort(sortFunc);
    if (reverseDict[type]) { // reverse if required
        array.reverse();
    }

    for (let i = 0; i < array.length; i++) { 
        files_list.replaceChild(array[i], elems[i]);
    }

}

let memberDict = {
    0: ["John Smith (you)  -  Owner", "Jane Doe -  Joined 3:57PM, 3rd May"],
    1: ["John Smith (you)  -  Owner", "Sven Nev -  Joined 8:16PM, 2nd May"],
    2: ["John Smith (you)  -  Owner", "Denise Nuhts -  Joined 9:40AM, 28th April"],
    3: ["John Smith (you)  -  Owner", "Denise Nuhts -  Joined 11:10PM, 23rd April", "Ricardo Milos -  Joined 5:08PM, 23rd April"],
}

// Select an assignment
let currAssignmentId = 0;
function selectAssignment(element) {
    const selected = document.getElementsByClassName("selected-assignment")[0];
    if (selected) {
        selected.classList.remove("selected-assignment")
    }

    currAssignmentId = element.getAttribute("data-assignment-id");
    element.classList.add("selected-assignment")
    // Update assignment details in banner/header
    banner.children[0].textContent = element.children[0].innerText
    banner.children[1].children[0].textContent = element.children[1].innerText
    banner.children[1].children[1].textContent = element.children[2].innerText

    const group_popup = document.getElementById("group-popup");
    const member_list = group_popup.getElementsByClassName("group-member-list")[0];

    // remove elements until number of elements in list <= number of user strings in memberDict entry
    for (let i = memberDict[currAssignmentId].length; i < member_list.children.length; i++) {
        member_list.removeChild(member_list.lastElementChild);
    }

    // Update the elements associated with the selected assignment
    for (let i = 0; i < memberDict[currAssignmentId].length; i++) {
        const member_item = member_list.children[i];
        if (!member_item) {
            const div = document.createElement("div");
            member_list.appendChild(div)
            div.outerHTML = `
            <div class="group-member-item vertically-center-content">
                <img src="res/person.svg">
                <span>${memberDict[currAssignmentId][i]}</span>
                <button class="button danger-button" onclick="removeMember(this)">Remove</button>
            </div>
            `
        }else {
            member_item.getElementsByTagName("span")[0].innerText = memberDict[currAssignmentId][i];
        }
    }
}

// Remove a member from the assignment
function removeMember(src) {
    const memberItem = src.parentNode;
    const itemIndex = Array.from(memberItem.parentNode.children).indexOf(memberItem)
    memberItem.parentNode.removeChild(memberItem);
    memberDict[currAssignmentId].splice(itemIndex, 1);

}

// A pool of names
let randomNames = [
    "Janice Smith", "Kenny McCormick",
    "John Doe", "Richard Rick",
    "Richard Milos", "Henry Yoke",
    "Petra Linkov", "Sven Nev",
    "Jef Name", "Wiz Kid",
    "Yah Yeet", "Andreas Knapp",
    "Link Frost", "Jackson Ayling-Campbell",
    "Henry Greg", "Nick Willemsen",
    "Denver Broncos", "Gerald Weber",
    "Lucy Lu", "Danielle Lotridge",
    "Chef Boyardee", "Ewan Tempero",
    "Franku Fillth", "Bakh Khoussainov"
]

// Invite group members. Input for email is ignored and names are pulled from randomNames
let nameIndex = 0;
function inviteGroupMember(popupId, src) {

    const name = randomNames[nameIndex++ % randomNames.length];
    const dateStr = getFormattedDate();

    const div = document.createElement("div");

    const memberList = document.getElementById(popupId).getElementsByClassName("group-member-list")[0];
    memberList.appendChild(div);
    const memberText = `${name} - Invited ${dateStr}`
    div.outerHTML = `
    <div class="group-member-item vertically-center-content">
        <img src="res/person.svg">
        <span>${memberText}</span>
        <button class="button danger-button" onclick="removeMember(this)">Remove</button>
    </div>
    `;

    memberList.scrollTop = memberList.scrollHeight;  // scroll to bottom of member list

    // reset email field contents
    src.previousElementSibling.value = "";

    // add member text to memberDict
    memberDict[currAssignmentId].push(memberText);

}

// Create an assignment from an assignment popup and place it on the main screen
function createAssignment() {

    const newId = currId++;
    memberDict[newId] = ["John Smith (you)  -  Owner"];
    const member_list = document.getElementById("assignment-popup").getElementsByClassName("group-member-list")[0];
    for (let i = 0; i < member_list.children.length; i++) {
        const member_item = member_list.children[i];
        memberDict[newId].push(member_item.getElementsByTagName("span")[0].innerText);
    }

    // Clear invited group member list
    member_list.innerHTML = "";

    const assignmentStr = document.getElementById("course-name-input").value + " - " +
                          document.getElementById("assignment-name-input").value;
    const dateStr = document.getElementById("time-input") .value + ", " +
                    document.getElementById("day-input")  .value + " " +
                    document.getElementById("month-input").value;
    const gradeStr = document.getElementById("assignment-grade-input").value;

    // Clear all inputs
    const inputs = document.getElementById("assignment-popup").getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
    }

    // Create a assignment card with the values from the prompt
    const div = document.createElement("div");
    curr_assignments.appendChild(div);
    div.outerHTML = `
    <div data-assignment-id="${newId}" class="assignment-card clickable" onclick="selectAssignment(this); populateFileList(this)">
        <h4>${assignmentStr}</h4>
        <p>Due ${dateStr}</p>
        <p>Grade weighting: ${gradeStr}</p>
    </div>`

    closePopup();

}

// Deletes the selected assignment and selects the first assignment
function deleteAssignment() {
    const selected_assignment = document.getElementsByClassName("selected-assignment")[0]
    selected_assignment.parentElement.removeChild(selected_assignment);

    if (selected_assignment.classList.contains("selected-assignment")) {
        try {
            document.getElementsByClassName("assignment-card")[0].click()
        } catch (e) {
            // no assignments left
            files_list.innerHTML = "";  // clear file list
        }
    }
}

// Open file picker and write file name to readonly input bar
var cur_file;
function fileSelect() {
    var input = document.createElement('input');
    input.type = 'file';
    input.click();
    input.onchange = e => {
        cur_file = e.target.files[0];
        document.getElementById("file-name-readonly").value = cur_file.name
    }
}

// Format file size from Bytes to nearest unit
function humanFileSize(bytes, si=false, dp=1) {
    const thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
      return bytes + 'B';
    }
    const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let u = -1;
    const r = 10**dp;

    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
    return bytes.toFixed(dp) + units[u];
}

// Format date String to human readable text
function getFormattedDate() {

    var d = new Date();
    const day = d.getDate();
    let daySuffix;
    switch (day % 10) {
        case 1:  daySuffix = "st";
        case 2:  daySuffix = "nd";
        case 3:  daySuffix = "rd";
        default: daySuffix = "th";
    }

    const dayStr = day + daySuffix;
    const monthStr = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"][d.getMonth()];

    let H = Number.parseInt(d.toTimeString().substr(0, 2));
    let timeSuffix = "AM"
    if (H > 12) {
        timeSuffix = "PM";
        H = H % 12
    }

    let M = d.getMinutes();
    if (M <= 9) {  // buffer with leading zeros
        M = "0" + M;
    }
    const timeStr = H + ":" + M + timeSuffix;
    return timeStr + ', ' + dayStr + ' ' + monthStr;

}

// 'Upload' a file from the selected file from the file picker to the main page file list
// Set at 100 in case number of default files / assignments changed
let currDateOrd = 100;
let currId = 100;
function fileUpload() {

    if (!cur_file) {
        return;
    }
    //create a div that matches
    var div = document.createElement("div");
    const dateStr = getFormattedDate();
    files_list.appendChild(div);
    div.outerHTML = `<div data-assignment-id=\"${currAssignmentId}\"data-time-ord=\"${currDateOrd++}\" data-size-ord=\"${cur_file.size}\" class=\"file-item\"> <div class=\"file-item-section file-name-item file-name-column\"> <label> <input class=\"file-checkbox\" type=\"checkbox\"> </label> <img src=\"res/file-earmark-text.svg\"> <span>${cur_file.name}</span> </div> <div class=\"file-item-section file-size-item file-size-column\"> <span>${humanFileSize(cur_file.size)}</span> </div> <div class=\"file-item-section file-time-item file-time-column\"> <span>${dateStr}</span> </div> </div>`

    cur_file = undefined;
}

// Mock import assignments from canvas
const canvas_popup = document.getElementById("canvas-popup-message");
function importAssignments() {

    document.getElementById("hidden-assignment").classList.remove("hidden");
    canvas_popup.style.top = "90%";
    canvas_popup.style.opacity = "1";
    window.setTimeout(() => {
        canvas_popup.style.opacity = "0";
    }, 3000)
    window.setTimeout(() => {
        canvas_popup.remove();
    }, 5000)

}

const undo_popup = document.getElementById("popup-message-delete-files");

//Display popup of files deleted
function notificationUndoDelete() {
    undo_popup.style.top = "92%";
    undo_popup.style.opacity = "1";
    window.setTimeout(() => {
        hideUndo();
    }, 5000);
}

// Undo deletion of a set of files
function undoDelete() {
    last_deleted.forEach(x => {
        files_list.appendChild(x)
    })
}

// Hide undo popup message
function hideUndo() {
    undo_popup.style.top = "100%";
    undo_popup.style.opacity = "0";
}