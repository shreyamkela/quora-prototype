var app = require('../index');
var chai = require('chai');
var assert = chai.assert;
chai.use(require('chai-http'));
var expect = chai.expect;
var agent = chai.request.agent(app);

describe('Quora App', function () {
    it('POST /login', function (done) {
        setTimeout(function(){
            agent.post('/login')
                .send({ email_id: 'user1.last1@gmail.com', password: 'abcd' })
                .then(async function (res) {
                    await expect(res).to.have.status(200);
                    await expect(res).to.have.cookie('cookie_user');
                    await expect(res).to.have.cookie('auth_token');
                    done();
                });
        },1000)
    })
})