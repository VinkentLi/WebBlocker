function saveCheckboxState() {
    const checkbox = document.querySelector('.myCheckbox');
    localStorage.setItem(checkbox.className, checkbox.checked);
    chrome.runtime.sendMessage({message: "set_block", value: !checkbox.checked});
}

// Function to load checkbox states from Local Storage
function loadCheckboxState() {
    const checkbox = document.querySelector('.myCheckbox');
    const savedState = localStorage.getItem(checkbox.className);
    if (savedState !== null) {
        checkbox.checked = savedState === 'true';
    }
}

function openSettings() {
    window.open("./settings.html", "_blank");
}

const checkbox = document.querySelector('.myCheckbox');
checkbox.addEventListener('change', saveCheckboxState);
document.addEventListener('DOMContentLoaded', loadCheckboxState);

const settingsButton = document.querySelector('.settingsButton');
settingsButton.addEventListener('click', openSettings);
