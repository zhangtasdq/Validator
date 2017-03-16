import {expect} from "chai";
import {spy} from "sinon";
import "mocha";

import Engine from "../src/impl/Engine";
import ExecutorInterface from "../src/interface/ExecutorInterface";
import {rule} from "./test-data.spec";

describe("Validator Test", () => {
    let engine = new Engine();

    it("should throw error if rule not exist", () => {
        expect(() => {
            engine.run("not exist rule", {}, () => {

            });
        }).to.throw("规则 not exist rule 不存在!");
    });

    describe("base validate", () => {
        let ruleName = "base validate";

        engine.addRule(ruleName, rule);

        it("should call success callback if data is valid", () => {
            let maleData = {age: 25, gender: "male", height: 1.71},
                womanData = {age: 29, gender: "woman", height: 1.65},
                maleSpy = spy(),
                womanSpy = spy();

            engine.run(ruleName, maleData, maleSpy);
            expect(maleSpy.called).to.equal(true);
            engine.run(ruleName, womanData, womanSpy);
            expect(womanSpy.called).to.equal(true);
        });

        it("should call error callback if data is invalid", ()=>{
            let data = {age: 25, gender: "male", height: 1.9},
                ageSmall = {...data, age: 10},
                ageSmallSpy = spy(),
                ageBig = {...data, age: 30},
                ageBigSpy = spy(),
                heightMaleShort = {...data, height: 1.5},
                heightMaleSpy = spy(),
                heightWomanShort = {...data, gender: "woman", height: 1.5},
                heightWomanSpy = spy();

            engine.run(ruleName, ageSmall, ()=>{}, ageSmallSpy);
            expect(ageSmallSpy.called).to.equal(true);

            engine.run(ruleName, ageBig, ()=>{}, ageBigSpy);
            expect(ageBigSpy.called).to.equal(true);

            engine.run(ruleName, heightMaleShort, ()=>{}, heightMaleSpy);
            expect(heightMaleSpy.called).to.equal(true);

            engine.run(ruleName, heightWomanShort, ()=>{}, heightWomanSpy);
            expect(heightWomanSpy.called).to.equal(true);
        });
    });

    describe("custom group operator", () => {
        let notExistRule = {
            notExistRule: [{}]
        }

        it("show throw error if group operator not exits", () => {
            expect(() => {
                engine.addRule("not exist group", notExistRule);
            }).to.throw("组 notExistRule 不存在!");
        });

        describe("add custom operator", () => {
            let twice = (children: ExecutorInterface[], target:Object, contextData: Object) => {
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
                return result;
            };
            let rule = {
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

            engine.addGroupExecutor("twice", twice);
            engine.addRule("twice", rule);

            it("should pass if data is valid", () => {
                let fullMatchData = {name: "test", age: 18, gender: "male"},
                    fullMatchSpy = spy(),
                    twiceMatchData = {...fullMatchData, age: 33},
                    twiceMatchSpy = spy();

                engine.run("twice", fullMatchData, fullMatchSpy);
                expect(fullMatchSpy.called).to.equal(true);
                engine.run("twice", twiceMatchData, twiceMatchSpy);
                expect(twiceMatchSpy.called).to.equal(true);
            });

            it("should error if data is invalid", () => {
                let invalidData = {name: "not test", age: 18, gender: "woman"},
                    invalidSpy = spy(),
                    twiceInvalidData = {...invalidData, age: 12},
                    twiceInvalidSpy = spy();

                engine.run("twice", invalidData, ()=> {}, invalidSpy);
                expect(invalidSpy.called).to.equal(true);
                engine.run("twice", twiceInvalidData, () => {}, twiceInvalidSpy);
                expect(twiceInvalidSpy.called).to.equal(true);
            });
        });

    });
});
