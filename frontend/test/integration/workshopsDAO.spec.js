import {expect} from "chai";
import Config from "../../src/workshopRegistration/Config";
import WorkshopsDAO from "../../src/workshopRegistration/WorkshopsDAO";
const client = require('axios').default;

describe("Integration tests of WorkshopsDAO", () => {

    it("returns the correct records from the API", async () => {
        let directCallObjects = await client.get(Config.workshopsUrl);

        let daoCallObjects = await new WorkshopsDAO(client, Config).selectAll();

        expect(daoCallObjects).to.eql(directCallObjects.data);
    });
});
