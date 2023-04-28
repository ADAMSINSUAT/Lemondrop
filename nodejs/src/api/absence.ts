import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams, getQueryParams } from "../generateParams";
import _ from 'lodash';
import employee from "../modules/employee";
import absence from "../modules/absence";
import { selectDB } from "../lib/database/query";

export const absenceRequest = async (req: IncomingMessage) => {
    let queryParam = getQueryParams(req);

    const pathParam = getPathParams(req.url as string, '/employee/leave/:id');

    try {

        switch (req.method) {
            case 'POST':
                const postresult = await getJSONDataFromRequestStream (req) as {empID: string, date_started: Date, date_ended: Date, reason: string};
                const absencemodel = new absence(postresult);
                if(await absencemodel.checkAbsence() !== "Not found"){
                    return 'Cannot have duplicate absence request'
                }else{
                    absencemodel.insert();
                    return 'Save successfully'
                }
            case 'DELETE':
                //To delete absence from Absence table after accidentally
                //requesting it
                if(pathParam.id !== undefined){
                    const deletemodel = new absence(pathParam.id);
                    if(await deletemodel.getAbsence() !== "Not found"){
                        await deletemodel.delete();
                    }else{
                        return "Absence ID is not found"
                    }
                }
                else{
                    //To delete absence from Employee after accidentally
                    //confirming it
                    const deleteresult = await getJSONDataFromRequestStream(req) as {absID: string}
                    const deletemodel = new absence(deleteresult.absID);
                    if(await deletemodel.getAbsence() !== "Not found"){
                        await deletemodel.delEmpAbsence();
                        return 'Successfully deleted';
                    }else{
                        return "Absence ID is not found"
                    }
                }
            default:
                if (pathParam.id !== undefined) {
                    const getModel = new absence(pathParam.id);
                    if (await getModel.getAbsence() === "Not found") {
                        return "Absence ID does not exist"
                    }else{
                        return await getModel.data;
                    }
                }
                else{
                    const listing = await selectDB("Absences");
                    return listing;
                }
            }
    }
    catch (err: any) {
        throw new Error(err);
    }
    return 'yes'
}