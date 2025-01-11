({
    type: "parallel",
    name: "parallel",
    context: {
        name: 1,
        timeout: 3 * 1000,
    },
    children: [
        {
            useParentCtx: true,
            type: "delay",
            name: "延时5000ms",
            options: { timeout: 5000 },
        },
        {
            useParentCtx: true,
            type: "code",
            name: "输出上下文",
            options: { code: "return $ctx" },
        },
    ],
});
