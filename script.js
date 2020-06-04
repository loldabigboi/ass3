const page_container = document.getElementById("page-container");
const page_cover = document.getElementById("page-cover");

const search_bar = document.getElementById('file-search')
const files_list = document.getElementById('files-list')
const size_div = document.getElementById('file-size-container')
const time_div = document.getElementById('file-time-container')
const banner = document.getElementById("assignment-details")
const container = document.getElementById("files-container")

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
    const selected = document.getElementsByClassName("selected-assignment")[0]
    selected.classList.remove("selected-assignment")
    element.classList.add("selected-assignment")
    banner.children[0].textContent = element.children[0].innerText
    banner.children[1].children[0].textContent = element.children[1].innerText
    banner.children[1].children[1].textContent = element.children[2].innerText
}

function populateFileList(element) {
    if (element.classList.contains("first-assignment")) {
        files_list.children[1].style.display = "flex"
        files_list.children[3].style.display = "flex"
        files_list.children[4].style.display = "flex"
    } else {
        files_list.children[1].style.display = "none"
        files_list.children[3].style.display = "none"
        files_list.children[4].style.display = "none"
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

    let i = 0;
    while (i < file_name_items.length) {
        const file_name_item = file_name_items[i];
        const del = file_name_item.getElementsByTagName("input").checked;
        if (del) {

        }
        i++
    }

}

let reverseDict = {
    "name": false,
    "size": false,
    "date": false
}

function sortFiles(type) {

    let sortFunc;
    if (type === "name") {
        sortFunc = function (e1, e2) {
            return Number(e1.children[0].innerText) - Number(e2.children[0].innerText);
        }
    } else {
        sortFunc = function (e1, e2) {
            let fileSizeText1 = e1.children[1].innerText;
            let fileSizeText2 = e1.children[1].innerText;

            const parseFileSize = (fileSizeText) => {
                let numBytes = "";
                while (true) {
                    let char;
                    if (char = fileSizeText.charAt(i)) {
                        if (char >= '0' && char <= '9') {
                            numBytes += char;
                        } else if (char != '.') {

                            numBytes = Number.parseInt(numBytes);
                            let byteType = char;
                            if (char = fileSizeText.charAt(i + 1)) {
                                byteType += char;
                            }

                            if (byteType === "KB") {
                                numBytes *= 1000
                            } else if (byteType === "MB") {
                                numBytes *= 1000000
                            } else {
                                throw Error("only b, kb or mb allowed");
                            }
                            return numBytes;

                        }
                    }
                }
            }
            return parseFileSize(fileSizeText1) - parseFileSize(fileSizeText2);
        }
    }

    let elems = document.getElementById("file-list").children;

    let array = [];
    for (let i = 0; i < elems.length; i++) {
        array[i] = elems[i].cloneNode(true);
    }

    // perform sort
    array.sort(sortFunc);
    if (reverseDict[type]) { // reverse if required
        array.reverse();
    }
    [type] = !reverseDict[type];

    for (let i = 0; i < array.length; i++) {
        document.getElementById("file-list").replaceChild(array[i], elems[i]);
    }

}

// Deletes the selected assignment and selects the second (hardcode)
function deleteAssignment() {
    document.getElementsByClassName("selected-assignment")[0].style.display = "none"
    document.getElementsByClassName("assignment-card")[1].click()
}

function fileUpload() {
    var input = document.createElement('input');
    input.type = 'file';
    input.click();
    input.onchange = e => {
        var file = e.target.files[0];

        input.click();
        console.log(file.name)
        console.log(file.size)
        console.log(file.type)
        //create a div that matches
        var div = document.createElement("div");
        `This is  times easier!`
        div.innerHTML = `<div class=\"file-item\"> <div class=\"file-item-section file-name-item file-name-column\"> <label> <input class=\"file-checkbox\" type=\"checkbox\"> </label> <img src=\"file-earmark-text.svg\"> <span>${file.name}</span> </div> <div class=\"file-item-section file-size-item file-size-column\"> <span>42B</span> </div> <div class=\"file-item-section file-time-item file-time-column\"> <span>11:00AM, 7th June</span> </div> </div>`
        container.appendChild(div);
    }
}