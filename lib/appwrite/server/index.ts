import { Account, Client, Databases, Storage, Users } from "node-appwrite";
import { AppwriteConfig } from "../config";
import { cookies } from "next/headers";

export async function createSessionClient() {
    const client = new Client()
        .setEndpoint(AppwriteConfig.endpoint)
        .setProject(AppwriteConfig.project);
    
    const session = (await cookies()).get('auth-session');

    if (!session || !session.value) {
        throw new Error('No Session');
    }

    client.setSession(session.value);

    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        },
        get storage() {
            return new Storage(client);
        },
    }
}

export async function createAdminClient() {
    const client = new Client()
        .setEndpoint(AppwriteConfig.endpoint)
        .setProject(AppwriteConfig.project)
        .setKey(AppwriteConfig.secretKey);
    
    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        },
        get storage() {
            return new Storage(client);
        },
        get users() {
            return new Users(client);
        }
    }
}