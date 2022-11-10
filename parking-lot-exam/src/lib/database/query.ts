import { ExecuteStatementCommand } from "@aws-sdk/client-dynamodb";
import { map, values, forEach } from "lodash";
import { document } from "./document";
import { itemToData, dataToItem } from "dynamo-converters";

export const execute = async (params :any) =>{
  try {
    const valuesResponse = await document.send(new ExecuteStatementCommand(params));
    return valuesResponse;
  } catch (err) {
    console.error(err);
    throw new Error("Unable to save");
  }
}

export const insertDB = async (tableName: string, statement: string, parameters: any) => {
  const params = {
    Statement: `INSERT INTO ${tableName} VALUE ${statement}`,
    //Parameters: parameters,
    Parameters: values(dataToItem(parameters))
  };
  await execute(params)
  return "Successfully Saved"
};

export const selectDB = async (tableName: string, statement: string = '') => {
  const query = statement.length > 0 ? `SELECT * FROM  ${tableName} WHERE ${statement}` : `SELECT * FROM  ${tableName}`
  const params = {
    Statement: query,
  };
  const resultList =  await execute(params)
  return map(resultList.Items, (obj) => itemToData(obj))
}
export const updateDB = async (tableName: string, statement: string, parameters: any, where: string) => {
  const params = {
    Statement: `UPDATE ${tableName} SET ${statement} WHERE ${where}`,
    Parameters: values(dataToItem(parameters))
  };
  await execute(params)
  return "Successfully Updated"
};

export const deleteDB = async (tableName: string, where: string) => {
  const params = {
    Statement: `DELETE FROM ${tableName} WHERE ${where}`,
  };
  await execute(params)
  return "Successfully Deleted"
};

export const deleteEnDB = async (tableName: string) => {
  const params = {
    Statement: `DELETE FROM ${tableName}`,
  };
  await execute(params)
  return "Successfully Deleted"
};