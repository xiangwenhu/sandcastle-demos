import { $, createActivity } from "sandcastle";

const activityConfig = $.ifElse({
    name: 'if else 测试',
    context: {
        count: 1
    },
    if: {
        useParentCtx: true,
        type: "sequence",
        assert: '$ctx.count  <= 5',
        name: '如果count小于等于5',
        children: [$.code({
            useParentCtx: true,
            name: '分支输出',
            options: { code: `console.log("count小于等于5分支", $ctx.count)` }
        }), $.delay({
            name: 'delay 5 秒',
            options: { timeout: 1000 }
        }), $.sequence({
            name: '连续睡觉',
            children: [
                $.sequence({
                    name: '连续睡觉二',
                    children: [$.delay({
                        options: { timeout: 2000 },
                        name: '连续睡觉delay2000'
                    }), $.delay({
                        name: "delay",
                        options: { timeout: 500 }
                    })]

                }),
                $.code({
                    name: '输出连续睡觉二 code Activity',
                    options: { code: 'console.log("连续睡觉二 code Activity")' }
                })]
        }),
        $.code({
            name: '输出当前时间',
            options: { code: 'console.log(new Date().toLocaleString())' }
        })]
    },
    elseif: [{
        type: "sequence",
        assert: '$ctx.count <=10 ',
        name: '如果count小于等于10',
        useParentCtx: true,
        children: [{
            type: 'code',
            name: '分支输出',
            options: { code: `console.log("count小于等于10分支")` }
        }, {
            type: 'delay',
            name: 'delay 10 秒',
            options: { timeout: 10000 }
        }, {
            type: 'code',
            name: '输出当前时间',
            options: { code: 'console.log(new Date().toLocaleString())' }
        }]
    }, {
        type: "sequence",
        assert: '$ctx.count <=15 ',
        name: '如果count小于等于15',
        useParentCtx: true,
        children: [{
            type: 'code',
            name: '分支输出',
            options: { code: `console.log("count小于等于15分支")` }
        }, {
            type: 'delay',
            name: 'delay 15秒',
            options: { timeout: 15000 }
        }, {
            type: 'code',
            name: '输出当前时间',
            options: { code: 'console.log(new Date().toLocaleString())' }
        }]
    }, {
        type: "sequence",
        assert: '$ctx.count <=25 ',
        name: '如果count小于等于25',
        useParentCtx: true,
        children: [{
            type: 'code',
            name: '分支输出',
            options: { code: `console.log("count小于等于25分支")` }
        }, {
            type: 'delay',
            name: 'delay 25秒',
            options: { timeout: 25000 }
        }, {
            type: 'code',
            name: '输出当前时间',
            options: { code: 'console.log(new Date().toLocaleString())' }
        }]
    }],
    else: {
        type: "sequence",
        name: '如果count大于25',
        useParentCtx: true,
        children: [{
            type: 'code',
            name: '分支输出',
            options: { code: `console.log("count大于25分支", $ctx.count)` }
        }, {
            type: 'delay',
            name: 'delay 50秒',
            options: { timeout: 50000 }
        }, {
            type: 'code',
            name: '输出当前时间',
            options: { code: 'console.log(new Date().toLocaleString())' }
        }]
    }
})

export default activityConfig;

