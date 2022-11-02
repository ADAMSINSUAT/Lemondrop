import { createServer, IncomingMessage, ServerResponse } from "http";
import { companyRequest } from "./api/company";
import { employeeRequest } from "./api/employee";
import { employerRequest } from "./api/employer";
import { leaveRequest } from "./api/leave";
import { loginRequest } from "./api/login";
import { accountRequest } from "./api/account";
import { adminRequest } from "./api/admin";
import account from "../__data__/account";
import { overtimeRequest } from "./api/overtime";
import { absenceRequest } from "./api/absence";
import { dailywageRequest } from "./api/dailywage";
import { leavesRemRequest } from "./api/leavesRem";
import { totAbsRequest } from "./api/totAbs";
import { totOTRequest } from "./api/totOT";
import { monthlyWageRequest } from "./api/mnthWage";
import * as jwt from "./jwt"
import { getJSONDataFromRequestStream } from "./generateParams";
import { errors, jwtDecrypt, jwtVerify } from "jose";
import _ from "lodash";

const listener = async(req: IncomingMessage, res: ServerResponse) =>{
    const roles =["Admin", "Employer", "Employee"]
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Max-Age": 2592000, // 30 days
        /** add other headers as per requirement */
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers" : "Content-Type, Authorization"
    }
    if(req.method === "OPTIONS"){
        res.writeHead(204, headers);
        res.end();
        return;
    }
    try{
        
        let result: string | object = ''
        let verifytoken:any;
        const request: any = req.headers.authorization !== undefined ? req.headers.authorization : "";
        //console.log(verifyToken)
        //const reqData = await getJSONDataFromRequestStream(req)
        // const payload = await getJSONDataFromRequestStream(req.)
        // const accessToken = await jwt.verify(payload);
        if (request.length > 0) {
            const token = request.split(" ")
            const verifyToken = await jwt.verify(token[1])
            // verifytoken = verifyToken;
            if (verifyToken === true) {
                if ((req.url as string).match('/company(.*?)')) {
                    result = await companyRequest(req) as string | object
                }
                else if ((req.url as string).match('/employer(.*?)')) {
                    result = await employerRequest(req) as string | object
                }
                else if ((req.url as string).match('/account(.*?)')) {
                    result = await accountRequest(req) as string | object
                }
                else if ((req.url as string).match('/admin(.*?)')) {
                    result = await adminRequest(req) as string | object
                }
                else if ((req.url as string).match('/employer(.*?)')) {
                    result = await employerRequest(req) as string | object
                }
                else if ((req.url as string).match('/employee/dailywage(.*?)')) {
                    result = await dailywageRequest(req) as string | object
                }
                else if ((req.url as string).match('/employee/monthlywage(.*?)')) {
                    result = await monthlyWageRequest(req) as string | object
                }
                else if ((req.url as string).match('/employee/leaves(.*?)')) {
                    result = await leavesRemRequest(req) as string | object
                }
                else if ((req.url as string).match('/employee/leave(.*?)')) {
                    result = await leaveRequest(req) as string | object
                }
                else if ((req.url as string).match('/employee/overtimes(.*?)')) {
                    result = await totOTRequest(req) as string | object
                }
                else if ((req.url as string).match('/employee/overtime(.*?)')) {
                    result = await overtimeRequest(req) as string | object
                }
                else if ((req.url as string).match('/employee/absences(.*?)')) {
                    result = await totAbsRequest(req) as string | object
                }
                else if ((req.url as string).match('/employee/absence(.*?)')) {
                    result = await absenceRequest(req) as string | object
                }
                else if ((req.url as string).match('/employee(.*?)')) {
                    result = await employeeRequest(req) as string | object
                }
            }
        }
        else {
            if ((req.url as string).match('/login(.*?)')) {
                result = await loginRequest(req) as string | object
            }
        }
        // console.log(verifytoken)
        res.writeHead(200, headers);
        res.end(JSON.stringify(result));
        // if(typeof verifytoken !== "undefined" && verifytoken === true){
        //     res.writeHead(200, headers);
        //     res.end(JSON.stringify(result));
        // }
        // else{
        //     res.writeHead(403, headers);
        //     res.end(JSON.stringify(verifytoken))
        // }
    } catch (error) {
        console.log(error)
        res.writeHead(400, headers);
        res.end(JSON.stringify(error))
    }
}

const server = createServer(listener);
server.listen(8080);