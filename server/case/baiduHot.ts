import { $, IActivityConfig } from "sandcastle";
import fs from "fs"
import path from "path";

const activityConfig: IActivityConfig = {
    type: "c.browser",
    name: "创建浏览器",
    options: {
        headless: true,
        "executablePath": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    },
    children: [$.sequence({
        type: "sequence",
        name: "顺序执行",
        children: [{
            type: "c.page",
            name: "百度页面啊",
            children: [
                {
                    type: "code",
                    name: "代码",
                    options: { code: "console.log(Date.now());" }
                },
                {
                    type: "c.page.goto",
                    name: "跳转",
                    options: {
                        url: "https://top.baidu.com/board?tab=realtime", options: {
                            "waitUntil": "load"
                        }
                    },

                }, {
                    type: "c.page.waitForSelector",
                    name: "等待节点",
                    options: { selector: "#sanRoot" },
                },
                {
                    type: "delay",
                    options: { timeout: 2000 },
                    name: "等待2s"
                },
                $.c.page.evaluate({
                    name: "获取节点内容",
                    options: {
                        args: [],
                        async code() {
                            // @ts-ignore
                            const links = document.querySelector(`[class^=container-bg]`).querySelectorAll(`a[class^="title_"]`) as any as HTMLAnchorElement[];

                            return Array.from(links).map(l => ({
                                href: l.getAttribute("href"),
                                title: l.textContent || ''
                            }))
                        }
                    }
                })
            ]
        }
        ]
    })]
};

export default activityConfig;
