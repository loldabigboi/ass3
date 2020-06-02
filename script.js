const group_popup = document.getElementById("group-popup");
const page_container = document.getElementById("page-container");

function closeGroupPopup() {
    group_popup.style.display = "none";
    page_container.style.filter = "none";
}

function openGroupPopup() {
    group_popup.style.display = "block";
    page_container.style.filter = "blur(3px)";
}
