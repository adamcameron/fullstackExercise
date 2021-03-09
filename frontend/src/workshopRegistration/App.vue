<template>
    <workshop-registration-form></workshop-registration-form>
</template>

<script>
import WorkshopRegistrationForm from "./WorkshopRegistrationForm";
import WorkshopService from "./WorkshopService";
import WorkshopCollection from "./WorkshopCollection";
import WorkshopRepository from "./WorkshopRepository";
import WorkshopDAO from "./WorkshopDAO";

let dao = new WorkshopDAO();
let repo = new WorkshopRepository(dao);
let collection = new WorkshopCollection(repo);

let workshopService = new WorkshopService(collection);

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
