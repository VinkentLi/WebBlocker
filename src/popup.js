function saveCheckboxState() {
    const checkbox = document.querySelector('.myCheckbox');
    localStorage.setItem(checkbox.id, checkbox.checked);
    chrome.runtime.sendMessage({message: "set_block", value: !checkbox.checked});
}

// Function to load checkbox states from Local Storage
function loadCheckboxState() {
    const checkbox = document.querySelector('.myCheckbox');
    const savedState = localStorage.getItem(checkbox.id);
    if (savedState !== null) {
        checkbox.checked = savedState === 'true';
    }
}

// Attach event listener to the checkboxes to save their states
const checkbox = document.querySelector('.myCheckbox');
checkbox.addEventListener('change', saveCheckboxState);

// Load checkbox states on page load
document.addEventListener('DOMContentLoaded', loadCheckboxState);
