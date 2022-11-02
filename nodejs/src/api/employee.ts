import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams, getQueryParams } from "../generateParams";
import _ from 'lodash';
import employee from "../modules/employee";
import { getEmployees, selectDB } from "../lib/database/query";
import { dataToItem } from "dynamo-converters";

export const employeeRequest = async (req: IncomingMessage) => {
    let queryParam = getQueryParams(req);

    const pathParam = getPathParams(req.url as string, '/account/:id');

    try {

        switch (req.method) {
            case 'POST':
                const postresult = await getJSONDataFromRequestStream(req) as { hourlySalary: number, empType: string, accID: string, compID: string}
                const postmodel = new employee(postresult);
                if(await postmodel.checkEmp() === "Already exist"){
                    return 'That account ID is already registered as an employee'
                }else{
                    await postmodel.insert();
                    return 'Save successfully'
                }
            case 'PUT':
                const putresult = await getJSONDataFromRequestStream(req) as { hourlySalary: number, empType: string }
                const putmodel = new employee(pathParam.id);
                if(await putmodel.getEmployee() !== "Not found"){
                    putmodel.data = { ...putmodel.data, ...putresult };
                    await putmodel.update();
                    return 'Successfully updated';
                }else{
                    return "Employee ID is not found"
                }
            case 'DELETE':
                const deletemodel = new employee(pathParam.id);
                if(await deletemodel.getEmployee() !== "Not found"){
                    await deletemodel.delete();
                    return 'Successfully deleted';
                }else{
                    return "Employee ID is not found"
                }
            default:
                if(pathParam.id !== undefined){
                    const getModel = new employee(pathParam.id)
                    if(await getModel.getEmployee() === "Not found"){
                        return "Employee ID does not exist!"
                    }else{
                        return await getModel.data;
                    }
                }else{
                    const listing = await getEmployees();
                    return listing;
                }
        }
    }
    catch (err: any) {
        throw new Error(err);
    }
    return 'yes'
}