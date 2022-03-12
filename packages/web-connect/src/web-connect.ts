
import { Network, EnvironmentType, Context } from '@verida/client-ts';
import { VaultAccount } from '@verida/account-web-vault';
import { EventEmitter } from 'events';
import { Profile } from './interface';



export default class WebConnect extends EventEmitter {

    public context: Context | any
    public profile?: Profile | {}
    public error: string[] = []
    public did?: string
    public contextName?: string
    public connected?: boolean

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

    private async loadUserProfile(): Promise<void> {
        const client = await this.context.getClient();
        const profileInstance = await client.openPublicProfile(this.did, 'Verida: Vault');
        const callback = async () => {
            const data = await profileInstance.getMany();
            this.profile = {
                name: data.name,
                country: data.country,
                avatar: data?.avatar?.uri
            };
            this.emit('profileChanged', this.profile);
        };
        profileInstance.listen(callback);
        await callback();
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