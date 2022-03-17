import { AutoAccount } from '@verida/account-node';
import { Context, EnvironmentType, Network } from '@verida/client-ts';

export const config = {
    PRIVATE_KEY_1: "0x5dd84b6d500bcbc018cbc71b0407d694095755d91af42bd3442b2dfc96b1e0af",
    PRIVATE_KEY_2: "0x80d3b996ec98a91536efdffbae40f5eaaf117765a587483c69195c9460165c37",
    CONTEXT_NAME: "Verida: Web Connect",
    SUBJECT_DID: 'did:vda:0x7566c5745287a5d12bF77aA19D14De4C5ED38e04',
    TESTNET_DEFAULT_SERVER: "https://db.testnet.verida.io:5002/",
    VERIDA_URI: 'dmVyaWRhOi8vZGlkOnZkYToweEIzNzI5OTgyQTI1ODU1NDRGRDcyYzk5Q0YzNzczYTljNmJhQkQ1NWMvR3BORGVQdldVNFJWcllWenA2WmtBTFpEbjMvY3JlZGVudGlhbF9wdWJsaWNfZW5jcnlwdGVkL2RiZTlhZGUwLWE1YWUtMTFlYy05ZmE3LTViYmI1ZTJhYjk4Mz9rZXk9ODNmODJjMmQzMGU2NjFmY2VmOTJjMWFkMTIxZmRmNjMzNGUyN2QzMzFkMmIwY2JkY2JkMDc5Y2Q3OTQ4NTI1NQ==',
    CREDENTIAL_DATA: {
        firstName: "Mike",
        healthType: "Dentist",
        lastName: "Chiboy",
        name: "Your Dentist Credential",
        regExpDate: "2022-03-31",
        regNumber: "12131",
        schema: "https://verida.github.io/demo-credential-issuer/v0.1.0/schema.json",
        summary: "Credential issued at Tue Mar 01 2022",
        testTimestamp: "2022-03-01T10:30:05.435Z"
    }
}


export const connect = async (privateKey: string): Promise<Context> => {

    const context = await Network.connect({
        context: {
            name: config.CONTEXT_NAME,
        },
        client: {
            environment: EnvironmentType.TESTNET,
        },
        account: new AutoAccount(
            {
                defaultDatabaseServer: {
                    type: 'VeridaDatabase',
                    endpointUri: config.TESTNET_DEFAULT_SERVER,
                },
                defaultMessageServer: {
                    type: 'VeridaMessage',
                    endpointUri: config.TESTNET_DEFAULT_SERVER,
                },
            },
            {
                privateKey: privateKey,
                environment: EnvironmentType.TESTNET,
            }
        ),
    });
    return context;
};


export const getUrlQuery = (url: string): string => {
    const paramsString = url.split("?")[1];
    const searchParams = new URLSearchParams(paramsString);
    const URI = searchParams.get("uri");
    return URI as string;
};