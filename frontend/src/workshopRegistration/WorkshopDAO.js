class WorkshopDAO {

    constructor(client, config) {
        this.client = client;
        this.config = config;
    }

    selectAll() {
        return this.client.get(this.config.workshopsUrl)
            .then((response) => {
                return response.data;
            });
    }
}

export default WorkshopDAO;
