import WorkshopRegistrationForm from "../../src/workshopRegistration/components/WorkshopRegistrationForm";

import { shallowMount } from "@vue/test-utils";

import {expect} from "chai";

describe.only("Tests of WorkshopRegistrationForm component", () => {

    let component;

    before("Load test WorkshopRegistrationForm component", () => {
        component = shallowMount(WorkshopRegistrationForm);
    });

    let inputFieldMetadata = [
        {fieldName : "fullName", type:"text", maxLength: 100, labelText: "Full name"},
        {fieldName : "phoneNumber", type:"text", maxLength: 50, labelText: "Phone number"},
        {fieldName : "emailAddress", type:"text", maxLength: 320, labelText: "Email address"},
        {fieldName : "password", type:"password", maxLength: 255, labelText: "Password"}
    ];

    inputFieldMetadata.forEach((caseValues) => {
        let [fieldName, type, maxLength, labelText] = Object.values(caseValues);

        it(`should contain a required ${type} input for ${fieldName} with maximum length of ${maxLength} characters, and label of '${labelText}'`, () => {
            let field = component.find(`form>input[name='${fieldName}']`);
            expect(field.exists(), `${fieldName} field must exist`).to.be.true;
            expect(field.attributes("type"), `${fieldName} field must have a type of ${type}`).to.equal(type);
            expect(field.attributes("maxlength"), `${fieldName} field must have a maxlength of ${maxLength}`).to.equal(maxLength.toString());
            expect(field.attributes("required"), `${fieldName} field must be required`).to.exist;

            let inputId = field.attributes("id");
            expect(inputId, "id attribute must be present").to.exist;

            let label = component.find(`form>label[for='${inputId}']`);
            expect(label, `${fieldName} field must have a label`).to.exist;
            expect(label.text(), `${fieldName} field's label must have value '${labelText}'`).to.equal(`${labelText}:`);
        });
    });
});
