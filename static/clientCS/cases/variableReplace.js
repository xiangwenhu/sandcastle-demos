({
    type: 'code',
    name: '变量替换',
    deepReplace: true,
    replaceArray: true,
    context: {
        url: "https://www.baidu.com",
        options: {
            url: "https://www.jd.com"
        },
        name: "name"
    },
    options: {
        code: 'return { name: $ctx.name,  arr: [ $ctx.name, $ctx.options] }'
    }
});

