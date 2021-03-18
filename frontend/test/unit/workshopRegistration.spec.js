import WorkshopRegistrationForm from "../../src/workshopRegistration/WorkshopRegistrationForm";
import WorkshopService from "../../src/workshopRegistration/WorkshopService";
import WorkshopCollection from "../../src/workshopRegistration/WorkshopCollection";
import WorkshopsRepository from "../../src/workshopRegistration/WorkshopsRepository";
import WorkshopsDAO from "../../src/workshopRegistration/WorkshopsDAO";

import {shallowMount} from "@vue/test-utils";

import {expect} from "chai";
import sinon from "sinon";
import flushPromises from "flush-promises";

describe("Testing WorkshopRegistrationForm component", () => {

    const TEST_INPUT_VALUE = "TEST_VALUE";
    const TEST_SELECT_VALUE = 5;
    const VALID_PASSWORD = "aA1!1234";
    const INVALID_PASSWORD = "INVALID_PASSWORD";

    let component;
    let expectedOptions = [
        {value: 2, text:"Workshop 1"},
        {value: 3, text:"Workshop 2"},
        {value: 5, text:"Workshop 3"},
        {value: 7, text:"Workshop 4"}
    ];
    let workshopService;

    beforeEach("Load test WorkshopRegistrationForm component", async () => {
        let dao = new WorkshopsDAO();
        sinon.stub(dao, "selectAll").returns(Promise.resolve(
            expectedOptions.map((option) => ({id: option.value, name: option.text}))
        ));
        workshopService = new WorkshopService(
            new WorkshopCollection(
                new WorkshopsRepository(
                    dao
                )
            )
        );

        component = await shallowMount(
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

    describe("Testing form element display", () => {
        let inputFieldMetadata = [
            {name : "fullName", type:"text", maxLength: 100, labelText: "Full name"},
            {name : "phoneNumber", type:"text", maxLength: 50, labelText: "Phone number"},
            {name : "emailAddress", type:"email", maxLength: 320, labelText: "Email address"},
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
            let field = component.find("form.workshopRegistration select[name='workshopsToAttend[]']");

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
            component.vm.$watch("workshops", async () => {
                await flushPromises();
                let options = component.findAll("form.workshopRegistration select[name='workshopsToAttend[]']>option");
                expect(options).to.have.length(expectedOptions.length);
                options.forEach((option, i) => {
                    expect(option.attributes("value"), `option[${i}] value incorrect`).to.equal(expectedOptions[i].value.toString());
                    expect(option.text(), `option[${i}] text incorrect`).to.equal(expectedOptions[i].text);
                });
            });
        });

        it("should have a button to submit the registration", () => {
            let button = component.find("form.workshopRegistration button");

            expect(button.exists(), "submit button must exist").to.be.true;
            expect(button.text(), "submit button must be labelled 'register'").to.equal("Register");
        });
    });

    describe("Password-strength validation tests", () => {
        const examples = [
            {case: "cannot have fewer than 8 characters", password: "Aa1!567", valid: false},
            {case: "can have exactly 8 characters", password: "Aa1!5678", valid: true},
            {case: "can have more than 8 characters", password: "Aa1!56789", valid: true},
            {case: "must have at least one lowercase letter", password: "A_1!56789", valid: false},
            {case: "must have at least one uppercase letter", password: "_a1!56789", valid: false},
            {case: "must have at least one digit", password: "Aa_!efghi", valid: false},
            {case: "must have at least one non-alphanumeric character", password: "Aa1x56789", valid: false},
            {case: "can have underscore as the one non-alphanumeric character", password: "Aa1_56789", valid: true}
        ];

        examples.forEach((testCase) => {
            it(testCase.case, async () => {
                await populateForm(testCase.password);
                await flushPromises();

                let buttonDisabledAttribute = component.find("form.workshopRegistration button").attributes("disabled");
                let failureMessage = `${testCase.password} should be ${testCase.valid ? "valid" : "invalid"}`;

                testCase.valid
                    ? expect(buttonDisabledAttribute, failureMessage).to.not.exist
                    : expect(buttonDisabledAttribute, failureMessage).to.exist;
            });
        });

        it("does not show the user a message if the password value is valid after they have typed one in", async () => {
            confirmMessageVisibility(false);

            await enterAPassword(VALID_PASSWORD);
            confirmMessageVisibility(false);
        });

        it("shows the user a message if the password value is not valid after they have typed one in", async () => {
            confirmMessageVisibility(false);

            await enterAPassword(INVALID_PASSWORD);
            confirmMessageVisibility(true);
        });

        it("hides the previously displayed bad password message if the password is updated to be valid", async () => {
            confirmMessageVisibility(false);

            await enterAPassword(INVALID_PASSWORD);
            confirmMessageVisibility(true);

            await enterAPassword(VALID_PASSWORD);
            confirmMessageVisibility(false);
        });

        let enterAPassword = async function (password) {
            let passwordField = component.find("form.workshopRegistration input[type='password']");
            await passwordField.setValue(password);
            await passwordField.trigger("keyup");

            await flushPromises();
        };

        let confirmMessageVisibility = function (visible) {
            let messageField = component.find("form.workshopRegistration aside.passwordMessage");
            visible
                ? expect(messageField.exists(), "message should be visible").to.be.true
                : expect(messageField.exists(), "message should not be visible").to.be.false;
        };

    });

    describe("Testing form submission", () => {
        it("should leave the submit button disabled until the form is filled", () => {
            component.vm.$watch("workshops", async () => {
                await flushPromises();
                let button = component.find("form.workshopRegistration button");

                expect(button.attributes("disabled"), "button should be disabled before form is populated").to.exist;

                await populateForm();
                expect(button.attributes("disabled"), "button should be enabled after form is populated").to.not.exist;
            });
        });

        it("should disable the form and indicate data is processing when the form is submitted", () => {
            component.vm.$watch("workshops", async () => {
                await flushPromises();
                let lastLabel;
                component.vm.$watch("submitButtonLabel", (newValue) => {
                    lastLabel = newValue;
                });

                let lastFormState;
                component.vm.$watch("isFormDisabled", (newValue) => {
                    lastFormState = newValue;
                });

                await submitPopulatedForm();

                expect(lastLabel).to.equal("Processing&hellip;");
                expect(lastFormState).to.be.true;
            });
        });

        it("should send the form values to WorkshopService.saveWorkshopRegistration when the form is submitted", () => {
            component.vm.$watch("workshops", async () => {
                await flushPromises();
                sinon.spy(workshopService, "saveWorkshopRegistration");

                await submitPopulatedForm();

                expect(
                    workshopService.saveWorkshopRegistration.calledOnceWith({
                        fullName: TEST_INPUT_VALUE + "_fullName",
                        phoneNumber: TEST_INPUT_VALUE + "_phoneNumber",
                        workshopsToAttend: [TEST_SELECT_VALUE],
                        emailAddress: TEST_INPUT_VALUE + "_emailAddress",
                        password: VALID_PASSWORD
                    }),
                    "Incorrect values sent to WorkshopService.saveWorkshopRegistration"
                ).to.be.true;
            });
        });
    });

    describe("Testing summary display", () => {
        it("should display the registration summary 'template' after the registration has been submitted", () => {
            component.vm.$watch("workshops", async () => {
                await flushPromises();
                await submitPopulatedForm();

                let summary = component.find("dl.workshopRegistration");
                expect(summary.exists(), "summary must exist").to.be.true;

                let expectedLabels = ["Registration Code", "Full name", "Phone number", "Email address", "Workshops"];
                let labels = summary.findAll("dt");

                expect(labels).to.have.length(expectedLabels.length);
                expectedLabels.forEach((label, i) => {
                    expect(labels[i].text()).to.equal(`${label}:`);
                });
            });
        });

        it("should display the summary values in the registration summary", () => {
            component.vm.$watch("workshops", async () => {
                await flushPromises();
                const summaryValues = {
                    registrationCode: "TEST_registrationCode",
                    fullName: "TEST_fullName",
                    phoneNumber: "TEST_phoneNumber",
                    emailAddress: "TEST_emailAddress",
                    workshopsToAttend: [{id: "TEST_workshopToAttend_VALUE", name: "TEST_workshopToAttend_TEXT"}]
                };
                sinon.stub(workshopService, "saveWorkshopRegistration").returns(summaryValues);

                await submitPopulatedForm();

                let summary = component.find("dl.workshopRegistration");
                expect(summary.exists(), "summary must exist").to.be.true;

                let expectedValues = Object.values(summaryValues);
                let values = summary.findAll("dd");
                expect(values).to.have.length(expectedValues.length);

                let expectedWorkshopValue = expectedValues.pop();
                let actualWorkshopValue = values.pop();

                let ddValue = actualWorkshopValue.find("ul>li");
                expect(ddValue.exists()).to.be.true;
                expect(ddValue.text()).to.equal(expectedWorkshopValue[0].name);

                expectedValues.forEach((expectedValue, i) => {
                    expect(values[i].text()).to.equal(expectedValue);
                });
            });
        });
    });

    let submitPopulatedForm = async () => {
        await populateForm();
        await component.find("form.workshopRegistration button").trigger("click");
        await flushPromises();
    };

    let populateForm = async (password = VALID_PASSWORD) => {
        let form = component.find("form.workshopRegistration");
        form.find("input[name='fullName").setValue(TEST_INPUT_VALUE + "_fullName");
        form.find("input[name='phoneNumber").setValue(TEST_INPUT_VALUE + "_phoneNumber");
        form.find("input[name='emailAddress").setValue(TEST_INPUT_VALUE + "_emailAddress");
        form.find("input[name='password").setValue(password);
        form.find("select").setValue(TEST_SELECT_VALUE);

        await flushPromises();
    };
});
