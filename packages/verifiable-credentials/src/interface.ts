export interface IssuedVC {
    item: string,
    result: string,
    did: string,
    veridaUri: string,
    publicUri: string
}


export interface VerifyCredential {
    publicUri: string,
    schemaSpec: any,
    issuerProfile: any,
    subjectProfile: any,
    verifiableCredential: any,
}



