import { dynamoDbConfig } from "@/lib/aws/config";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { dynamoDBClientApi } from "../config";


export async function GET() {
    try {

        // const credentials = await getGuestUserCredentials();

        // const dynamoDBClient = new DynamoDBClient({
        //     region: dynamoDbConfig.region,
        //     credentials: credentials,
        // });



        const command = new ScanCommand({
            TableName: dynamoDbConfig.categoriesTable,
        })

        const response = await dynamoDBClientApi.send(command);

        const categories = response.Items ? response.Items.map((categoryDoc) => {
            
            return {
                id: categoryDoc.id.S || '',
                categoryName: categoryDoc.categoryName.S || '',
                imgSrc: categoryDoc.imgSrc.S || '',
                productsId: categoryDoc.productsId.L?.map((product) => product.S || '') || [],
            }
        }) : [];
        
        const data = JSON.stringify(categories);
        
        return new Response(data, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return Response.json({ error: error }, { status: 500 });
    }
    
}