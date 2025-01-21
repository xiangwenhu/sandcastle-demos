({
  type: "tryCatch",
  name: "tryCatch测试",
  children: [
    {
      name: "tryCatch哦",
      type: "tryCatch",
      children: [
        {
          type: "sequence",
          name: "tryCatch哦 children",
          children: [
            {
              type: "code",
              name: "log输出",
              options: { code: "console.log('catch中的code')" },
            },
            {
              type: "code",
              name: "异常代码",
              options: { code: "xxxxx/yyyyy" },
            },
            {
              type: "terminate",
              name: "终止",
              options: { message: "终止" },
            },
          ],
        },
      ],
      catch: {
        type: "sequence",
        name: "内部的catch的sequence",
        options: {
          code: function (err) {
            console.log("内部的catch:", err);
          },
        },
        children: [
          {
            name: "内部的code1",
            type: "code",
            options: {
              code: function (params) {
                console.log("内部的code1:", params.$$.error);
              },
            },
          },
          {
            name: "内部的code2",
            type: "code",
            options: {
              code: function (params) {
                console.log("内部的code2:", params.$$.error.message);
              },
            },
          },
        ],
      },
      finally: {
        name: "tryCatch哦 finally",
        type: "code",
        options: {
          code(act) {
            console.log("finally:", act);
          },
        },
      },
    },
    {
      type: "code",
      name: "tryCatch后输出",
      options: { code: "console.log('catch后');" },
    },
  ],
  catch: {
    type: "code",
    name: "catch后处理函数",
    options: { code: "console.log('catch触发后的处理函数');" },
  },
});
