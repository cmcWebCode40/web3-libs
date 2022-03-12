import { AutoAccount } from '@verida/account-node';
import { Context, EnvironmentType, Network } from '@verida/client-ts';

export const config = {
    PRIVATE_KEY_1: "0x5dd84b6d500bcbc018cbc71b0407d694095755d91af42bd3442b2dfc96b1e0af",
    PRIVATE_KEY_2: "0x80d3b996ec98a91536efdffbae40f5eaaf117765a587483c69195c9460165c37",
    CONTEXT_NAME: "Verida: Web Connect",
    TESTNET_DEFAULT_SERVER: "https://db.testnet.verida.io:5002/",
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


