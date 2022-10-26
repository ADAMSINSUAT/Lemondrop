import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream } from "../generateParams";
import { selectDB } from "../lib/database/query";

export const loginRequest = async (req: IncomingMessage) =>{
    switch(req.method){
        case 'GET':
            const result = await getJSONDataFromRequestStream(req) as {email: string, password: string}
            const where = `email='${result.email}' AND password='${result.password}'`;
            const get = await selectDB("Account", where)
            if(get.length>0){
                return "Login successful";
            }else{
                return "Invalid email and password";
            }
            default:
                break;
    }
    return 'yes'
}