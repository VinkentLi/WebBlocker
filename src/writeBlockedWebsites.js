let blockedWebsites = [];
chrome.runtime.sendMessage({message: 'request_blocked_sites'}, function (response) {
    blockedWebsites = response.value;
    document.getElementById("websites").innerHTML = blockedWebsites.join(", ");
});
