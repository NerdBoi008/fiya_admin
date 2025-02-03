'use server'

import {
    AttributeValue,
    DynamoDBClient,
    PutItemCommand
} from "@aws-sdk/client-dynamodb";
import {
    CognitoIdentityClient,
    Credentials,
    GetCredentialsForIdentityCommand,
    GetIdCommand
} from "@aws-sdk/client-cognito-identity";
import {
    DeleteObjectCommand,
    PutObjectCommand,
    PutObjectCommandInput,
    S3Client,
    S3ServiceException,
    waitUntilObjectNotExists
} from "@aws-sdk/client-s3";
import {
    congitoConfig,
    dynamoDbConfig,
    s3Config
} from "../config";
import sharp from "sharp";

const cognitoIdentityClient = new CognitoIdentityClient({
    region: congitoConfig.region,
});


export async function getAWSCredentails(
    idToken: string
): Promise<Credentials> {
    try {
        const getIdCommand = new GetIdCommand({
            IdentityPoolId: congitoConfig.identityPoolId,
            Logins: {
                [`cognito-idp.${congitoConfig.region}.amazonaws.com/${congitoConfig.userPoolId}`]: idToken,
            },
        });
        
        const { IdentityId } = await cognitoIdentityClient.send(getIdCommand);

        const credentialsCommand = new GetCredentialsForIdentityCommand({
            IdentityId,
            Logins: {
                [`cognito-idp.${congitoConfig.region}.amazonaws.com/${congitoConfig.userPoolId}`]: idToken,
            }
        });
        
        const credentialsResponse = await cognitoIdentityClient.send(credentialsCommand);

        if (credentialsResponse.Credentials === undefined) {
            throw new Error('No credentials found');
            
        }
        
        return credentialsResponse.Credentials;

    } catch (error) {
        console.error("Error fetching AWS credentials:", error);
        throw error;
    }
}

export const insertDataIntoDynamoDB = async (
    awsCredentials: Credentials,
    tableName: string,
    item: Record<string, AttributeValue>
) => {

    const dynamoDBClient = new DynamoDBClient({
        region: dynamoDbConfig.region,
        credentials: {
            accessKeyId: awsCredentials.AccessKeyId || '',
            secretAccessKey: awsCredentials.SecretKey || '',
            sessionToken: awsCredentials.SessionToken || '',
        },
    });
  
    const params = {
        TableName: tableName,
        Item: item,
    };
  
    try {
        const command = new PutItemCommand(params);
        const response = await dynamoDBClient.send(command);

        return response;
    } catch (error) {
        console.error("Error inserting item into DynamoDB:", error);
        throw error;
    }
};

export async function insertIntoBucket(
    awsCredentials: Credentials,
    bucketName: string,
    key: string,
    file: File,
    publicAvailability: boolean = true,
): Promise<string | null> {
    
    const s3Client = new S3Client({
        region: s3Config.region,
        credentials: {
            accessKeyId: awsCredentials.AccessKeyId || '',
            secretAccessKey: awsCredentials.SecretKey || '',
            sessionToken: awsCredentials.SessionToken || '',
        },
    })

    const imageBuffer = Buffer.from(await file.arrayBuffer());

    const miniImage = await sharp(imageBuffer)        
        .toFormat('webp', {
            quality: 80,
        })
        .toBuffer();

    const command: PutObjectCommandInput = {
        Bucket: bucketName,
        Key: key,
        Body: miniImage,
        ContentType: 'image/webp',
    };

    if (publicAvailability) {
        command.ACL = 'public-read';
    }
    
    try {

        await s3Client.send(new PutObjectCommand(command));

        return `https://${bucketName}.s3.${s3Config.region}.amazonaws.com/${encodeURIComponent(key)}`;
        
    } catch (error) {
        if (error instanceof S3ServiceException && error.name === "EntityTooLarge") {
            console.error(
              `Error from S3 while uploading object to ${bucketName}. \
                The object was too large. To upload objects larger than 5GB, use the S3 console (160GB max) \
                or the multipart upload API (5TB max).`,
            );
        } else if (error instanceof S3ServiceException) {
            console.error(
                `Error from S3 while uploading object to ${bucketName}.  ${error.name}: ${error.message}`,
            );
        } else {
            throw error;
        }
    }

    return null;
}

export async function deleteFromBucket(
    awsCredentials: Credentials,
    bucketName: string,
    key: string,
): Promise<boolean> {
    const s3Client = new S3Client({
        region: s3Config.region,
        credentials: {
            accessKeyId: awsCredentials.AccessKeyId || '',
            secretAccessKey: awsCredentials.SecretKey || '',
            sessionToken: awsCredentials.SessionToken || '',
        },
    });

    try {
        const deleteObj = await s3Client.send(new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
        }));

        const objRemoved = await waitUntilObjectNotExists(
            { client: s3Client, maxWaitTime: 10000 },
            { Bucket: bucketName, Key: key }
        );

        if (deleteObj && objRemoved) {
            return true;
        }

    } catch (caught) {
        if (caught instanceof S3ServiceException && caught.name === "NoSuchBucket") {
            console.error(`Error from S3 while deleting object from ${bucketName}. The bucket doesn't exist.`,);
        } else if (caught instanceof S3ServiceException) {
            console.error(`Error from S3 while deleting object from ${bucketName}.  ${caught.name}: ${caught.message}`,);
        } else {
            throw caught;
        }
    }

    return false;
}
