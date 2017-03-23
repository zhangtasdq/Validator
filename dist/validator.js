var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("interface/EngineInterface", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("interface/ExecutorResult", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ;
});
define("interface/ExecutorInterface", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ;
});
define("impl/GroupExecutor", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GroupExecutor = (function () {
        function GroupExecutor(name, executor) {
            this.name = name;
            this.executor = executor;
            this.childrens = [];
        }
        GroupExecutor.prototype.execute = function (target, contextData) {
            return this.executor(this.childrens, target, contextData);
        };
        GroupExecutor.prototype.addChild = function (executorItem) {
            this.childrens.push(executorItem);
        };
        return GroupExecutor;
    }());
    exports.default = GroupExecutor;
});
define("interface/OperatorInterface", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("impl/Operator", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Operator = (function () {
        function Operator(name, executor) {
            this.name = name;
            this.executor = executor;
        }
        Operator.prototype.run = function (currentValue, targetValue) {
            return this.executor(currentValue, targetValue);
        };
        return Operator;
    }());
    exports.default = Operator;
});
define("interface/SingleRuleInterface", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("impl/SingleExecutor", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SingleExecutor = (function () {
        function SingleExecutor(name, rule, operator) {
            this.name = name;
            this.rule = rule;
            this.operator = operator;
        }
        SingleExecutor.prototype.getObjValueByPath = function (target, path) {
            path = path.replace(/\[(\w+)\]/, ".$1");
            path = path.replace(/^\./, "");
            var pathArray = path.split("."), tempTarget = target, i = 0, j = pathArray.length;
            for (; i < j; ++i) {
                var key = pathArray[i];
                if (tempTarget.hasOwnProperty(key)) {
                    tempTarget = tempTarget[key];
                }
                else {
                    break;
                }
            }
            if (j === pathArray.length) {
                return tempTarget;
            }
            return null;
        };
        SingleExecutor.prototype.getCurrentValue = function (current) {
            var value = this.getObjValueByPath(current, this.rule.key);
            return value;
        };
        SingleExecutor.prototype.getTargetValue = function (target) {
            if (!this.rule.targetType || this.rule.targetType === "plainValue") {
                return this.rule.targetValue;
            }
            return this.getObjValueByPath(target, this.rule.targetValue);
        };
        SingleExecutor.prototype.execute = function (current, contextData) {
            var currentValue = this.getCurrentValue(current), targetValue = this.getTargetValue(contextData);
            if (this.operator.run(currentValue, targetValue)) {
                return { status: true };
            }
            return { status: false, errorMsg: this.rule.errorMsg };
        };
        return SingleExecutor;
    }());
    exports.default = SingleExecutor;
});
define("impl/ExecutorFactory", ["require", "exports", "impl/GroupExecutor", "impl/SingleExecutor"], function (require, exports, GroupExecutor_1, SingleExecutor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var andExecutor = function (children, target, contextData) {
        var result = { status: true };
        for (var i = 0, j = children.length; i < j; ++i) {
            result = children[i].execute(target, contextData);
            if (!result.status) {
                break;
            }
        }
        return result;
    };
    var orExecutor = function (children, target, contextData) {
        var itemResult = null;
        for (var i = 0, j = children.length; i < j; ++i) {
            itemResult = children[i].execute(target, contextData);
            if (itemResult.status) {
                break;
            }
        }
        return itemResult;
    };
    var GroupExecutorFactory = (function () {
        function GroupExecutorFactory() {
            this.groupExecutors = {};
            this.addGroupExecutor("and", andExecutor);
            this.addGroupExecutor("or", orExecutor);
        }
        GroupExecutorFactory.prototype.groupExecutorBuilder = function (name, executor) {
            return (function (_super) {
                __extends(class_1, _super);
                function class_1() {
                    return _super.call(this, name, executor) || this;
                }
                return class_1;
            }(GroupExecutor_1.default));
        };
        GroupExecutorFactory.prototype.addGroupExecutor = function (name, executor) {
            this.groupExecutors[name] = this.groupExecutorBuilder(name, executor);
        };
        GroupExecutorFactory.prototype.buildSingleExecutor = function (rule, operator) {
            rule = rule;
            return new SingleExecutor_1.default("singleExecutor", rule, operator);
        };
        GroupExecutorFactory.prototype.buildGroupExecutor = function (name) {
            var Group = this.groupExecutors[name];
            if (!Group) {
                throw new Error("\u7EC4 " + name + " \u4E0D\u5B58\u5728!");
            }
            return new Group();
        };
        return GroupExecutorFactory;
    }());
    exports.default = GroupExecutorFactory;
});
define("impl/OperatorFactory", ["require", "exports", "impl/Operator"], function (require, exports, Operator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var equalCallback = function (currentValue, targetValue) {
        return currentValue === targetValue;
    };
    var shadowEqual = function (currentValue, targetValue) {
        return currentValue == targetValue;
    };
    var notEqual = function (currentValue, targetValue) {
        return currentValue !== targetValue;
    };
    var lessThan = function (currentValue, targetValue) {
        return currentValue < targetValue;
    };
    var lessThanInclusive = function (currentValue, targetValue) {
        return currentValue <= targetValue;
    };
    var greaterThan = function (currentValue, targetValue) {
        return currentValue > targetValue;
    };
    var greaterThanInclusive = function (currentValue, targetValue) {
        return currentValue >= targetValue;
    };
    var contains = function (currentValue, targetValue) {
        return currentValue.indexOf && currentValue.indexOf(targetValue) !== -1;
    };
    var OperatorFactory = (function () {
        function OperatorFactory() {
            this.operators = {};
            this.addOperator("equal", equalCallback);
            this.addOperator("shadowEqual", shadowEqual);
            this.addOperator("notEqual", notEqual);
            this.addOperator("lessThan", lessThan);
            this.addOperator("lessThanInclusive", lessThanInclusive);
            this.addOperator("greaterThan", greaterThan);
            this.addOperator("greaterThanInclusive", greaterThanInclusive);
            this.addOperator("contains", contains);
        }
        OperatorFactory.prototype.addOperator = function (name, callback) {
            this.operators[name] = new Operator_1.default(name, callback);
        };
        OperatorFactory.prototype.getOperator = function (name) {
            var result = this.operators[name];
            if (!result) {
                throw new Error("\u64CD\u4F5C " + name + " \u4E0D\u5B58\u5728!");
            }
            return result;
        };
        return OperatorFactory;
    }());
    exports.default = OperatorFactory;
});
define("impl/Parser", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Parse = (function () {
        function Parse() {
        }
        Parse.prototype.parse = function (rule) {
            var result, keys = Object.keys(rule);
            if (keys.length === 1) {
                result = this.parseGroup(keys[0], rule[keys[0]]);
            }
            else {
                result = this.parseSingle(rule);
            }
            return result;
        };
        Parse.prototype.parseGroup = function (key, rule) {
            var executor = this.executorFactory.buildGroupExecutor(key);
            for (var i = 0, j = rule.length; i < j; ++i) {
                executor.addChild(this.parse(rule[i]));
            }
            return executor;
        };
        Parse.prototype.parseSingle = function (rule) {
            var operator = this.operatorFactory.getOperator(rule.operator);
            return this.executorFactory.buildSingleExecutor(rule, operator);
        };
        Parse.prototype.setExecutorFactory = function (executorFactory) {
            this.executorFactory = executorFactory;
        };
        Parse.prototype.setOperatorFactory = function (operatorFactory) {
            this.operatorFactory = operatorFactory;
        };
        return Parse;
    }());
    exports.default = Parse;
});
define("impl/Engine", ["require", "exports", "impl/ExecutorFactory", "impl/Parser", "impl/OperatorFactory"], function (require, exports, ExecutorFactory_1, Parser_1, OperatorFactory_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Engine = (function () {
        function Engine(contextData) {
            if (contextData === void 0) { contextData = {}; }
            this.executorFactory = new ExecutorFactory_1.default();
            this.operatorFactory = new OperatorFactory_1.default();
            this.parser = new Parser_1.default();
            this.contextData = contextData;
            this.currentRule = {};
        }
        Engine.prototype.addRule = function (key, rule) {
            this.parser.setExecutorFactory(this.executorFactory);
            this.parser.setOperatorFactory(this.operatorFactory);
            this.currentRule[key] = this.parser.parse(rule);
        };
        Engine.prototype.run = function (key, target, successCallback, errorCallback) {
            var executor = this.currentRule[key];
            if (!executor) {
                throw new Error("\u89C4\u5219 " + key + " \u4E0D\u5B58\u5728!");
            }
            var result = executor.execute(target, this.contextData);
            if (result.status) {
                successCallback();
            }
            else if (errorCallback) {
                errorCallback(result);
            }
        };
        Engine.prototype.addGroupExecutor = function (key, executor) {
            this.executorFactory.addGroupExecutor(key, executor);
        };
        Engine.prototype.addOperator = function (key, operator) {
            this.operatorFactory.addOperator(key, operator);
        };
        return Engine;
    }());
    exports.default = Engine;
});
//# sourceMappingURL=validator.js.map