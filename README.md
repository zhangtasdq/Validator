validator
===
>Used to test whether the data conforms to the rules, and can custom operation

Demo
---
[codepen validator](http://codepen.io/cqmyg/pen/PpeQoJ)

Example
---
### Basic Example
```js
import Engine from "../src/impl/Engine";

let baseRule = {
    and: [
        {
            operator: "greaterThan",
            key: "age",
            errorMsg: "年龄必须大于 18",
            targetValue: 18
        }, {
            operator: "lessThan",
            key: "age",
            errorMsg: "年龄必须小于 30",
            targetValue: 30
        }, {
            or: [
                {
                    and: [
                        {
                            operator: "equal",
                            key: "gender",
                            targetValue: "male"
                        },
                        {
                            operator: "greaterThan",
                            key: "height",
                            errorMsg: "男性身高必须大于 1.7m",
                            targetValue: 1.7
                        }

                    ]
                },
                {
                    and: [
                        {
                            operator: "equal",
                            key: "gender",
                            targetValue: "woman"
                        },
                        {
                            operator: "greaterThan",
                            key: "height",
                            errorMsg: "女性身高必须大于 1.6m",
                            targetValue: 1.6
                        }
                    ]
                }
            ]
        }
    ]
};

let ruleName = "base validate",
    maleData = {age: 25, gender: "male", height: 1.71},
    engine = new Engine();

engine.addRule(ruleName, baseRule);
engine.run(ruleName, maleData, () => {
    alert("success!");
}, (error) => {
    alert("failed");
});
```

### Custom Operation
```js
import Engine from "../src/impl/Engine";

let matchOperator = (currentValue:any, targetValue: any) => {
    return targetValue.test(currentValue);
};

let matchRule = {
    and: [{
        operator: "match",
        key: "email",
        targetValue: /^tester.*@gmail.com/
    }]
};
let ruleName = "test match",
    validData = {name: "test", age: 18, gender: "male", email: "tester-hello@gmail.com"},
    engine = new Engine();

engine.addOperator("match", matchOperator);
engine.addRule(ruleName, matchRule);

engine.run(ruleName, validData, () => {
    alert("success!");
}, (error) => {
    alert("failed");
});

```

### Custom Group Operation
```js
import Engine from "../src/impl/Engine";

let twiceExecutor = (children: ExecutorInterface[], target:Object, contextData: Object) => {
    let result = {status: true},
        successCount = 0;

    for(let i = 0, j = children.length; i < j; ++i) {
        result = children[i].execute(target, contextData);
        if (result.status) {
            successCount++;
        }
    }
    if (successCount === 2) {
        return {status: true};
    }
    return {status: false};
};

let twiceRule = {
    twice: [{
        operator: "equal",
        key: "name",
        targetValue: "test"
    }, {
        operator: "lessThan",
        key: "age",
        targetValue: 20
    }, {
        operator: "equal",
        key: "gender",
        targetValue: "male"
    }]
};
let twiceMatchData = {name: "test", age: 48, gender: "male"},
    engine = new Engine();

engine.addGroupExecutor("twice", twiceExecutor);
engine.addRule("twice", twiceRule);

engine.run(ruleName, twiceMatchData, () => {
    alert("success!");
}, (error) => {
    alert("failed");
});
```
Build
---
```shell
grunt
```

Test
```shell
npm run test
```
