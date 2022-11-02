import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams, getQueryParams } from "../generateParams";
import _ from 'lodash';
import employee from "../modules/employee";
import { selectDB } from "../lib/database/query";
import company from "../modules/company";

export const monthlyWageRequest = async (req: IncomingMessage) => {
    let queryParam = getQueryParams(req);

    const pathParam = getPathParams(req.url as string, '/employee/monthlywage/:id');

    try {

        switch (req.method) {
            case "POST":
                if (pathParam.id !== undefined) {
                    const getModel = new employee(pathParam.id);
                    const getMonth = await getJSONDataFromRequestStream(req) as {month: string};
                    if (await getModel.getEmployee() === "Not found") {
                        return "Employee ID does not exist"
                    } else {
                        if (getMonth.month === "" || getMonth.month === undefined) {
                            return "Error: no month supplied"
                        } else {
                            const compModel = new company(await getModel.data.compID);
                            if(await compModel.getCompany()!=="Not found"){
                                return await getModel.computeMonthlySalary(getMonth.month, compModel.data.allowLeaves, compModel.data.allowOT);
                            }else{
                                return "Company no longer exists!"
                            }
                        }
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