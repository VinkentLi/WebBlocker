let shouldBlock = true;
let blockedWebsites = ["www.youtube.com", "www.reddit.com"];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.message) {
    case "set_block":
        shouldBlock = request.value;
        chrome.tabs.query({}, function (tabs){
            console.log(tabs.length);
            for (let tab of tabs) {
                if (tab.url == null) {
                    continue;
                }
                let host = new URL(tab.url).hostname;
                console.log(host);
                if (blockedWebsites.includes(host)) {
                    chrome.tabs.update(tab.id, {url: tab.url});
                }
            }
        });
        break;
    case 'request_block':
        console.log("sender.url: ", sender.url);
        let host = new URL(sender.url).hostname;
        console.log(host);
        if (!blockedWebsites.includes(host)) {
            sendResponse({value: false});
        } else {
            sendResponse({value: shouldBlock});
        }
        console.log("responded");
        break;
    case 'request_blocked_sites':
        console.log("received message");
        console.log(blockedWebsites);
        sendResponse({value: blockedWebsites});
        break;
    case 'modify_blocked_sites':
        let website = request.value;
        console.log(website);
        if (request.action == 'add') {
            if (!blockedWebsites.includes(website)) {
                blockedWebsites.push(website);
            }
            sendResponse();
        } else if (request.action == 'remove') {
            const index = blockedWebsites.indexOf(website);
            if (index > -1) {
                blockedWebsites.splice(index, 1);
            }
            sendResponse();
        }
        break;
    }
    return true;
});
