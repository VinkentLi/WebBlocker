let shouldBlock = true;
let blockedWebsites = ["www.youtube.com", "x.com", "www.reddit.com"];

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
                let domain = new URL(tab.url).hostname;
                console.log(domain);
                if (blockedWebsites.includes(domain)) {
                    chrome.tabs.update(tab.id, {url: tab.url});
                }
            }
        });
        break;
    case 'request_block':
        // chrome.tabs.query({currentWindow: false, active: true}, function (tabs){
        //     var activeTab = tabs[0];
        //     chrome.tabs.sendMessage(activeTab.id, {message: "send_block", value: shouldBlock});
        // });
        sendResponse({value: shouldBlock});
        console.log("responded");
        break;
    }
});
