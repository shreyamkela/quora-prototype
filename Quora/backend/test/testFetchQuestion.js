var app = require('../index');
var chai = require('chai');
chai.use(require('chai-http'));
var expect = chai.expect;

describe('Quora App', function () {
    it('GET /fetchQuestions', function (done) {
        this.timeout(100000);
        setTimeout(function () {
            chai.request(app).get('/fetchQuestions')
                .set({ 'Cookie': 'cookie_user=q@q.com;auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDEzNzQxNDgwIiwiaWF0IjoxNTU1MDk2MTEyLCJleHAiOjE1NTUxMDYxOTJ9.15ubA-zskqrmQ9s8f2JzgMrqo90nTCOgu9Dwc1Dex-k' })
                .then(async function (res) {
                    console.log("#########"+res);
                    await expect(res).to.have.status(200);
                    await expect(res.body.question.length).to.equal(2)
                    done();
                });
        }, 1000)
    })

    it('GET /fetchQuestions', function (done) {
        this.timeout(100000);
        setTimeout(function () {
            chai.request(app).get('/fetchQuestions')
                .set({ 'Cookie': 'cookie_user=q@q.com;auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDEzNzQxNDgwIiwiaWF0IjoxNTU1MDk2MTEyLCJleHAiOjE1NTUxMDYxOTJ9.15ubA-zskqrmQ9s8f2JzgMrqo90nTCOgu9Dwc1Dex-k' })
                .then(async function (res) {
                    await expect(res).to.have.status(200);
                    await expect(res.body.question.length).to.equal(4)
                    done();
                });
        }, 1000)
    })
})