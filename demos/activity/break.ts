import { $, createActivity, IActivityConfig } from "sandcastle";



const activityProps: IActivityConfig = {
    type: 'sequence',
    name: 'break测试',
    children: [{
        before: {
            type: "code",
            name: "code before",
            options: { code: "console.log('code before')" }
        },
        type: 'code',
        name: '输出当前日期',
        options: { code: 'console.log(new Date().toLocaleString())' },
        after: 'console.log("code after")'
    }, {
        type: 'delay',
        name: '延时2秒',
        options: { timeout: 2000 }
    }, {
        type: 'code',
        name: '输出当前日期',
        options: { code: 'console.log(new Date().toLocaleString())' }
    }, {
        type: 'sequence',
        name: 'break测试',
        children: [{
            type: 'code',
            name: '输出11111',
            options: { code: 'console.log(11111)' }
        }, {
            type: 'delay',
            name: '延时4秒',
            options: { timeout: 4000 }
        }, {
            type: 'break',
            name: '跳出break测试',
            options: { message: '哈喽' }
        }, {
            type: 'code',
            name: '输出22222',
            options: { code: 'console.log(22222)' }
        }]
    }, {
        type: 'code',
        name: '输出33333',
        options: { code: 'console.log(33333)' }
    }, {
        type: 'delay',
        name: '延时5秒',
        options: { timeout: 5000 }
    }]
}

const activity = createActivity(activityProps);

activity.run();