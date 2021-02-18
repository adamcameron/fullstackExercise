import GreetingMessage from "../../src/gdayWorld/components/GreetingMessage";

import { shallowMount } from "@vue/test-utils";

import {expect} from "chai";

describe("Tests of GreetingMessage component", () => {

    let greetingMessage;
    let expectedText = "TEST_MESSAGE";

    before("Load test GreetingMessage component", () => {
        greetingMessage = shallowMount(GreetingMessage, {propsData: {message: expectedText}});
    });

    it("should return the correct heading", () => {
        let heading = greetingMessage.find("h1");
        expect(heading.exists()).to.be.true;

        let headingText = heading.text();
        expect(headingText).to.equal(expectedText);
    });

    it("should return the correct content", () => {
        let contentParagraph = greetingMessage.find("h1+p");
        expect(contentParagraph.exists()).to.be.true;

        let contentParagraphText = contentParagraph.text();
        expect(contentParagraphText).to.equal(expectedText);
    });
});