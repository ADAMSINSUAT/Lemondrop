import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams, getQueryParams } from "../generateParams";
import _ from 'lodash';
import employer from "../modules/employer";
import { getEmployees, selectDB } from "../lib/database/query";
import { dataToItem } from "dynamo-converters";

export const employerRequest = async (req: IncomingMessage) => {
    let queryParam = getQueryParams(req);

    const pathParam = getPathParams(req.url as string, '/employer/:id');

    try {

        switch (req.method) {
            case 'POST':
                console.log(req.method)
                const postresult = await getJSONDataFromRequestStream(req) as { accID: string, compID: string}
                const postmodel = new employer(postresult);
                if(await postmodel.checkEmp() === "Already exist"){
                    return 'That account ID is already registered as an employer'
                }else{
                    await postmodel.insert();
                    return 'Save successfully'
                }
            case 'DELETE':
                const deletemodel = new employer(pathParam.id);
                if(await deletemodel.getEmployer() !== "Not found"){
                    await deletemodel.delete();
                    return 'Successfully deleted';
                }else{
                    return "Employer ID is not found"
                }
            default:
                if(pathParam.id !== undefined){
                    const getModel = new employer(pathParam.id)
                    if(await getModel.getEmployer() === "Not found"){
                        return "Employer ID does not exist!"
                    }else{
                        return await getModel.data;
                    }
                }else{
                    const listing = await selectDB("Employer");
                    return listing;
                }
        }
    }
    catch (err: any) {
        throw new Error(err);
    }
    return 'yes'
}