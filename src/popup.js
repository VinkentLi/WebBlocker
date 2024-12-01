let checklist = [];
let isAllChecked = false;

document.addEventListener('DOMContentLoaded', loadChecklist);
const addTaskButton = document.querySelector(".addTaskSubmit");
addTaskButton.addEventListener('click', addTask);

const settingsButton = document.querySelector('.settingsButton');
settingsButton.addEventListener('click', openSettings);

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
    for (const [index, data] of Object.entries(checklist)) {
        const className = `check_${index}`;
        checklistClass.appendChild(createCheckbox(className, data));
    }
    for (const [index, data] of Object.entries(checklist)) {
        const className = `check_${index}`;
        let checkbox = document.querySelector(`.${className}`);
        let removeButton = document.querySelector(`.remove_${className}`);
        checkbox.checked = data.value;
        checkbox.addEventListener('change', updateCheckbox);
        removeButton.addEventListener('click', removeTask);
    }
}

function createCheckbox(className, data) {
    let paragraph = document.createElement("p");

    let checkbox = document.createElement("input");
    checkbox.className = className;
    checkbox.type = "checkbox";

    let text = document.createElement("span");
    text.innerText = data.task;

    let removeButton = document.createElement("button");
    removeButton.innerText = "Remove";
    removeButton.className = `remove_${className}`;
    removeButton.style = "float: right;";

    paragraph.appendChild(checkbox);
    paragraph.appendChild(text);
    paragraph.appendChild(removeButton);

    return paragraph;
}

function updateCheckbox(evt) {
    let index = parseInt(trimPrefix(evt.target.className, "check_"));
    console.log(checklist, index);
    checklist[index].value = evt.target.checked;
    console.log(evt);
    saveChecklist();
    updateShouldBlock();
}

function trimPrefix(className, prefix) {
    return className.slice(prefix.length, className.length);
}

function updateShouldBlock() {
    let newAllChecked = checkAllChecked();
    if (newAllChecked != isAllChecked) {
        isAllChecked = newAllChecked;
        chrome.runtime.sendMessage({message: "set_block", value: !isAllChecked});
    }
}

function removeTask(evt) {
    const removeButton = evt.target;
    const taskIndex = parseInt(trimPrefix(removeButton.className, 'remove_check_'));
    checklist.splice(taskIndex, 1);
    console.log("deleted task");
    saveChecklist();
    updateShouldBlock();
    removeButton.disabled = true;
    location.reload();
}

function addTask(evt) {
    const inputBox = document.querySelector(".addTask");
    const newTask = inputBox.value;
    checklist.push({task: newTask, value: false});
    console.log("added new task ", newTask);
    saveChecklist();
    updateShouldBlock();
    const addButton = evt.target;
    addButton.disabled = true;
    location.reload();
}

function saveChecklist() {
    chrome.storage.sync.set({"checklist": checklist});
}

function openSettings() {
    window.open("./settings.html", "_blank");
}
