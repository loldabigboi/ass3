const page_container = document.getElementById("page-container");
const page_cover = document.getElementById("page-cover");

const search_bar = document.getElementById('file-search')
const curr_assignments = document.getElementById('curr-assignments');
const files_list = document.getElementById('files-list')
const size_div = document.getElementById('file-size-container')
const time_div = document.getElementById('file-time-container')
const ribbons_container = document.getElementById("sort-ribbons-container");
const banner = document.getElementById("assignment-details")

const id_dict = {
    "group-popup": document.getElementById("group-popup"),
    "assignment-popup": document.getElementById("assignment-popup"),
    "deletion-confirmation-popup": document.getElementById("deletion-confirmation-popup"),
    "upload-files-popup": document.getElementById("upload-files-popup"),
}

const sidebar = document.getElementById("sidebar");
const sidebar_toggle = document.getElementById("sidebar-toggle-button");
let wasBelowMin = false;
let resizeListener = (event) => {
    const belowMin = window.innerWidth < 1150;
    if (belowMin != wasBelowMin) {  //  only do stuff if state has changed
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

const toggleSidebar = function () {
    sidebar.classList.toggle("sidebar-hidden");
    sidebar_toggle.classList.toggle("rotated");
}

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

let currPopupId = ""

function openPopup(id) {
    currPopupId = id;
    id_dict[id].style.display = "block";
    page_container.style.filter = "blur(3px)";
    page_cover.style.display = "block";
    page_container.addEventListener("mousedown", closePopup);
}

let closePopup = function () {
    id_dict[currPopupId].style.display = "none";
    page_container.style.filter = "none";
    page_cover.style.display = "none";
    page_container.removeEventListener("mousedown", closePopup);
}

function searchFilter() {
    for (i = 0; i < files_list.children.length; ++i) {
        if (files_list.children[i].children[0].innerText.toLowerCase().includes(search_bar.value.toLowerCase())) {
            files_list.children[i].style.display = "flex"
        } else {
            files_list.children[i].style.display = "none"
        }
    }
}

function selectAssignment(element) {
    const selected = document.getElementsByClassName("selected-assignment")[0];
    if (selected) {
        selected.classList.remove("selected-assignment")
    }
    element.classList.add("selected-assignment")
    banner.children[0].textContent = element.children[0].innerText
    banner.children[1].children[0].textContent = element.children[1].innerText
    banner.children[1].children[1].textContent = element.children[2].innerText
}

function populateFileList(element) {
    for (let i = 0; i < files_list.children.length; i++) {
        if (files_list.children[i].getAttribute("data-assignment-id") === element.getAttribute("data-assignment-id")) {
            files_list.children[i].classList.remove("hidden");
        } else {
            files_list.children[i].classList.add("hidden");
        }
    }
}

function selectAllFiles() {

    const checkboxes = document.getElementsByClassName("file-checkbox");

    let allSelected = true;
    for (let i = 0; i < checkboxes.length; i++) {
        if (!checkboxes[i].checked) {
            allSelected = false;
            break;
        }
    }

    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = !allSelected;
    }

}

function deleteSelectedFiles() {

    let toDelete = [];
    for (let i = 0; i < files_list.children.length; i++) {
        const file_item = files_list.children[i];
        console.log(file_item);
        if (file_item.getElementsByTagName("input")[0].checked) {
            toDelete.push(file_item);
        }
    }

    toDelete.forEach((item) => {
        files_list.removeChild(item);
    })

}

let reverseDict = {
    "name": false,
    "size": false,
    "date": false
}

function sortFiles(src) {

    let type = src.getAttribute('data-type');
    let sortFunc;
    if (type === "name") {
        sortFunc = function(e1, e2) {
            return e1.innerText.localeCompare(e2.innerText);
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

// Deletes the selected assignment and selects the second (hardcode)
function deleteAssignment() {
    curr_assignments.removeChild(document.getElementsByClassName("selected-assignment")[0]);
    curr_assignments.children[0].click()
}

var cur_file;
function fileSelect() {
    var input = document.createElement('input');
    input.type = 'file';
    input.click();
    input.onchange = e => {
        cur_file = e.target.files[0];
    }
}

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

// set at 100 in case number of default files changed
let currDateOrd = 100;
function fileUpload() {
        //create a div that matches
        var d = new Date();
        var div = document.createElement("div");

        const day = d.getDay();
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
        const dateStr = timeStr + ', ' + dayStr + ' ' + monthStr;
        
        files_list.appendChild(div);
        div.outerHTML = `<div data-time-ord=\"${currDateOrd++}\" data-size-ord=\"${cur_file.size}\" class=\"file-item\"> <div class=\"file-item-section file-name-item file-name-column\"> <label> <input class=\"file-checkbox\" type=\"checkbox\"> </label> <img src=\"file-earmark-text.svg\"> <span>${cur_file.name}</span> </div> <div class=\"file-item-section file-size-item file-size-column\"> <span>${humanFileSize(cur_file.size)}</span> </div> <div class=\"file-item-section file-time-item file-time-column\"> <span>${dateStr}</span> </div> </div>`

}