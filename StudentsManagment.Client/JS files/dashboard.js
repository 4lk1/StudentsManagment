//Ora-------------------------------------------------------------
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById("time").textContent = timeString;
}
setInterval(updateTime, 1000);
updateTime(); // initial call

