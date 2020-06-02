const group_popup = document.getElementById("group-popup");
const assignment_popup = document.getElementById("assignment-popup");
const confirmation_popup = document.getElementById("deletion-confirmation-popup");
const page_container = document.getElementById("page-container");
const search_bar = document.getElementById('file-search')
const name_div = document.getElementById('file-name-container')
const size_div = document.getElementById('file-size-container')
const time_div = document.getElementById('file-time-container')

let closeGroupPopup = function() {
    group_popup.style.display = "none";
    page_container.style.filter = "none";
    page_container.removeEventListener("mousedown", closeGroupPopup);
}

function openGroupPopup() {
    group_popup.style.display = "block";
    page_container.style.filter = "blur(3px)";
    page_container.addEventListener("mousedown", closeGroupPopup);
}

let closeAssignmentPopup = function() {
    assignment_popup.style.display = "none";
    page_container.style.filter = "none";
    page_container.removeEventListener("mousedown", closeAssignmentPopup);
}

function openAssignmentPopup() {
    assignment_popup.style.display = "block";
    page_container.style.filter = "blur(3px)";
    page_container.addEventListener("mousedown", closeAssignmentPopup);
}

let closeConfirmationPopup = function() {
    confirmation_popup.style.display = "none";
    page_container.style.filter = "none";
    page_container.removeEventListener("mousedown", closeConfirmationPopup);
}

function openConfirmationPopup() {
    confirmation_popup.style.display = "block";
    page_container.style.filter = "blur(3px)";
    page_container.addEventListener("mousedown", closeConfirmationPopup);
}

function searchFilter() {
	for(i = 1; i < name_div.children.length; ++i) {
		if(name_div.children[i].innerText.toLowerCase().includes(search_bar.value.toLowerCase()) ) {
			name_div.children[i].style.display = ""
			size_div.children[i].style.display = ""
			time_div.children[i].style.display = ""
		} else {
			name_div.children[i].style.display = "none"
			size_div.children[i].style.display = "none"
			time_div.children[i].style.display = "none"
		}
	}
}

function selectAssignment(element) {
    const selected = document.getElementsByClassName("selected-assignment")[0]
    selected.classList.remove("selected-assignment")
    element.classList.add("selected-assignment")
}

function populateFileList(element) {
    if(element.classList.contains("first-assignment")) {
        name_div.children[1].style.display = ""
        size_div.children[1].style.display = ""
        time_div.children[1].style.display = ""
        name_div.children[3].style.display = ""
        size_div.children[3].style.display = ""
        time_div.children[3].style.display = ""
        name_div.children[4].style.display = ""
        size_div.children[4].style.display = ""
        time_div.children[4].style.display = ""
    } else {
        name_div.children[1].style.display = "none"
        size_div.children[1].style.display = "none"
        time_div.children[1].style.display = "none"
        name_div.children[3].style.display = "none"
        size_div.children[3].style.display = "none"
        time_div.children[3].style.display = "none"
        name_div.children[4].style.display = "none"
        size_div.children[4].style.display = "none"
        time_div.children[4].style.display = "none"
    }
}