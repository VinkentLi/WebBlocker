let shouldBlock = false;
let blockedWebsites = ["www.youtube.com", "www.reddit.com"];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.message) {
    case "set_block":
        shouldBlock = request.value;
        blockOrUnblockWebsites(request);
        break;
    case 'request_block':
        returnShouldBlock(sender, sendResponse);
        break;
    case 'request_blocked_sites':
        sendResponse({value: blockedWebsites});
        break;
    case 'modify_blocked_sites':
        let website = request.value;
        if (request.action == 'add') {
            addWebsite(website);
            sendResponse(); // dont question this
        } else if (request.action == 'remove') {
            removeWebsite(website);
            sendResponse();
        }
        break;
    }
    return true;
});

function blockOrUnblockWebsites(request) {
    chrome.tabs.query({}, function (tabs){
        for (let tab of tabs) {
            if (tab.url == null) {
                continue;
            }
            let host = new URL(tab.url).hostname;
            // console.log(host);
            if (blockedWebsites.includes(host)) {
                chrome.tabs.update(tab.id, {url: tab.url});
            }
        }
    });
}

function returnShouldBlock(sender, sendResponse) {
    let host = new URL(sender.url).hostname;
    if (!blockedWebsites.includes(host)) {
        sendResponse({value: false});
    } else {
        sendResponse({value: shouldBlock});
    }
}

function addWebsite(website) {
    if (!blockedWebsites.includes(website)) {
        blockedWebsites.push(website);
    }
}

function removeWebsite(website) {
    const index = blockedWebsites.indexOf(website);
    if (index > -1) {
        blockedWebsites.splice(index, 1);
    }
}
