const chakram = require('chakram');
const expect = chakram.expect;

const apiUrl = "http://thehub.app:8001/api";
const testData = {
    login: {
        username: "pavel@webiny.com",
        password: "12345678"
    }
};

const options = (user) => {
    return {
        headers: {
            'X-Webiny-Authorization': user.authToken || null
        }
    };
};

describe("Webiny Core API", () => {
    let user = null;

    it("Should return Postman collections JSON", () => {
        return chakram.get(`${apiUrl}/discover/webiny`).then(response => {
            expect(response).to.have.status(200);
            const data = response.body;
            expect(data).to.be.a('object');
            expect(data).to.have.all.keys('id', 'name', 'description', 'order', 'timestamp', 'owner', 'requests', 'folders');
            expect(data.requests.length).to.be.above(0);
        });
    });

    it("Should return apps meta data", () => {
        return chakram.get(`${apiUrl}/services/webiny/apps`).then(response => {
            expect(response).to.have.status(200);
        });
    });

    it("Should return backend apps meta data", () => {
        return chakram.get(`${apiUrl}/services/webiny/apps/backend`).then(response => {
            expect(response).to.have.status(200);
        });
    });

    it("Should allow user to log in", () => {
        return chakram.post(`${apiUrl}/entities/webiny/users/login`, testData.login).then(response => {
            expect(response).to.have.status(200);

            user = response.body.data;
            expect(user).to.have.all.keys('authToken', 'user');
        });
    });

    it("Should allow user to retrieve his profile data", () => {
        return chakram.get(`${apiUrl}/entities/webiny/users/me`, options(user)).then(response => {
            expect(response).to.have.status(200);

            const data = response.body.data;
            expect(data).to.be.a('object');
            expect(data).to.have.property('id');
            expect(data).to.have.property('email');
        });
    });
});