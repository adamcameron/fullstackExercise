import Workshop from "../model/Workshop";

class WorkshopRepository {

    constructor(dao) {
        this.dao = dao;
    }

    selectAll() {
        return this.dao.selectAll()
            .then((unmodelledWorkshops) => {
                let modelled = unmodelledWorkshops.map((unmodelledWorkshop) => {
                    return new Workshop(unmodelledWorkshop.id, unmodelledWorkshop.name);
                });
                return modelled;
            });
    }
}

export default WorkshopRepository;
