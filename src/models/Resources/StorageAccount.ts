import Resource from "../Resource";

export class StorageAccount extends Resource {
    static resourceType: string = "Microsoft.Storage/storageAccounts";
    kind: string;
    properties: StorageAccountProperties;

    static allowedKinds:string[] = ["Storage", "StorageV2", "BlobStorage", "FileStorage", "BlockBlobStorage"];

    constructor() {
        super();

        this.type = StorageAccount.resourceType;
        this.apiVersion = "2019-04-01";
    }

    getResourceId(): string {
        return this.getResourceIdString(this.name);
    }

    static getDefault(name: string): StorageAccount {
        let account = new StorageAccount();

        account.name = name;
        account.kind = "StorageV2";
        account.properties = new StorageAccountProperties();
        account.properties.accessTier = "Cool";
        account.properties.supportsHttpsTrafficOnly = true;
        account.properties.encryption = new StorageAccountEncryption();
        account.properties.encryption.services = new StorageAccountEncryptionServices();
        account.properties.encryption.services.blob = new StorageAccountEncryptionService();
        account.properties.encryption.services.blob.enabled = true;
        account.properties.encryption.services.file = new StorageAccountEncryptionService();
        account.properties.encryption.services.file.enabled = true;

        return account;
    }
}

export class StorageAccountProperties {
    supportsHttpsTrafficOnly: boolean | string;
    encryption: StorageAccountEncryption;
    accessTier: string;

    static allowedAccessTiers: string[] = ["Hot", "Cool"];
}

export class StorageAccountEncryption {
    services: StorageAccountEncryptionServices;
}

export class StorageAccountEncryptionServices {
    file: StorageAccountEncryptionService;
    blob: StorageAccountEncryptionService;
}

export class StorageAccountEncryptionService {
    enabled: boolean | string;
}

export default StorageAccount;