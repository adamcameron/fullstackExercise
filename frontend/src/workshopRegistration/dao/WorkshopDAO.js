const axios = require('axios');

class WorkshopDAO {

    selectAll() {
        return axios.get("http://fullstackexercise.backend/workshops/")
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log(error);
                return Promise.resolve([]);
            });
    }
}

export default WorkshopDAO;
