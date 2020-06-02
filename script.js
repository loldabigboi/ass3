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

function searchFilter() {
	const bar = document.getElementById('file-search')
	const name = document.getElementById('file-name-container')
	const size = document.getElementById('file-size-container')
	const time = document.getElementById('file-time-container')

	for(i = 1; i < name.children.length; ++i) {
		if(name.children[i].innerText.toLowerCase().includes(bar.value.toLowerCase()) ) {
			name.children[i].style.display = ""
			size.children[i].style.display = ""
			time.children[i].style.display = ""
		} else {
			name.children[i].style.display = "none"
			size.children[i].style.display = "none"
			time.children[i].style.display = "none"
		}
	}
}
