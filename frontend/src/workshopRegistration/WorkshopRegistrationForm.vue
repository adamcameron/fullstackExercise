<style scoped>
.workshopRegistration *  {
    box-sizing: border-box;
}

.workshopRegistration fieldset  {
    border: none;
    margin: 0px;
    padding: 0px;
}

form.workshopRegistration, dl.workshopRegistration {
    padding: 1em;
    background: #f9f9f9;
    border: 1px solid #c1c1c1;
    margin-top: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    padding: 1em;
    overflow: hidden;
}

.workshopRegistration input, .workshopRegistration select, .workshopRegistration dd {
    background: #fff;
    border: 1px solid #9c9c9c;
    float: left;
    width: calc(100% - 200px);
    padding: 0.7em;
    margin-bottom: 0.5rem;
}

.workshopRegistration label.required:after {
    content:" *";
    color: red;
}

.workshopRegistration dd {
    margin-left: 0px;
    background: none;
}

.workshopRegistration dd.reg-code {
    font-size: 90%;
}

.workshopRegistration aside {
    float: right;
    width: calc(100% - 200px);
    padding: 0.7em;
    margin-bottom: 0.5rem;
}

.workshopRegistration button {
    background: lightgrey;
    padding: 0.7em;
    border: 0;
    float: right;
    width: calc(100% - 200px);
}

.workshopRegistration label, .workshopRegistration dt {
    text-align: right;
    display: block;
    padding: 0.5em 1.5em 0.5em 0;
    float: left;
    width: 200px;
}
</style>

<template>
    <form method="post" action="" class="workshopRegistration" v-if="registrationState !== REGISTRATION_STATE_SUMMARY" novalidate="true">
        <fieldset :disabled="isFormDisabled">
            <label for="fullName" class="required">Full name:</label>
            <input type="text" name="fullName" required="required" maxlength="100" id="fullName" v-model="formValues.fullName">

            <label for="phoneNumber" class="required">Phone number:</label>
            <input type="text" name="phoneNumber" required="required" maxlength="50" id="phoneNumber" v-model="formValues.phoneNumber">

            <label for="workshopsToAttend" class="required">Workshops to attend:</label>
            <select name="workshopsToAttend[]" multiple="true" required="required" id="workshopsToAttend" v-model="formValues.workshopsToAttend">
                <option v-for="workshop in workshops" :value="workshop.id" :key="workshop.id">{{workshop.name}}</option>
            </select>

            <label for="emailAddress" class="required">Email address:</label>
            <input type="email" name="emailAddress" required="required" maxlength="320" id="emailAddress" v-model="formValues.emailAddress" autocomplete="off">

            <label for="password" class="required">Password:</label>
            <input @keyup="checkPassword" type="password" name="password" required="required" maxlength="255" id="password" v-model="formValues.password" autocomplete="new-password">

            <aside class="passwordMessage" v-if="showPasswordMessage">
                Password must be at least eight characters long
                and must comprise at least one uppercase letter, one lowercase letter,
                one digit, and one other non-alphanumeric character.
            </aside>

            <button @click="processFormSubmission" :disabled="isFormUnready" v-html="submitButtonLabel"></button>
        </fieldset>
    </form>

<dl v-if="registrationState === REGISTRATION_STATE_SUMMARY" class="workshopRegistration">
    <dt>Registration Code:</dt>
    <dd class="reg-code">{{ summaryValues.registrationCode }}</dd>

    <dt>Full name:</dt>
    <dd>{{ summaryValues.fullName }}</dd>

    <dt>Phone number:</dt>
    <dd>{{ summaryValues.phoneNumber }}</dd>

    <dt>Email address:</dt>
    <dd>{{ summaryValues.emailAddress }}</dd>

    <dt>Workshops:</dt>
    <dd>
        <ul>
            <li v-for="workshop in summaryValues.workshopsToAttend" :key="workshop.id">{{workshop.name}}</li>
        </ul>
    </dd>
</dl>
</template>

<script>
const REGISTRATION_STATE_FORM = "form";
const REGISTRATION_STATE_PROCESSING = "processing";
const REGISTRATION_STATE_SUMMARY = "summary";

export default {
    name: "WorkshopRegistrationForm",
    inject: [
        "workshopService"
    ],
    data() {
        return {
            registrationState: REGISTRATION_STATE_FORM,
            promisedWorkshops: null,
            workshops: [],
            formValues : {
                fullName : "",
                phoneNumber : "",
                workshopsToAttend : [],
                emailAddress : "",
                password : ""
            },
            showPasswordMessage : false
        };
    },
    created() {
        this.REGISTRATION_STATE_FORM = REGISTRATION_STATE_FORM;
        this.REGISTRATION_STATE_PROCESSING = REGISTRATION_STATE_PROCESSING;
        this.REGISTRATION_STATE_SUMMARY = REGISTRATION_STATE_SUMMARY;
    },
    async mounted() {
        this.promisedWorkshops = this.workshopService.getWorkshops();
        this.workshops = await this.promisedWorkshops;
    },
    methods : {
        async processFormSubmission(event) {
            event.preventDefault();
            this.registrationState = REGISTRATION_STATE_PROCESSING;
            this.summaryValues = await this.workshopService.saveWorkshopRegistration(this.formValues);
            this.registrationState = REGISTRATION_STATE_SUMMARY;
        },
        checkPassword() {
            this.showPasswordMessage = !this.isPasswordValid;
        }
    },
    computed : {
        isFormUnready: function () {
            let unready = this.formValues.fullName.length === 0
                || this.formValues.phoneNumber.length === 0
                || this.formValues.workshopsToAttend.length === 0
                || this.formValues.emailAddress.length === 0
                || !this.isPasswordValid;

            return unready;
        },
        isFormDisabled: function() {
            return this.registrationState !== REGISTRATION_STATE_FORM;
        },
        submitButtonLabel: function() {
            return this.registrationState === REGISTRATION_STATE_FORM ? "Register" : "Processing&hellip;";
        },
        isPasswordValid: function () {
            const validPasswordPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_])(?:.){8,}$");
            return validPasswordPattern.test(this.formValues.password);
        }
    }
}
</script>
