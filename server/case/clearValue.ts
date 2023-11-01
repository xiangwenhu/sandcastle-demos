import { IActivityConfig } from '../../../thief/src/types/activity';
import "../../../thief/src/crawlActivityFactory";

const activityConfig: IActivityConfig = {
    type: "c.browser",
    name: "创建浏览器",
    options: {
        headless: false
    },
    children: [{
        type: "parallel",
        name: "并行",
        children: [{
            type: "c.page",
            name: "快手页面啊",
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
                        url: "https://www.baidu.com/", options: {
                            "waitUntil": "load"
                        }
                    },

                }, {
                    type: "c.page.waitForSelector",
                    name: "等待节点",
                    options: { selector: "#kw" },
                }, {
                    type: "c.page.type",
                    options: {
                        selector: `#kw`, text: "高源",
                        options: {
                            delay: 1 * 1000
                        },
                    },
                    name: "输入",

                },
                {
                    type: "delay",
                    options: { timeout: 2000 },
                    name: "等待2s"
                },
                {
                    type: "c.page.clearValue",
                    options: { selector: '#kw' },
                    name: "清空值"
                },
                {
                    type: "delay",
                    options: { timeout: 10 * 1000 },
                    name: "等待10s"
                },
            ]
        }
        ]
    }]
};

export default activityConfig;
