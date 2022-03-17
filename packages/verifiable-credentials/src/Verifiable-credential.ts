import { Credentials, SharingCredential } from '@verida/verifiable-credentials'
import { Context, Client, EnvironmentType, Utils } from '@verida/client-ts';
import { IssuedVC, VerifyCredential } from './interface';
import Buffer from 'buffer';

const userConfig = {
    environment: EnvironmentType.TESTNET,
    didServerUrl: "https://dids.testnet.verida.io:5001",
};

export default class VerifiableCredential {

    private credential: any
    private issueCredential: any
    private client: Client
    public profile: any
    public context: Context

    constructor(context: Context) {

        this.context = context;

        this.credential = new Credentials(context);

        this.issueCredential = new SharingCredential(context)

        this.client = new Client(userConfig);
    }

    async createCredential(subjectDiD: string, data: any): Promise<IssuedVC> {
        const item = await this.credential.createCredentialJWT(subjectDiD, data);

        const credentialURI = await this.issueCredential.issueEncryptedPresentation(item);

        return credentialURI
    }


    async getProfile(did: string): Promise<any> {
        const profileInstance = await this.client.openPublicProfile(
            did,
            "Verida: Vault",
            "basicProfile"
        );

        if (profileInstance) {
            this.profile = await profileInstance.getMany({}, {});
            if (this.profile) {
                this.profile.did = did;
            }
        }
        return this.profile;
    }



    public async getSchemaSpecs(schema: string): Promise<any> {
        const schemas = await this.context.getClient().getSchema(schema);

        const json = await schemas.getSpecification();

        return json;
    }



    async verifyCredential(uri: string, domainName: string): Promise<VerifyCredential> {

        // Fetch and decode the presentation

        const decodedURI = Buffer.Buffer.from(uri, "base64").toString("utf8");

        const jwt = await Utils.fetchVeridaUri(decodedURI, this.context);

        const decodedPresentation = await this.credential.verifyPresentation(jwt);

        // Retrieve the verifiable credential within the presentation

        const verifiableCredential =
            decodedPresentation.verifiablePresentation.verifiableCredential[0];

        const issuerProfile = await this.getProfile(verifiableCredential.vc.sub);

        const subjectProfile = await this.getProfile(verifiableCredential.vc.sub);

        const schemaSpec = await this.getSchemaSpecs(
            verifiableCredential.credentialSubject.schema
        );

        const publicUri = `${domainName
            }/credential?uri=${uri}`;

        return {
            publicUri,
            schemaSpec,
            issuerProfile,
            subjectProfile,
            verifiableCredential,
        };
    }
}