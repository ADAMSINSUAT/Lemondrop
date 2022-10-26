import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams, getQueryParams } from "../generateParams";
import _ from 'lodash';
import account from "../modules/account";
import admin from "../modules/admin";
import { selectDB } from "../lib/database/query";

export const accountRequest = async (req: IncomingMessage) => {
    let queryParam = getQueryParams(req);

    const pathParam = getPathParams(req.url as string, '/account/:id');

    try {

        switch (req.method) {
            case 'POST':
                const postresult = await getJSONDataFromRequestStream(req) as { fname: string, lname: string, email: string, password: string, role: string}
                console.log(postresult)
                const postmodel = new account(postresult);
                if(await postmodel.getName(postresult.fname, postresult.lname) === "Found" || await postmodel.getEmail(postresult.email) === "Found"){
                    return 'An account with the same name or email already exists!'
                }
                else{
                    if(await postmodel.insert()==='Admin already exists!'){
                        return 'Admin already exists!'
                    }else{
                        await postmodel.insert();
                        return 'Successfully saved';
                    }
                }
                return 'Save successfully'
            case 'PUT':
                if(pathParam.id !== undefined){
                    const putresult = await getJSONDataFromRequestStream(req) as { fname: string, lname: string, email: string, password: string, role: string}
                    const putmodel = new account(pathParam.id);
                    if(await putmodel.getAccount() !== "Not found"){
                        putmodel.data = { ...putmodel.data, ...putresult };
                        await putmodel.update();
                        return 'Successfully updated';
                    }else{
                        return "Account ID not found"
                    }
                }else{
                    return "Account ID needs to be supplied";
                }
            case 'DELETE':
                if(pathParam.id !== undefined){
                    const deletemodel = new account(pathParam.id);
                    if(await deletemodel.getAccount() === "Not found"){
                        return "Account ID not found"
                    }else{
                        if(await deletemodel.data.role === "Admin"){
                            await deletemodel.delete();
                            return "Admin role is deleted";
                        }else{
                            await deletemodel.delete();
                            return 'Successfully deleted';
                        }
                    }
                }else{
                    return "Account ID needs to be supplied"
                }
            default:
                const listing = await selectDB('Account');
                return listing;
                //break;
        }
    }
    catch (err: any) {
        throw new Error(err);
    }
    return 'yes'
}