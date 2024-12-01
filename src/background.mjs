function saveBlockedWebsites() {
    chrome.storage.sync.set({"blockedWebsites": blockedWebsites}, function () {
        console.log("stored blockedWebsites");
    });
}

async function loadBlockedWebsites() {
    return await chrome.storage.sync.get(["blockedWebsites"]);
}

let shouldBlock = false;
let blockedWebsites = await loadBlockedWebsites().then((items) => {
    return items['blockedWebsites'];
});
console.log(blockedWebsites);

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
        } else if (request.action == 'remove') {
            removeWebsite(website);
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
    console.log(blockedWebsites);
    if (blockedWebsites.length == 0) {
        blockedWebsites = [website];
        saveBlockedWebsites();
    }
    else if (!blockedWebsites.includes(website)) {
        blockedWebsites.push(website);
        console.log("added website ", website);
        saveBlockedWebsites();
    }
}

function removeWebsite(website) {
    const index = blockedWebsites.indexOf(website);
    if (index > -1) {
        blockedWebsites.splice(index, 1);
        console.log("removed website", website);
        saveBlockedWebsites();
    }
}
