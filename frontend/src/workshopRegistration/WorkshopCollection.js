class WorkshopCollection extends Array {

    constructor(repository) {
        super();
        this.repository = repository;
    }

    async loadAll() {
        let workshops = await this.repository.selectAll();

        this.length = 0;
        this.push(...workshops);
    }
}

module.exports = WorkshopCollection;
