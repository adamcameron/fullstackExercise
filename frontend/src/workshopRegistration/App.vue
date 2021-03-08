<template>
    <workshop-registration-form></workshop-registration-form>
</template>

<script>
import WorkshopRegistrationForm from "./component/WorkshopRegistrationForm";
import WorkshopService from "./service/WorkshopService";
import WorkshopCollection from "./model/WorkshopCollection";
import WorkshopRepository from "./repository/WorkshopRepository";
import WorkshopDAO from "./dao/WorkshopDAO";

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
