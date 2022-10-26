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

const listener = async(req: IncomingMessage, res: ServerResponse) =>{
    try{
        let result: string | object = ''
        if((req.url as string).match('/login(.*?)')){
            result = await loginRequest(req) as string | object
        }
        else if((req.url as string).match('/company(.*?)')){
            result = await companyRequest(req) as string | object
        }
        else if((req.url as string).match('/employer(.*?)')){
            result = await employerRequest(req) as string | object
        }
        else if((req.url as string).match('/account(.*?)')){
            result = await accountRequest(req) as string | object
        }
        else if((req.url as string).match('/admin(.*?)')){
            result = await adminRequest(req) as string | object
        }
        else if((req.url as string).match('/employer(.*?)')){
            result = await employerRequest(req) as string | object
        }
        else if((req.url as string).match('/employee/dailywage(.*?)')){
            result = await dailywageRequest(req) as string | object
        }
        else if((req.url as string).match('/employee/monthlywage(.*?)')){
            result = await monthlyWageRequest(req) as string | object
        }
        else if((req.url as string).match('/employee/leaves(.*?)')){
            result = await leavesRemRequest(req) as string | object
        }
        else if((req.url as string).match('/employee/leave(.*?)')){
            result = await leaveRequest(req) as string | object
        }
        else if((req.url as string).match('/employee/overtimes(.*?)')){
            result = await totOTRequest(req) as string | object
        }
        else if((req.url as string).match('/employee/overtime(.*?)')){
            result = await overtimeRequest(req) as string | object
        }
        else if((req.url as string).match('/employee/absences(.*?)')){
            result = await totAbsRequest(req) as string | object
        }
        else if((req.url as string).match('/employee/absence(.*?)')){
            result = await absenceRequest(req) as string | object
        }
        else if((req.url as string).match('/employee(.*?)')){
            result = await employeeRequest(req) as string | object
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(result));
    }
    catch(error){
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(error));
    }
}

const server = createServer(listener);
server.listen(8080);