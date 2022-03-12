// https://nodejs.org/api/assert.html
const assert = require('assert');
import { config, connect } from './config';


describe('Connect Account', function () {
    describe.skip('Connect Account with Verida Vault', function () {
        this.timeout(100000);
        let context;

        beforeEach(async function () {
            await connect(config.PRIVATE_KEY_1);
        });

        it('Issue an encrypted credential', async function () { });
    });
});
