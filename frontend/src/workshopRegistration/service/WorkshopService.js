class WorkshopService {

    constructor(workshopCollection) {
        this.workshopCollection = workshopCollection;
    }

    async getWorkshops() {
        await this.workshopCollection.loadAll();
        return this.workshopCollection;
    }

    saveWorkshopRegistration(details) {
        let allWorkshops = this.getWorkshops();
        let selectedWorkshops = allWorkshops.filter((workshop) => {
            return details.workshopsToAttend.indexOf(workshop.value) >= 0;
        });

        return {
            registrationCode : "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
            fullName : details.fullName,
            phoneNumber : details.phoneNumber,
            emailAddress : details.emailAddress,
            workshopsToAttend : selectedWorkshops
        };
    }
}

module.exports = WorkshopService;
