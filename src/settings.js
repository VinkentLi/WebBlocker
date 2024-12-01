const newWebsiteButton = document.querySelector('.newWebsiteSubmit');
newWebsiteButton.addEventListener('click', addWebsite);
const removeWebsiteButton = document.querySelector('.removeWebsiteSubmit');
removeWebsiteButton.addEventListener('click', removeWebsite);

async function addWebsite() {
    newWebsiteButton.disabled = true;
    let url = document.querySelector('.newWebsite').value;
    console.log(url);
    let fixedURL = await findRedirect(url);
    console.log(fixedURL);
    let host = new URL(fixedURL).hostname;
    chrome.runtime.sendMessage({message: 'modify_blocked_sites', action: 'add', value: host});
    location.reload();
}

async function removeWebsite() {
    removeWebsiteButton.disabled = true;
    let url = document.querySelector('.removeWebsite').value;
    console.log(url);
    let fixedURL = await findRedirect(url);
    console.log(fixedURL);
    let host = new URL(fixedURL).hostname;
    chrome.runtime.sendMessage({message: 'modify_blocked_sites', action: 'remove', value: host});
    location.reload();
}

async function findRedirect(url) {
    const axios = require('axios');
    url = ensureAbsoluteUrl(url);
    await axios.get(url).then(function (response) {
        console.log("redirected url: ", response.request.responseURL);
        url = response.request.responseURL;
    });
    return url;
}

function ensureAbsoluteUrl(input) {
    return input.startsWith("http://") || input.startsWith("https://")
        ? input
        : `https://${input}`;
}

