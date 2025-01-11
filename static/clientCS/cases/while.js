({
    type: "while",
    name: "如果ctx.count小于5，加加",
    context: {
        count: 1,
    },
    assert: {
        useParentCtx: true,
        type: "code",
        options: { code: "return $ctx.count < 5" },
        name: "assert",
    },
    children: [
        {
            useParentCtx: true,
            type: "code",
            name: "count加1",
            options: { code: "$ctx.count++" },
        },
        {
            type: "delay",
            name: "睡500ms",
            options: { timeout: 500 },
        },
        {
            useParentCtx: true,
            type: "code",
            name: "输出count",
            options: { code: 'return $ctx.count' },
        },
    ],
});
