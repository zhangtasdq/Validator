import hello from "../src/Hello";
import {expect} from "chai";
import "mocha";

describe("hello", () => {
    it("hello", () => {
        const a = hello();
        expect(a).to.equal("Hello");
    })
})
