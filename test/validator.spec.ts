import {expect} from "chai";
import {spy} from "sinon";
import "mocha";

import Engine from "../src/impl/Engine";
import ExecutorInterface from "../src/interface/ExecutorInterface";
import {baseRule, notExistRule, twiceExecutor, twiceRule, notExistOperatorRule, matchOperator, matchRule} from "./test-data.spec";

describe("Validator Test", () => {
    let engine = new Engine();

    it("should throw error if rule not exist", () => {
        expect(() => {
            engine.run("not exist rule", {}, () => {});
        }).to.throw("规则 not exist rule 不存在!");
    });

    describe("base validate", () => {
        let ruleName = "base validate";

        engine.addRule(ruleName, baseRule);

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

    describe("custom group executor", () => {
        it("show throw error if group executor not exits", () => {
            expect(() => {
                engine.addRule("not exist group", notExistRule);
            }).to.throw("组 notExistRule 不存在!");
        });

        describe("add custom executor", () => {
            engine.addGroupExecutor("twice", twiceExecutor);
            engine.addRule("twice", twiceRule);

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

    describe("custom operator", () => {
        it("show throw error if operator not exits", () => {
            expect(() => {
                engine.addRule("not exist group", notExistOperatorRule);
            }).to.throw("操作 not_exist_operator 不存在!");
        });

        describe("add custom executor", () => {
            let ruleName = "test match";

            engine.addOperator("match", matchOperator);
            engine.addRule(ruleName, matchRule);

            it("should pass if data is valid", () => {
                let validData = {name: "test", age: 18, gender: "male", email: "tester-hello@gmail.com"},
                    validDataSpy = spy();

                engine.run(ruleName, validData, validDataSpy);
                expect(validDataSpy.called).to.equal(true);
            });

            it("should error if data is invalid", () => {
                let invalidData = {name: "not test", age: 18, gender: "woman", email: "invaild-email@gmail.com"},
                    invalidSpy = spy();

                engine.run(ruleName, invalidData, ()=> {}, invalidSpy);
                expect(invalidSpy.called).to.equal(true);
            });
        });
    });
});
