({
  name: "并行获取cookie",
  type: "c.browser",
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
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  },
  children: [
    {
      type: "parallel",
      name: "并行",
      children: [
        {
          type: "c.page",
          name: "百度",
          children: [
            {
              type: "c.page.goto",
              name: "跳转",
              options: {
                url: "https://www.baidu.com/",
                options: {
                  waitUntil: "load",
                },
              },
            },
            {
              type: "c.page.cookies",
              name: "获取cookie",
            },
          ]
        },
        {
          type: "c.page",
          name: "抖音页面",
          children: [
            {
              type: "c.page.goto",
              name: "跳转",
              options: {
                url: "https://www.douyin.com/",
                options: {
                  waitUntil: "load",
                },
              },
            },
            {
              type: "c.page.cookies",
              name: "获取cookie",
            },
          ],
        },
      ],
    },
  ],
});
