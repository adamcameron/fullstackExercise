import Workshop from "./Workshop";

class WorkshopRepository {

    constructor(dao) {
        this.dao = dao;
    }

    selectAll() {
        return this.dao.selectAll()
            .then((unmodelledWorkshops) => {
                return unmodelledWorkshops.map((unmodelledWorkshop) => {
                    return new Workshop(unmodelledWorkshop.id, unmodelledWorkshop.name);
                });
            });
    }
}

export default WorkshopRepository;
