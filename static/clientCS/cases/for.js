({
    type: "for",
    name: "for",
    options: {
        values: [{ name: 1 }, { name: 2 }, , { name: 3 }],
        indexName: "index",
        itemName: "item",
    },
    children: [
        {
            useParentCtx: true,
            type: "delay",
            name: "延时3秒",
            options: { timeout: 3000 * Math.random() },
        },
        {
            useParentCtx: true,
            type: "code",
            name: "输出当前日期",
            options: {
                code: "Date.now()"
            }
        },
    ],
});
