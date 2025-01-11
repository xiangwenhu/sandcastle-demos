({
    type: "request",
    name: "请求",
    context: {
        url: "https://www.baidu.com",
    },
    options: {
        url: "{{$ctx.url}}", // "${ctx.url}"
        useDataOnly: true
    }
});
