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
                const postmodel = new account(postresult);
                if(await postmodel.getName(postresult.fname, postresult.lname) === "Found" || await postmodel.getEmail(postresult.email) !== "Not Found"){
                    return 'An account with the same name or email already exists!'
                }
                else{
                    return await postmodel.insert() === "Admin already exists!" ? "Admin already exists!" : "Successfully saved"
                }
            case 'PUT':
                if(pathParam.id !== undefined){
                    const putresult = await getJSONDataFromRequestStream(req) as { fname: string, lname: string, email: string, password: string, role: string}
                    const putmodel = new account(pathParam.id);
                    const accountModel = await selectDB("Account");
                    let fullNameChck = false;
                    let emailChck = false;
                    let adminChck = false;
                    if (await putmodel.getAccount() !== "Not found") {
                        const accountFilter = _.filter(accountModel, function (value) {
                            return value.accID !== pathParam.id;
                        })
                        _.map(accountFilter, (value, index) => {
                            if (accountFilter[index].fname.toString() + accountFilter[index].lname.toString() === putresult.fname + putresult.lname) {
                                fullNameChck = true;
                            }
                            if(accountFilter[index].email.toString() === putresult.email){
                                emailChck = true;
                            }
                            if(accountFilter[index].role === "Admin" && putresult.role === "Admin"){
                                adminChck = true;
                            }
                        })
                        if(fullNameChck){
                            return "Fullname is already registered!"
                        }else if(emailChck){
                            return "Email is already being used!"
                        }else if(fullNameChck && emailChck){
                            return "Email and fullname is already being used!"
                        }else if(adminChck){
                            return "An admin already exists!"
                        }
                        else{
                            putmodel.data = { ...putmodel.data, ...putresult };
                            await putmodel.update();
                            return putmodel.data
                            //return "Successfully updated"
                        }
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