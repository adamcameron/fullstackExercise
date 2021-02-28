import WorkshopRegistrationForm from "../../src/workshopRegistration/components/WorkshopRegistrationForm";
import WorkshopService from "../../src/workshopRegistration/services/WorkshopService";

import {shallowMount} from "@vue/test-utils";

import {expect} from "chai";
import sinon from "sinon";

describe.only("Tests of WorkshopRegistrationForm component", () => {

    let component;
    let expectedOptions = [
        {value: 2, text:"Workshop 1"},
        {value: 3, text:"Workshop 2"},
        {value: 5, text:"Workshop 3"},
        {value: 7, text:"Workshop 4"}
    ];

    before("Load test WorkshopRegistrationForm component", () => {
        let workshopService = new WorkshopService();
        sinon.stub(workshopService, "getWorkshops").returns(expectedOptions);
        component = shallowMount(
            WorkshopRegistrationForm,
            {
                global : {
                    provide: {
                        workshopService : workshopService
                    }
                }
            }
        );
    });

    let inputFieldMetadata = [
        {name : "fullName", type:"text", maxLength: 100, labelText: "Full name"},
        {name : "phoneNumber", type:"text", maxLength: 50, labelText: "Phone number"},
        {name : "emailAddress", type:"text", maxLength: 320, labelText: "Email address"},
        {name : "password", type:"password", maxLength: 255, labelText: "Password"}
    ];

    inputFieldMetadata.forEach((caseValues) => {
        let [name, type, maxLength, labelText] = Object.values(caseValues);

        it(`should have a required ${type} input for ${name}, maxLength ${maxLength}, and label '${labelText}'`, () => {
            let field = component.find(`form.workshopRegistration input[name='${name}']`);

            expect(field.exists(), `${name} field must exist`).to.be.true;
            expect(field.attributes("required"), `${name} field must be required`).to.exist;
            expect(field.attributes("type"), `${name} field must have a type of ${type}`).to.equal(type);
            expect(field.attributes("maxlength"), `${name} field must have a maxlength of ${maxLength}`).to.equal(maxLength.toString());

            testLabel(field, labelText);
        });
    });

    it("should have a required workshopsToAttend multiple-select box, with label 'Workshops to attend'", () => {
        let field = component.find(`form.workshopRegistration select[name='workshopsToAttend[]']`);

        expect(field.exists(), "workshopsToAttend field must exist").to.be.true;
        expect(field.attributes("required"), "workshopsToAttend field must be required").to.exist;
        expect(field.attributes("multiple"), "workshopsToAttend field must be a multiple-select").to.exist;

        testLabel(field, "Workshops to attend");
    });

    let testLabel = (field, labelText) => {
        let name = field.attributes("name");
        let id = field.attributes("id");
        expect(id, "id attribute must be present").to.exist;

        let label = component.find(`form.workshopRegistration label[for='${id}']`);
        expect(label, `${name} field must have a label`).to.exist;
        expect(label.text(), `${name} field's label must have value '${labelText}'`).to.equal(`${labelText}:`);
    };

    it("should list the workshop options fetched from the back-end", () => {
        let options = component.findAll(`form.workshopRegistration select[name='workshopsToAttend[]']>option`);

        expect(options).to.have.length(expectedOptions.length);
        options.forEach((option, i) => {
            expect(option.attributes("value"), `option[${i}] value incorrect`).to.equal(expectedOptions[i].value.toString());
            expect(option.text(), `option[${i}] text incorrect`).to.equal(expectedOptions[i].text);
        });
    });

    it("should have a button to submit the registration", () => {
        let button = component.find(`form.workshopRegistration button`);

        expect(button.exists(), "submit button must exist").to.be.true;
        expect(button.text(), "submit button must be labelled 'register'").to.equal("Register");
    });

    it.only("should hide the form when it is submitted", async () => {
        let button = component.find(`form.workshopRegistration button`);

        await button.trigger("click");

        let form = component.find("form.workshopRegistration");
        expect(form).to.exist;
        expect(form.attributes("disabled")).to.exist;
        expect(button.text()).to.equal("Processing");
    });

    it("scratch" , async () => {
        let stages = [];
        component.vm.$watch("stage", (newValue) => {
            stages.push(newValue);
        });
        let button = component.find(`form.workshopRegistration button`);

        await button.trigger("click");
        expect(true).to.be.true;
    });
});
