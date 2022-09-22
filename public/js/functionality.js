let timeOut;
function showToast({ title, type, message, time }) {
    clearTimeout(timeOut);
    var toast = document.getElementById("toast");
    var toastMessage = document.getElementById("toastMessage");
    var toastTitle = document.getElementById("toastTitle");
    toastMessage.innerHTML = message || "";
    toastTitle.innerText = title || "Notification";
    toast.className = toast.className.replace("invisible", "visible");
    timeOut = setTimeout(() => { hideToast(toast) }, time || 3000);
}

function hideToast(toast) {
    toast.className = toast.className.replace("visible", "invisible");
}

function closeToast() {
    clearTimeout(timeOut);
    var toast = event.target.parentElement.parentElement;
    // console.log(toast);
    hideToast(toast);
}