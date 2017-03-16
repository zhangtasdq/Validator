import Operator from "./Operator";

let equalCallback = (currentValue:any, targetValue:any) => {
    return currentValue === targetValue;
}

let shadowEqual = (currentValue:any, targetValue:any) => {
    return currentValue == targetValue;
}

let notEqual = (currentValue:any, targetValue:any) => {
    return currentValue !== targetValue;
}

let lessThan = (currentValue:any, targetValue:any) => {
    return currentValue < targetValue;
}

let lessThanInclusive = (currentValue:any, targetValue:any) => {
    return currentValue <= targetValue;
};

let greaterThan = (currentValue:any, targetValue:any) => {
    return currentValue > targetValue;
};

let greaterThanInclusive = (currentValue:any, targetValue:any) => {
    return currentValue >= targetValue;
};

let contains = (currentValue, targetValue:any) => {
    return currentValue.indexOf && currentValue.indexOf(targetValue) !== -1;
};

class OperatorFactory {
    private operators:{[key:string]: Operator};

    constructor() {
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

    addOperator(name:string, callback:(currentValu:any, targetValue:any) => boolean):void {
        this.operators[name] = new Operator(name, callback);
    }

    getOperator(name:string):Operator {
        let result = this.operators[name];
        if (!result) {
            throw new Error(`操作 ${name} 不存在!`);
        }
        return result;
    }
}

export default OperatorFactory;
