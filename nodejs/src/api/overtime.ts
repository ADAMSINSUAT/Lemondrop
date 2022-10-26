import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams, getQueryParams } from "../generateParams";
import _ from 'lodash';
import employee from "../modules/employee";
import overtime from "../modules/overtime";
import { getLeaves, selectDB } from "../lib/database/query";

export const overtimeRequest = async (req: IncomingMessage) => {
    let queryParam = getQueryParams(req);

    const pathParam = getPathParams(req.url as string, '/employee/overtime/:id');

    try {

        switch (req.method) {
            case 'POST':
                const postresult = await getJSONDataFromRequestStream (req) as {empID: string, date_and_time_started: Date, date_and_time_ended: Date};
                const overtimemodel = new overtime(postresult);
                if(await overtimemodel.checkOvertime() !== "Not found"){
                    return 'Cannot have duplicate overtime request'
                }else{
                    overtimemodel.insert();
                    return 'Save successfully'
                }
            case 'PUT':
                const putresult = await getJSONDataFromRequestStream(req) as { ovtID: string, approved: string }
                const putmodel = new overtime(putresult.ovtID);
                if(await putmodel.getOvertime() !== "Not found"){
                    putmodel.data = { ...putmodel.data, ...putresult };
                    await putmodel.update();
                    return 'Successfully updated';
                }else{
                    "Overtime ID is not found";
                }
            case 'DELETE':
                //To delete overtime from Overtime table after accidentally
                //requesting it
                if(pathParam.id !== undefined){
                    const deletemodel = new overtime(pathParam.id);
                    if(await deletemodel.getOvertime()!== "Not found"){
                        await deletemodel.delete();
                        return 'Successfully deleted'
                    }else{
                        "Overtime ID is not found";
                    }
                }else{
                    //To delete overtime from Employee after accidentally
                    //confirming it
                    const deleteresult = await getJSONDataFromRequestStream(req) as {ovtID: string}
                    const deletemodel = new overtime(deleteresult.ovtID);
                    if(await deletemodel.getOvertime() !== "Not found"){
                        await deletemodel.delEmpOvertime();
                        return 'Successfully deleted'
                    }else{
                        "Overtime ID is not found";
                    }
                };
            default:
                if (pathParam.id !== undefined) {
                    const getModel = new overtime(pathParam.id);
                    if (await getModel.getOvertime() === "Not found") {
                        return "Overtime ID does not exist"
                    }else{
                        return await getModel.data;
                    }
                }
                else{
                    const listing = await selectDB("Overtime");
                    return listing;
                }
        }
    }
    catch (err: any) {
        throw new Error(err);
    }
    return 'yes'
}