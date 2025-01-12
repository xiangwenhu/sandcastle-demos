({
    type: 'sequence',
    name: 'terminate测试',
    children: [{
        type: 'code',
        name: '输出当前日期',
        options: {code: 'console.log(new Date().toLocaleString())'}
    }, {
        type: 'delay',
        name: '延时2秒',
        options: {timeout: 2000}
    }, {
        type: 'code',
        name: '输出当前日期',
        options: {code: 'console.log(new Date().toLocaleString())'}
    }, {
        type: 'sequence',
        name: 'terminate sequence 测试',
        children: [{
            type: 'code',
            name: '输出11111',
            options: {code: 'console.log(11111)'}
        }, {
            type: 'delay',
            name: '延时4秒',
            options: {timeout: 4000}
        }, {
            type: 'terminate',
            name: '终止',
            options: { message: '终止啦阿拉啦啦'}
        }, {
            type: 'code',
            name: '输出22222',
            options: { code: 'console.log(22222)'}
        }]
    }, {
        type: 'code',
        name: '输出33333',
        options: {code: 'console.log(33333)'}
    }, {
        type: 'delay',
        name: '延时5秒',
        options: {timeout: 5000}
    }]
});