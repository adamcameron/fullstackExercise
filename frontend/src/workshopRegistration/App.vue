<template>
    <workshop-registration-form></workshop-registration-form>
</template>

<script>
import WorkshopRegistrationForm from "./WorkshopRegistrationForm";
import WorkshopService from "./WorkshopService";
import WorkshopCollection from "./WorkshopCollection";
import WorkshopsRepository from "./WorkshopsRepository";
import WorkshopsDAO from "./WorkshopsDAO";
import Config from "./Config";
const client = require('axios').default;

let workshopService = new WorkshopService(
    new WorkshopCollection(
        new WorkshopsRepository(
            new WorkshopsDAO(client, Config)
        )
    )
);

export default {
    name: 'App',
    components: {
        WorkshopRegistrationForm
    },
    provide: {
        workshopService: workshopService
    }
}
</script>
