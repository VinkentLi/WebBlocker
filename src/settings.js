function ensureAbsoluteUrl(input) {
    return input.startsWith("http://") || input.startsWith("https://")
        ? input
        : `https://${input}`;
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

async function addWebsite() {
    newWebsiteButton.disabled = true;
    let url = document.querySelector('.newWebsite').value;
    console.log(url);
    let fixedURL = await findRedirect(url);
    console.log(fixedURL);
    let host = new URL(fixedURL).hostname;
    chrome.runtime.sendMessage({message: 'add_blocked_site', value: host}, function (response) {
        console.log("reloaded");
        location.reload();
    });
}

const newWebsiteButton = document.querySelector('.newWebsiteSubmit');
newWebsiteButton.addEventListener('click', addWebsite);
