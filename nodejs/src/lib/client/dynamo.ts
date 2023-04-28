// Create service client module using ES6 syntax.
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// Set the AWS Region.
const REGION = "ap-southeast-1"; //e.g. "us-east-1"
// Create an Amazon DynamoDB service client object.
const client = new DynamoDBClient({ region: REGION, endpoint:"http://localhost:8000" });
export { client };