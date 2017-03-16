let rule = {
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

export {rule};
