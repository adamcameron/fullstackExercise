const axios = require('axios');

class WorkshopDAO {

    selectAll() {
        return axios.get("http://fullstackexercise.backend/workshops/")
            .then((response) => {
                return response.data;
            });
    }
}

export default WorkshopDAO;
