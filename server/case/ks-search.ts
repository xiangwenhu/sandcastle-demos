import { IActivityConfig, $ } from "sanddunes";

const activityConfig: IActivityConfig =  $.c.browser({
    type: "c.browser",
    name: "创建浏览器",
    options: {
        headless: true,
        ignoreHTTPSErrors: true,
        defaultViewport: null,
        ignoreDefaultArgs: ["--enable-automation"],
        args: [
            "--start-maximized",
            "--no-sandbox",
            "--disable-web-security",
            "--disable-setuid-sandbox",
            "--allow-running-insecure-content",
            "--unsafely-treat-insecure-origin-as-secure",
        ],
        timeout: 60 * 1000,
        "executablePath": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    },
    children: [
        {
            type: "c.page",
            name: "创建页面",
            children: [
                {
                    type: "c.page.setUserAgent",
                    name: "设置userAgent",
                    options: {
                        userAgent:
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
                    },
                },
                $.c.page.goto({
                    type: "c.page.goto",
                    name: "跳转到快手",
                    options: { url: `https://www.kuaishou.com/search/video?searchKey=` },
                }),  
                {
                    type: "c.page.waitForSelector",
                    name: "等待节点 .search-input",
                    options: { selector: ".search-input" },
                },
                {
                    type: "c.page.type",
                    options: {
                        selector: `.search-input`,
                        text: "美女",
                        options: {
                            delay: 1 * 1000,
                        },
                    },
                    name: "输入美女",
                },
                {
                    type: "c.page.eClick",
                    options: { selector: `.search-button` },
                    name: "点击",
                },
                $.c.page.waitForResponse({
                    type: "c.page.waitForResponse",
                    name: "等待结果响应",
                    options: {
                        options: {
                            timeout: 60 * 1000
                        },
                        useResponse: true,
                        contentType: "json",
                        urlOrPredicate: (res, param) => {
                            const url = res.url();
                            console.log("url:", url);
                            const request = res.request();
                            const postData = JSON.parse(
                                request.postData() || "{}"
                            );
                            if (
                                postData.operationName === "graphqlSearchUser"
                            ) {
                                return true;
                            }
                            return false;
                        },
                    },
                }),
            ],
        },
    ],
});

export default activityConfig;