const checklist = {
    "Eat food": false,
    "Code": true,
    "Be happy": false
};

function turnIntoValidClassName(name) {
    return name.replace(/[^a-z0-9]/g, function(s) {
        var c = s.charCodeAt(0);
        if (c == 32) return '-';
        if (c >= 65 && c <= 90) return '_' + s.toLowerCase();
        return '__' + ('000' + c.toString(16)).slice(-4);
    });
}

function writeChecklist() {
    const checklistClass = document.querySelector(".checklist");
    let checklistHtml = "";
    for (const [task, value] of Object.entries(checklist)) {
        let className = turnIntoValidClassName(task);
        console.log(className);
        checklistHtml += `<p><input type="checkbox" class="check_${className}">${task}</p>\n`;
    }
    console.log(checklistHtml);
    checklistClass.innerHTML = checklistHtml;
    for (const [task, value] of Object.entries(checklist)) {
        let className = turnIntoValidClassName(task);
        let checkbox = document.querySelector(`.check_${className}`);
        checkbox.checked = value;
    }
}

document.addEventListener('DOMContentLoaded', writeChecklist);

function openSettings() {
    window.open("./settings.html", "_blank");
}

const settingsButton = document.querySelector('.settingsButton');
settingsButton.addEventListener('click', openSettings);
