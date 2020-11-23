const chai = require('chai')
const sinonChai = require('sinon-chai')
const chaiString = require('chai-string')

chai.use(sinonChai)
chai.use(chaiString)

global.expect = chai.expect
global.should = chai.should
