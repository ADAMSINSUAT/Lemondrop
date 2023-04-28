import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams, getQueryParams } from "../generateParams";
import _ from 'lodash';
import account from "../modules/account";
import admin from "../modules/admin";
import { selectDB } from "../lib/database/query";

export const adminRequest = async (req: IncomingMessage) => {
    let queryParam = getQueryParams(req);

    const pathParam = getPathParams(req.url as string, '/account/:id');

    try {

        switch (req.method) {
            case 'DELETE':
                if(pathParam.id !== undefined){
                    const deletemodel = new admin(pathParam.id);
                    if(await deletemodel.get() !== "No Admin"){
                        await deletemodel.delete();
                        return 'Successfully deleted';
                    }else{
                        return "No Admin exists!"
                    }
                }else{
                    return "Admin ID needs to be supplied"
                }
            default:
                const listing = await selectDB('Admin');
                return listing;
                //break;
        }
    }
    catch (err: any) {
        throw new Error(err);
    }
    return 'yes'
}