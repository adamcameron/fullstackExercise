import Workshop from "./Workshop";

class WorkshopsRepository {

    constructor(dao) {
        this.dao = dao;
    }

    selectAll1() {
        return this.dao.selectAll()
            .then((unmodelledWorkshops) => {
                return unmodelledWorkshops.map((unmodelledWorkshop) => {
                    return new Workshop(unmodelledWorkshop.id, unmodelledWorkshop.name);
                });
            });
    }

    async selectAll() {
        return (await this.dao.selectAll()).map((unmodelledWorkshop) => {
            return new Workshop(unmodelledWorkshop.id, unmodelledWorkshop.name);
        });
    }
}

export default WorkshopsRepository;
