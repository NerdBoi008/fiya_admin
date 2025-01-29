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
            TableName: dynamoDbConfig.productsTable,
        })

        const response = await dynamoDBClientApi.send(command);

        const products = response.Items ? response.Items.map((productDoc) => {
            
            return {
                productId: productDoc.productId.S || '',
                imgSrc: productDoc.imgSrc.S || '',
                otherImgSrcSet: productDoc.otherImgSrcSet.L?.map((imgSrc) => imgSrc.S || '') || [],
                name: productDoc.name.S || '',
                form: productDoc.form.S || '',
                weight: productDoc.weight.N ? parseFloat(productDoc.weight.N) : 0,
                actualPrice: productDoc.actualPrice.N ? parseFloat(productDoc.actualPrice.N) : 0,
                offerPrice: productDoc.offerPrice.N ? parseFloat(productDoc.offerPrice.N) : 0,
                rating: productDoc.rating.N ? parseFloat(productDoc.rating.N) : 0,
                ingredients: productDoc.ingredients.L?.map((ingredient) => ingredient.S || '') || [],
                description: productDoc.description.S || '',
                highlights: productDoc.highlights.L?.map((highlight) => highlight.S || '') || [],
            }
        }) : [];
        
        const data = JSON.stringify(products);
        
        return new Response(data, { status: 200, headers: { 'Content-Type': 'application/json' } });
        
    } catch (error) {
        console.error("Error fetching categories:", error);
        return Response.json({ error: error }, { status: 500 });
    }
}