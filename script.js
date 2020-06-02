const group_popup = document.getElementById("group-popup");
const assignment_popup = document.getElementById("assignment-popup");
const page_container = document.getElementById("page-container");


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

