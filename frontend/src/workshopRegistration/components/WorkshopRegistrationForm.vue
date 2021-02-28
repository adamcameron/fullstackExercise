<style scoped>
form.workshopRegistration {
    padding: 1em;
    background: #f9f9f9;
    border: 1px solid #c1c1c1;
    margin-top: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    padding: 1em;
}

form.workshopRegistration, .workshopRegistration label, .workshopRegistration input, .workshopRegistration select, .workshopRegistration button {
    box-sizing: border-box;
}

form.workshopRegistration fieldset {
    border:none;
}

form.workshopRegistration label {
    text-align: right;
    display: block;
    padding: 0.5em 1.5em 0.5em 0;
    float: left;
    width: 200px;
}

form.workshopRegistration label.required:after {
    content:" *";
    color: red;
}

form.workshopRegistration input, form.workshopRegistration select {
    margin-bottom: 1rem;
    background: #fff;
    border: 1px solid #9c9c9c;
    width: 100%;
    padding: 0.7em;
    margin-bottom: 0.5rem;
    float: left;
    width: calc(100% - 200px);
}

form.workshopRegistration button {
    background: lightgrey;
    padding: 0.7em;
    border: 0;
    float: right;
    width: calc(100% - 200px);
}
</style>

<template>
    <div v-if="registrationState === 'form'">
        <form method="post" action="" class="workshopRegistration">
            <fieldset :disabled="isFormDisabled">
                <label for="fullName" class="required">Full name:</label>
                <input type="text" name="fullName" required="required" maxlength="100" id="fullName" v-model="formValues.fullName">

                <label for="phoneNumber" class="required">Phone number:</label>
                <input type="text" name="phoneNumber" required="required" maxlength="50" id="phoneNumber" v-model="formValues.phoneNumber">

                <label for="workshopsToAttend" class="required">Workshops to attend:</label>
                <select name="workshopsToAttend[]" multiple="true" id="workshopsToAttend" v-model="formValues.workshopsToAttend">
                    <option v-for="workshop in workshops" :value="workshop.value" :key="workshop.value">{{workshop.text}}</option>
                </select>

                <label for="emailAddress" class="required">Email address:</label>
                <input type="text" name="emailAddress" required="required" maxlength="320" id="emailAddress" v-model="formValues.emailAddress" autocomplete="off">

                <label for="password" class="required">Password:</label>
                <input type="password" name="password" required="required" maxlength="255" id="password" v-model="formValues.password" autocomplete="new-password">

                <button @click="processFormSubmission" :disabled="isFormUnready" v-html="submissionState"></button>
            </fieldset>
        </form>
    </div>
    <div v-if="registrationState === 'summary'">
        Registration code: {{ summaryValues.registrationCode }}<br>
        Full name: {{ summaryValues.fullName }}<br>
        Phone number:  {{ summaryValues.phoneNumber }}<br>
        Email address:  {{ summaryValues.emailAddress }}<br>
        Workshops: TBC<br>
    </div>
</template>

<script>
export default {
    name: "WorkshopRegistrationForm",
    inject: ["workshopService"],
    data() {
        return {
            registrationState: "form",
            submissionState: "Register",
            workshops: [],
            formValues : {
                fullName : "",
                phoneNumber : "",
                workshopsToAttend : [],
                emailAddress : "",
                password : ""
            },
            summaryValues : {
                registrationCode : "",
                fullName : "",
                phoneNumber : "",
                workshopsToAttend : [],
                emailAddress : ""
            }
        };
    },
    mounted() {
        this.workshops = this.workshopService.getWorkshops();
    },
    methods : {
        processFormSubmission : function (event) {
            event.preventDefault();
            this.submissionState = "Processing&hellip;";
            this.summaryValues = this.workshopService.saveWorkshopRegistration(this.formValues);
            this.registrationState = "summary";
        }
    },
    computed : {
        isFormUnready: function () {
            return this.formValues.fullName.length === 0
                || this.formValues.phoneNumber.length === 0
                || this.formValues.workshopsToAttend.length === 0
                || this.formValues.emailAddress.length === 0
                || this.formValues.password.length === 0
        },
        isFormDisabled: function() {
            return this.submissionState !== "Register";
        }
    }
}
</script>
