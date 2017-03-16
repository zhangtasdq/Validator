import {expect} from "chai";
import {spy} from "sinon";
import "mocha";

import Engine from "../src/impl/Engine";
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
});
