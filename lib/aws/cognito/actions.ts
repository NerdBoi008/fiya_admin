'use server'

import {
    CognitoIdentityProviderClient,
    GetUserCommand,
    GetUserCommandInput,
    InitiateAuthCommand,
    InitiateAuthCommandInput,
    SignUpCommand,
    SignUpCommandInput
} from '@aws-sdk/client-cognito-identity-provider';
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { congitoConfig } from '../config';
import { cookies } from 'next/headers';
import { User } from '@/types';

const cognitoClient = new CognitoIdentityProviderClient({
    region: congitoConfig.region,
});

export async function getUserCognito(userId: string): Promise<User | null> { 

    const session = (await cookies()).get('aws-auth-session');

    if (!session) {
        return null;
    }
    
    const params: GetUserCommandInput = {
        AccessToken: session.value,
    }

    try {

        const command = new GetUserCommand(params);
        const user = await cognitoClient.send(command);

        if (!user) {
            return null
        }

        console.log({
            file: 'lib\aws\config.ts',
            output: user.UserAttributes,
        });
        

        return {
            id: '',
            firstName: '',
            lastName: '',
            email: '',
            cart: [],
            phone: '',
            receiveUpdates: false,
            profileImgSrc: '',
            address: '',
        }
    } catch (error) {
        console.error('Failed fetching user',error);
        throw error;
    }

}

export async function singInWithCognito(
    email: string,
    password: string,
    rememberMe: boolean
): Promise<boolean> {

    const params: InitiateAuthCommandInput = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: congitoConfig.clientId,
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
        }
    };

    try {

        const command = new InitiateAuthCommand(params);       

        const { AuthenticationResult } = await cognitoClient.send(command);

        if (AuthenticationResult) {
            const authCookie = await cookies();

            if (AuthenticationResult.IdToken) {
                authCookie.set(
                    'aws-auth-session',
                    AuthenticationResult.IdToken,
                    {
                        path: '/',
                        httpOnly: true,
                        sameSite: 'strict',
                        secure: true,
                        expires: rememberMe ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) : undefined, // 5 days or session cookie
                    }
                );
            }
            
        }

        return true;
        
    } catch (error) {
        console.error('[-] Error Signin in',error);
        throw error;
    }
}

export async function singUpWithCognito(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone: string,
    receiveUpdates: boolean,
    rememberMe: boolean,
    address: string,
): Promise<boolean> {

    console.log({
        file: 'lib\aws\cognito\actions.ts',
        output: phone,
    });
    

    const params: SignUpCommandInput = {
        ClientId: congitoConfig.clientId,
        Username: email,
        Password: password,
        UserAttributes: [
            {
                Name: 'email',
                Value: email,
            },
            {
                Name: 'phone_number',
                Value: `+${phone}`,
            },
            {
                Name: 'name',
                Value: `${firstName} ${lastName}`,
            },
            {
                Name: 'profile',
                Value: receiveUpdates.toString(),
            },
        ],
    };

    try {
        const command = new SignUpCommand(params);

        const user = await cognitoClient.send(command);

        if (user) {
            await singInWithCognito(email, password, rememberMe);
        }

        return false;
        
    } catch (error) {
        console.error('[-] Error creating user.', error);
        throw error;
    }
}

export async function getGuestUserCredentials() {
    return fromCognitoIdentityPool({
        clientConfig: {
            region: congitoConfig.region,
        },
        identityPoolId: congitoConfig.identityPoolId,
    })
}