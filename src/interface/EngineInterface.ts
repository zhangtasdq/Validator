interface EngineInterface {
    addRule: (key:string, rule:Object) => void;
    run: (key:string, target:Object, successCallback: () => any, errorCallback?: (result:Object) => any) => void;
}

export default EngineInterface;
