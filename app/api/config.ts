import { getGuestUserCredentials } from "@/lib/aws/cognito/actions";
import { dynamoDbConfig } from "@/lib/aws/config";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const credentials = await getGuestUserCredentials();

export const dynamoDBClientApi = new DynamoDBClient({
    region: dynamoDbConfig.region,
    credentials: credentials,
});