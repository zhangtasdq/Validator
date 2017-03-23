import ExecutorInterface from "../src/interface/ExecutorInterface";

let contextDataRule = {
    and: [
        {
            operator: "equal",
            key: "isAdmin",
            targetType: "contextData",
            targetValue: "isAdmin"
        }
    ]
}

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

let notExistRule = {
    notExistRule: [{}]
}

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
}

let notExistOperatorRule = {
    and: [{
        operator: "not_exist_operator",
        key: "email",
        targetValue: /^tester.*@gmail.com/
    }]
}

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

export {contextDataRule, baseRule, notExistRule, twiceExecutor, twiceRule, notExistOperatorRule, matchOperator, matchRule};
