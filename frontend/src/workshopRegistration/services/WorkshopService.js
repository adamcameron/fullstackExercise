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
        return {
            registrationCode : "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
            fullName : details.fullName,
            phoneNumber : details.phoneNumber,
            workshopsToAttend : details.workshopsToAttend,
            emailAddress : details.emailAddress
        };
    }
}

module.exports = WorkshopService;
