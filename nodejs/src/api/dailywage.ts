import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams, getQueryParams } from "../generateParams";
import _ from 'lodash';
import employee from "../modules/employee";
import { selectDB } from "../lib/database/query";

export const dailywageRequest = async (req: IncomingMessage) => {
    let queryParam = getQueryParams(req);

    const pathParam = getPathParams(req.url as string, '/employee/leave/:id');

    try {

        switch (req.method) {
            case "POST":
                if (pathParam.id !== undefined) {
                    const getModel = new employee(pathParam.id);
                    if (await getModel.getEmployee() === "Not found") {
                        return "Employee ID does not exist"
                    }else{
                        return await getModel.computeDailyWage();
                    }
                }
                else{
                    return "Employee ID need to be entered"
                }
            }
    }
    catch (err: any) {
        throw new Error(err);
    }
}