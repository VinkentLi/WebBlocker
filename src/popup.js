function saveCheckboxState() {
    const checkbox = document.querySelector('.myCheckbox');
    chrome.storage.sync.set({[checkbox.className]: checkbox.checked}, function () {
        console.log(`set ${checkbox.className} to ${checkbox.checked}`);
    });
    // localStorage.setItem(checkbox.className, checkbox.checked);
    chrome.runtime.sendMessage({message: "set_block", value: !checkbox.checked});
}

// Function to load checkbox states from Local Storage
async function loadCheckboxState() {
    const checkbox = document.querySelector('.myCheckbox');
    const stored = chrome.storage.sync.get([checkbox.className]).then((items) => {
        checkbox.checked = items[checkbox.className];
        console.log("set checked status to ", checkbox.checked);
    });
}

function openSettings() {
    window.open("./settings.html", "_blank");
}

const checkbox = document.querySelector('.myCheckbox');
checkbox.addEventListener('change', saveCheckboxState);
document.addEventListener('DOMContentLoaded', loadCheckboxState);

const settingsButton = document.querySelector('.settingsButton');
settingsButton.addEventListener('click', openSettings);
