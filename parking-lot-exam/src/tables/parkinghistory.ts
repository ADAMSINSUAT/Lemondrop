// Import required AWS SDK clients and commands for Node.js
import { CreateTableCommand, DeleteTableCommand } from "@aws-sdk/client-dynamodb";
import { client } from "../lib/client/dynamo";

// Set the parameters
export const params = {
  AttributeDefinitions: [
    {
      AttributeName: "historyID", //ATTRIBUTE_NAME_2
      AttributeType: "S", //ATTRIBUTE_TYPE
    },
  ],
  KeySchema: [
    {
      AttributeName: "historyID", //ATTRIBUTE_NAME_1
      KeyType: "HASH",
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  TableName: "ParkingHistory", //TABLE_NAME
  StreamSpecification: {
    StreamEnabled: false,
  },
};

export const run = async () => {
  try {
    const data = await client.send(new CreateTableCommand(params));
    // const data = await client.send(new DeleteTableCommand(params));
    console.log("Table Created", data);
    return data;
  } catch (err) {
    console.log("Error", err);
  }
};
run();