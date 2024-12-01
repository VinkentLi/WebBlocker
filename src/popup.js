let checklist = {};
let isAllChecked = false;

function loadChecklist() {
    chrome.storage.sync.get(["checklist"]).then((items) => {
        console.log(items);
        checklist = items['checklist'];
        writeChecklist();
        isAllChecked = checkAllChecked();
    })
}

function checkAllChecked() {
    let allChecked = true;
    for (const [, data] of Object.entries(checklist)) {
        if (!data.value) {
            allChecked = false;
            break;
        }
    }
    return allChecked;
}


function writeChecklist() {
    const checklistClass = document.querySelector(".checklist");
    for (const [className, data] of Object.entries(checklist)) {
        checklistClass.appendChild(createCheckbox(className, data));
    }
    for (const [className, data] of Object.entries(checklist)) {
        let checkbox = document.querySelector(`.${className}`);
        checkbox.checked = data.value;
        checkbox.addEventListener('change', updateCheckbox);
    }
}

function createCheckbox(className, data) {
    let paragraph = document.createElement("p");

    let checkbox = document.createElement("input");
    checkbox.className = className;
    checkbox.type = "checkbox";

    let text = document.createElement("span");
    text.innerText = data.task;

    paragraph.appendChild(checkbox);
    paragraph.appendChild(text);

    return paragraph;
}

function updateCheckbox(evt) {
    checklist[evt.target.className].value = evt.target.checked;
    console.log(evt);
    saveChecklist();
    let newAllChecked = checkAllChecked();
    if (newAllChecked != isAllChecked) {
        isAllChecked = newAllChecked;
        chrome.runtime.sendMessage({message: "set_block", value: !isAllChecked});
    }
}

function saveChecklist() {
    chrome.storage.sync.set({"checklist": checklist});
}

document.addEventListener('DOMContentLoaded', loadChecklist);

function openSettings() {
    window.open("./settings.html", "_blank");
}

const settingsButton = document.querySelector('.settingsButton');
settingsButton.addEventListener('click', openSettings);

function turnIntoValidClassName(name) {
    return name.replace(/[^a-z0-9]/g, function(s) {
        var c = s.charCodeAt(0);
        if (c == 32) return '-';
        if (c >= 65 && c <= 90) return '_' + s.toLowerCase();
        return '__' + ('000' + c.toString(16)).slice(-4);
    });
}
