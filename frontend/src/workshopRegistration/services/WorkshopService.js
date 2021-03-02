class WorkshopService {
    getWorkshops() {
        return [
            {value: 2, text:"Workshop 1"},
            {value: 3, text:"Workshop 2"},
            {value: 5, text:"Workshop 3"},
            {value: 7, text:"Workshop 4"}
        ];
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
