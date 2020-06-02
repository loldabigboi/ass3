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
