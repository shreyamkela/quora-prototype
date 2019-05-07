var app = require('../index');
var chai = require('chai');
chai.use(require('chai-http'));
var expect = chai.expect;

describe('Quora App', function () {
    it('GET /fetchAllTopics', function (done) {
        this.timeout(10000);
        setTimeout(async () => {
            let response = await chai.request(app).get('/fetchAllTopics')
            expect(response).to.have.status(200);
            expect(response.body.length).to.equal(13);
            done();
        }, 1000)
    })

})

describe('Quora App', function () {
    it('GET /searchTopics', function (done) {
        this.timeout(10000);
        setTimeout(async () => {
            let response = await chai.request(app).get('/searchTopics').query(["*"])
            expect(response).to.have.status(200);
            expect(response.body.length).to.equal(13);
            done();
        }, 1000)
    })

})

