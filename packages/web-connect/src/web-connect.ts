
import { Network, EnvironmentType, Context, Client } from '@verida/client-ts';
import { VaultAccount } from '@verida/account-web-vault';
import { EventEmitter } from 'events';
import { Profile } from './interface';


const TESTNET_DEFAULT_DID_SERVER = 'https://dids.testnet.verida.io:5001';

const userConfig = {
    environment: EnvironmentType.TESTNET,
    didServerUrl: TESTNET_DEFAULT_DID_SERVER,
};

const VAULT_CONTEXT_NAME = 'Verida: Vault'
export default class WebConnect extends EventEmitter {

    public context: Context | any
    public profile?: Profile | any
    public error: string[] = []
    public did?: string
    public contextName?: string
    public connected?: boolean
    public client?: Client
    /**
     *  trigger connection with verida vault using a QR Modal
     * @param contextName 
     * @param logoUrl 
     */

    public async connect(contextName: string, logoUrl?: string): Promise<void> {

        if (!contextName) {
            this.handleError('Context name is required')

            throw new Error('Context name is required')
        }

        this.contextName = contextName

        const account = new VaultAccount({
            logoUrl: logoUrl
        })

        this.context = await Network.connect({
            account: account,
            client: {
                environment: EnvironmentType.TESTNET
            },
            context: {
                name: contextName
            }
        })

        this.did = await account.did();

        await this.loadUserProfile()
        if (this.context) {
            this.connected = true
        }

    }

    async getPublicProfile(did: string): Promise<any> {
        this.client = new Client(userConfig);
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

    private async loadUserProfile(): Promise<void> {
        const client = await this.context.getClient();
        const profileInstance = await client.openPublicProfile(this.did, VAULT_CONTEXT_NAME);
        const callback = async () => {
            const data = await profileInstance.getMany();
            this.profile = {
                name: data.name,
                country: data.country,
                avatar: data?.avatar?.uri,
                did: this.did
            };
            this.emit('profileChanged', this.profile);
        };
        profileInstance.listen(callback);
        await callback();
    }


    public async getExternalProfile(did: string): Promise<Profile> {
        this.client = new Client(userConfig);
        const profileInstance = await this.client.openPublicProfile(
            did,
            VAULT_CONTEXT_NAME,
            "basicProfile"
        );

        if (!profileInstance) {
            throw new Error('Context name is required')
        }

        const accountDetails = await profileInstance.getMany({}, {});

        return accountDetails;
    }

    private handleError(error: string): void {
        this.error = [error]
    }

    public async signOut(): Promise<void> {
        await this.context.getAccount().disconnect(this.contextName);
        this.profile = {};
        this.context = {};
        this.contextName = undefined
        this.did = ''
    }


}