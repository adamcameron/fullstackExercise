<template>
    <workshop-registration-form></workshop-registration-form>
</template>

<script>
import WorkshopRegistrationForm from "./components/WorkshopRegistrationForm";
import WorkshopService from "../../src/workshopRegistration/services/WorkshopService";

export default {
    name: 'App',
    components: {
        WorkshopRegistrationForm
    },
    provide: {
        workshopService: new WorkshopService()
    }
}
</script>
