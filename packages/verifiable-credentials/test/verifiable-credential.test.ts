// https://nodejs.org/api/assert.html
const assert = require('assert');
import { VerifyCredential } from '../src/interface';
import { VerifiableCredential } from '../src/'
import { config, connect, getUrlQuery } from './config';


describe('Verifiable credential', function () {
    describe('Verifiable credential tests', function () {
        this.timeout(100000);

        let verifiableCredential: VerifiableCredential

        let context;

        beforeEach(async function () {
            context = await connect(config.PRIVATE_KEY_1);

            verifiableCredential = new VerifiableCredential(context)
        });

        it('Create a verifiable  credential', async function () {
            const responseVc = await verifiableCredential.createCredential(config.SUBJECT_DID, config.CREDENTIAL_DATA);

            const uri = getUrlQuery(responseVc.publicUri)

            const vcPayload: VerifyCredential = await verifiableCredential.verifyCredential(uri, 'my-app.com')


            delete config.CREDENTIAL_DATA['didJwtVc']

            assert.deepEqual(config.SUBJECT_DID, vcPayload.verifiableCredential.vc.sub, 'Subject DID is incorrect');

            assert.deepEqual(config.CREDENTIAL_DATA, vcPayload.verifiableCredential.credentialSubject, 'credential does not match ');

        });
        it('Get Schema specification', async function () {

            const schema = await verifiableCredential.getSchemaSpecs(config.CREDENTIAL_DATA.schema)

            assert.deepEqual(config.CREDENTIAL_DATA.schema, schema.$id, 'Schema is does not match.')
        });
        it('Verify credential uri from an external account', async function () {

            const context = await connect(config.PRIVATE_KEY_2);

            const verifiableCredential = new VerifiableCredential(context)

            const vcPayload: VerifyCredential = await verifiableCredential.verifyCredential(config.VERIDA_URI, 'my-app.com');

            assert.deepEqual(config.CREDENTIAL_DATA, vcPayload.verifiableCredential.credentialSubject, 'credential does not match ')

        });
    });
});
