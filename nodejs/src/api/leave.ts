import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams, getQueryParams } from "../generateParams";
import _ from 'lodash';
import employee from "../modules/employee";
import leave from "../modules/leave";
import { getLeaves, selectDB } from "../lib/database/query";

export const leaveRequest = async (req: IncomingMessage) => {
    let queryParam = getQueryParams(req);

    const pathParam = getPathParams(req.url as string, '/employee/leave/:id');

    try {

        switch (req.method) {
            case 'POST':
                const postresult = await getJSONDataFromRequestStream (req) as {empID: string, date_started: Date, date_ended: Date, reason: string};
                const leavemodel = new leave(postresult);
                if(await leavemodel.checkLeave() !== "Not found"){
                    return 'Cannot have duplicate leave request'
                }else{
                    leavemodel.insert();
                    return 'Save successfully'
                }
            case 'PUT':
                const putresult = await getJSONDataFromRequestStream(req) as { lvID: string, approved: string }
                const putmodel = new leave(putresult.lvID);
                if(await putmodel.getLeave() !== "Not found"){
                    putmodel.data = { ...putmodel.data, ...putresult };
                    await putmodel.update();
                    return 'Successfully updated';
                }else{
                    return "Leave ID is not found"
                }
            case 'DELETE':
                //To delete leave from Leave table after accidentally
                //requesting it
                if(pathParam.id !== undefined){
                    const deletemodel = new leave(pathParam.id);
                    if(await deletemodel.getLeave()!== "Not found"){
                        await deletemodel.delete();
                        return 'Successfully deleted';
                    }else{
                        return "Leave ID is not found"
                    }
                }
                else{
                    //To delete leave from Employee after accidentally
                    //confirming it
                    const deleteresult = await getJSONDataFromRequestStream(req) as {lvID: string}
                    const deletemodel = new leave(deleteresult.lvID);
                    if(await deletemodel.getLeave()!== "Not found"){
                        await deletemodel.delEmpLeave();
                        return 'Successfully deleted';
                    }else{
                        return "Leave ID is not found"
                    }
                }
            default:
                if (pathParam.id !== undefined) {
                    const getModel = new leave(pathParam.id);
                    if (await getModel.getLeave() === "Not found") {
                        return "Leave ID does not exist"
                    }else{
                        return await getModel.data;
                    }
                }
                else{
                    const listing = await selectDB("Leaves");
                    return listing;
                }
            }
    }
    catch (err: any) {
        throw new Error(err);
    }
    return 'yes'
}