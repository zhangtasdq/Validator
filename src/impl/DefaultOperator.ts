import Operator from "./Operator";

const DefaultOperator = {
    "equal": new Operator("equal", (currentValue:any, targetValue:any) => currentValue === targetValue),
    "shadowEqual": new Operator("shadowEqual", (currentValue:any, targetValue:any) => currentValue == targetValue),
    "notEqual": new Operator("notEqual", (currentValue:any, targetValue:any) => currentValue != targetValue),
    "lessThan": new Operator("lessThan", (currentValue:number, targetValue:number) => currentValue < targetValue),
    "lessThanInclusive": new Operator("lessThanInclusive", (currentValue:number, targetValue:number) => currentValue <= targetValue),
    "greaterThan": new Operator("greaterThan", (currentValue:number, targetValue: number) => currentValue > targetValue),
    "greaterThanInclusive": new Operator("greaterThanInclusive", (currentValue:number, targetValue) => currentValue >= targetValue)
};

export default DefaultOperator;
