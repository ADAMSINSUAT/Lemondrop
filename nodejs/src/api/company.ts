import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams, getQueryParams } from "../generateParams";
import _ from 'lodash';
import company from "../modules/company";
import { selectDB } from "../lib/database/query";

// const sampleCompanyData: object|number = [
//     {
//         "id": 220201,
//         "name": "Lemondrop",
//         "allowed_leaves": 2,
//         "overtime_limit": 10,
//         "allowed absences": 2,
//         "employee_ID": [],
//         "employer ID": 200010
//     },
//     {
//         "id": 220202,
//         "name": "Workbean",
//         "allowed_leaves": 2,
//         "overtime_limit": 10,
//         "allowed absences": 2,
//         "employee_ID": [],
//         "employer ID": 200011
//     },
// ]
export const companyRequest = async (req: IncomingMessage) => {
    let queryParam = getQueryParams(req);

    //let result = await getJSONDataFromRequestStream(req);

    // const getCompanyParam = getPathParams(req.url as string, '/company/:id');
    // const postCompanyParam = getPathParams(req.url as string, '/company/:id');
    // const putCompanyParam = getPathParams(req.url as string, '/company/:id');

    const pathParam = getPathParams(req.url as string, '/company/:id');

    try {

        switch (req.method) {
            case 'POST':
                const postresult = await getJSONDataFromRequestStream(req) as { compName: string, allowOT: number, allowLeaves: number }
                const postmodel = new company(postresult);
                if(await postmodel.getName(postresult.compName) !== "Not found"){
                    return 'A company with the same name already exists!'
                }
                else{
                    await postmodel.insert();
                    return 'Successfully saved';
                }
            case 'PUT':
                const putresult = await getJSONDataFromRequestStream(req) as { compName:string, allowOT: number, allowLeaves: number }
                const putmodel = new company(pathParam.id);
                if(await putmodel.getCompany()!== "Not found"){
                    putmodel.data = { ...putmodel.data, ...putresult };
                    await putmodel.update();
                    return 'Successfully updated';
                }else{
                    return "Company ID is not found"
                }
            case 'DELETE':
                if(pathParam.id !== undefined){
                    const deletemodel = new company(pathParam.id);
                    if(await deletemodel.getCompany() !== "Not found"){
                        await deletemodel.delete();
                        return 'Successfully deleted';
                    }else{
                        return "Company ID is not found"
                    }
                }else{
                    return "Company ID needs to be supplied"
                }
            // if (!pathParam?.id) {
            //     return 'Could not find company id'
            // }
            // else {
            //     console.log(result);
            //     return 'Company info has been successfully updated';
            // }
            // case 'GET':
            //     const listing = await selectDB('Company');
            //     console.log(listing)
            //     return listing;
            default:
                if(pathParam.id !== undefined){
                    const getModel = new company(pathParam.id);
                    if(await getModel.getCompany() === "Not found"){
                        return "Company ID does not exist"
                    }else{
                        return await getModel.data;
                    }
                }else{
                    const listing = await selectDB('Company');
                    return listing;
                }
                //break;
        }
    }
    catch (err: any) {
        throw new Error(err);
    }
    return 'yes'
}